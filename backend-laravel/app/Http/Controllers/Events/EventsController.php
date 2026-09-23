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
            'type' => ['required', 'string', 'in:WORKSHOP,SEMINAR,CONFERENCE,AGM,TRAINING'],
            'date' => ['required', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'cpdHours' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'notifyMembers' => ['nullable', 'boolean'],
        ]);

        $event = new Event();
        $event->id = (string) Str::uuid();
        $event->title = $validated['title'];
        $event->type = $validated['type'];
        $event->date = $validated['date'];
        $event->location = $validated['location'] ?? null;
        $event->cpdHours = $validated['cpdHours'] ?? 0;
        $event->description = $validated['description'] ?? null;
        $event->status = 'PUBLISHED';
        $event->save();

        $notified = 0;
        if (! empty($validated['notifyMembers'])) {
            $notified = $this->notifyMembersOfEvent($event);
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

        return response()->json(['registered' => true, 'event' => $this->serializeEvent($event)]);
    }

    private function serializeEvent(Event $e): array
    {
        return [
            'id' => $e->id,
            'title' => $e->title,
            'type' => $e->type,
            'date' => optional($e->date)->toDateString(),
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
    private function notifyMembersOfEvent(Event $event): int
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
                'type' => $event->type,
                'date' => optional($event->date)->format('d M Y'),
                'location' => $event->location ?? '',
                'cpdHours' => (float) $event->cpdHours,
                'description' => $event->description ?? '',
            ]);
        } catch (Throwable $exception) {
            Log::warning('Event broadcast failed: ' . $exception->getMessage());
            return 0;
        }
    }
}
