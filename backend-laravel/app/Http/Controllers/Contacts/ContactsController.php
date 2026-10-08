<?php

namespace App\Http\Controllers\Contacts;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactsController extends Controller
{
    /**
     * Public endpoint — stores a contact or report submission.
     *
     * POST /contact
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['nullable', Rule::in(['contact', 'report'])],
            'category' => ['nullable', 'string', 'max:64'],
            'name' => ['required_without:anonymous', 'nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:10000'],
            'regNumber' => ['nullable', 'string', 'max:64'],
            'isMember' => ['nullable', 'boolean'],
            'anonymous' => ['nullable', 'boolean'],
        ]);

        $anonymous = (bool) ($data['anonymous'] ?? false);

        $submission = ContactSubmission::create([
            'type' => $data['type'] ?? 'contact',
            'category' => $data['category'] ?? null,
            'name' => $anonymous ? 'Anonymous' : ($data['name'] ?? 'Anonymous'),
            'email' => $anonymous ? null : ($data['email'] ?? null),
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'],
            'message' => $data['message'],
            'regNumber' => $data['regNumber'] ?? null,
            'isMember' => (bool) ($data['isMember'] ?? false),
            'anonymous' => $anonymous,
            'status' => 'NEW',
            'ipAddress' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'id' => $submission->id,
            'message' => $submission->type === 'report'
                ? 'Your report has been received. Our Ethics Committee will review it.'
                : 'Your message has been received. Our team will respond shortly.',
        ], 201);
    }

    /**
     * Admin endpoint — list all submissions.
     *
     * GET /admin/contacts?type=report&status=NEW
     */
    public function list(Request $request): JsonResponse
    {
        $query = ContactSubmission::query()->orderByDesc('createdAt');

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $perPage = min((int) $request->query('perPage', 50), 200);
        $items = $query->limit($perPage)->get();

        return response()->json([
            'items' => $items,
            'count' => $items->count(),
        ]);
    }

    /**
     * Admin endpoint — fetch a single submission.
     *
     * GET /admin/contacts/{id}
     */
    public function get(string $id): JsonResponse
    {
        $submission = ContactSubmission::query()->findOrFail($id);
        return response()->json($submission);
    }

    /**
     * Admin endpoint — update status or add admin notes.
     *
     * PATCH /admin/contacts/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['nullable', Rule::in(['NEW', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED'])],
            'adminNotes' => ['nullable', 'string', 'max:10000'],
        ]);

        $submission = ContactSubmission::query()->findOrFail($id);
        $submission->fill($data);
        $submission->save();

        return response()->json($submission);
    }

    /**
     * Admin endpoint — delete a submission.
     *
     * DELETE /admin/contacts/{id}
     */
    public function remove(string $id): JsonResponse
    {
        ContactSubmission::query()->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}
