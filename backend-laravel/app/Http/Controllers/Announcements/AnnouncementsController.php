<?php

namespace App\Http\Controllers\Announcements;

use App\Http\Controllers\Controller;
use App\Http\Requests\Announcements\CreateAnnouncementRequest;
use App\Services\Announcements\AnnouncementsService;
use Illuminate\Http\JsonResponse;

class AnnouncementsController extends Controller
{
    public function __construct(
        private readonly AnnouncementsService $announcementsService
    ) {
    }

    public function create(CreateAnnouncementRequest $request): JsonResponse
    {
        return response()->json($this->announcementsService->create($request->validated()), 201);
    }

    public function list(): JsonResponse
    {
        return response()->json($this->announcementsService->list(), 200);
    }
}
