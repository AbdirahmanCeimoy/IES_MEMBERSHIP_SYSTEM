<?php

namespace App\Services\Announcements;

use App\Models\Announcement;

class AnnouncementsService
{
    public function create(array $dto): array
    {
        $announcement = Announcement::query()->create([
            'title' => $dto['title'],
            'body' => $dto['body'],
            'channel' => $dto['channel'],
        ]);

        return $this->serializeModel($announcement);
    }

    public function list(): array
    {
        return Announcement::query()
            ->orderByDesc('createdAt')
            ->get()
            ->map(fn (Announcement $announcement): array => $this->serializeModel($announcement))
            ->all();
    }

    private function serializeModel(Announcement $model): array
    {
        return json_decode(json_encode($model, JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
    }
}
