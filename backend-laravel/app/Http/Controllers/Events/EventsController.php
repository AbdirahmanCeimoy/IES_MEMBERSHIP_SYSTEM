<?php

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class EventsController extends Controller
{
    /**
     * GET /events - list published events (public).
     */
    public function listPublic(): JsonResponse
    {
        $rows = Event::query()
            ->where('status', 'PUBLISHED')
            ->orderByDesc('date')
            ->limit(50)
            ->get()
            ->map(fn ($e) => $this->serializeEvent($e))
            ->all();

        return response()->json(['events' => $rows]);
    }

    /**
     * GET /admin/events - list all events (admin).
     */
    public function listAdmin(): JsonResponse
    {
        $rows = Event::query()
            ->orderByDesc('date')
            ->get()
            ->map(function ($e) {
                $data = $this->serializeEvent($e);
                $data['registered'] = (int) EventRegistration::query()->where('eventId', $e->id)->count();
                return $data;
            })
            ->all();

        return response()->json(['events' => $rows]);
    }

    /**
     * POST /admin/events - create an event (admin).
     * Optionally notifies all members via bulk email.
     */
    public function create(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:SEMINAR,WEBINAR,WORKSHOP,TRAINING_PROGRAM,PANEL_DISCUSSION,CONFERENCE,CPD_COURSE,AGM,NETWORKING_EVENT'],
            'date' => ['required', 'date'],
            'time' => ['nullable', 'string', 'max:32'],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'notifyMembers' => ['nullable', 'boolean'],
        ]);

        $event = new Event();
        $event->id = (string) Str::uuid();
        $event->title = $validated['title'];
        $event->type = $validated['type'];
        $event->date = $validated['date'];
        $event->time = $validated['time'] ?? null;
        $event->location = $validated['location'] ?? null;
        $event->cpdHours = 0;
        $event->description = $validated['description'] ?? null;
        $event->status = 'PUBLISHED';
        $event->save();

        // Count eligible recipients up front so we can tell the admin how many
        // emails will be sent, but dispatch the actual send AFTER the response
        // reaches the browser. SMTP is slow — doing it inline makes "Publish"
        // spin for 20-40s.
        $notified = 0;
        if (! empty($validated['notifyMembers'])) {
            $notified = (int) User::query()
                ->where('role', 'MEMBER')
                ->whereNotNull('email')
                ->count();

            $eventId = $event->id;
            dispatch(function () use ($eventId): void {
                $fresh = Event::query()->find($eventId);
                if ($fresh) {
                    self::broadcastEventToMembers($fresh);
                }
            })->afterResponse();
        }

        return response()->json([
            'event' => $this->serializeEvent($event),
            'notified' => $notified,
        ], 201);
    }

    /**
     * POST /events/{id}/register - register the current member for an event.
     */
    public function register(Request $request, string $id): JsonResponse
    {
        $auth = $request->attributes->get('auth');
        $userId = is_array($auth) ? ($auth['sub'] ?? null) : null;
        if (! $userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $event = Event::query()->find($id);
        if (! $event || $event->status !== 'PUBLISHED') {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $existing = EventRegistration::query()
            ->where('eventId', $id)
            ->where('userId', $userId)
            ->first();
        if ($existing) {
            return response()->json(['message' => 'Already registered', 'registered' => true]);
        }

        $reg = new EventRegistration();
        $reg->id = (string) Str::uuid();
        $reg->eventId = $id;
        $reg->userId = $userId;
        $reg->save();

        // Send registration confirmation email asynchronously - do not block the response.
        $member = User::query()->find($userId);
        if ($member && $member->email) {
            $payload = [
                'memberName' => $member->fullName ?: $member->username,
                'memberEmail' => $member->email,
                'eventTitle' => $event->title,
                'eventType' => $this->formatType($event->type),
                'date' => optional($event->date)->format('d M Y'),
                'time' => $event->time ?? '-',
                'location' => $event->location ?? '-',
            ];
            dispatch(function () use ($payload): void {
                try {
                    app(\App\Services\Memberships\EventRegistrationConfirmationService::class)
                        ->send($payload);
                } catch (Throwable $e) {
                    Log::warning('Registration confirmation email failed: ' . $e->getMessage());
                }
            })->afterResponse();
        }

        return response()->json(['registered' => true, 'event' => $this->serializeEvent($event)]);
    }

    /** Human-readable label for the stored type enum. */
    private function formatType(?string $raw): string
    {
        if (! $raw) return '-';
        return match ($raw) {
            'TRAINING_PROGRAM' => 'Training Program',
            'PANEL_DISCUSSION' => 'Panel Discussion',
            'CPD_COURSE' => 'CPD Course',
            'AGM' => 'AGM',
            'NETWORKING_EVENT' => 'Networking Event',
            default => ucwords(strtolower(str_replace('_', ' ', $raw))),
        };
    }

    private function serializeEvent(Event $e): array
    {
        return [
            'id' => $e->id,
            'title' => $e->title,
            'type' => $e->type,
            'date' => optional($e->date)->toDateString(),
            'time' => $e->time,
            'location' => $e->location,
            'cpdHours' => (float) $e->cpdHours,
            'description' => $e->description,
            'status' => $e->status,
            'createdAt' => optional($e->createdAt)->toIso8601String(),
        ];
    }

    /**
     * Send a lightweight notification email to every MEMBER letting them
     * know a new event has been published. Fire-and-forget (does not
     * throw so event creation always succeeds).
     */
    /**
     * Public static helper so it can be called from a dispatchAfterResponse
     * closure without needing to re-instantiate a controller.
     */
    public static function broadcastEventToMembers(Event $event): int
    {
        $members = User::query()
            ->where('role', 'MEMBER')
            ->whereNotNull('email')
            ->pluck('email')
            ->toArray();

        if (empty($members)) return 0;

        try {
            /** @var \App\Services\Memberships\EventBroadcastService $svc */
            $svc = app(\App\Services\Memberships\EventBroadcastService::class);
            return $svc->broadcastNewEvent($members, [
                'title' => $event->title,
                'type' => self::formatTypeLabel($event->type),
                'date' => optional($event->date)->format('d M Y'),
                'time' => $event->time ?? '-',
                'location' => $event->location ?? '-',
                'cpdHours' => (float) $event->cpdHours,
                'description' => $event->description ?? '',
            ]);
        } catch (Throwable $exception) {
            Log::warning('Event broadcast failed: ' . $exception->getMessage());
            return 0;
        }
    }

    private static function formatTypeLabel(?string $raw): string
    {
        if (! $raw) return '-';
        return match ($raw) {
            'TRAINING_PROGRAM' => 'Training Program',
            'PANEL_DISCUSSION' => 'Panel Discussion',
            'CPD_COURSE' => 'CPD Course',
            'AGM' => 'AGM',
            'NETWORKING_EVENT' => 'Networking Event',
            default => ucwords(strtolower(str_replace('_', ' ', $raw))),
        };
    }
}
