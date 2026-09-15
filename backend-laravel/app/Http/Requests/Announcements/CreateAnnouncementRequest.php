<?php

namespace App\Http\Requests\Announcements;

use App\Http\Requests\BaseNestFormRequest;

class CreateAnnouncementRequest extends BaseNestFormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['string'],
            'body' => ['string'],
            'channel' => ['string'],
        ];
    }

    protected function requiredFields(): array
    {
        return [
            'title',
            'body',
            'channel',
        ];
    }

    public function messages(): array
    {
        return [
            'title.string' => 'title must be a string',
            'body.string' => 'body must be a string',
            'channel.string' => 'channel must be a string',
        ];
    }
}
