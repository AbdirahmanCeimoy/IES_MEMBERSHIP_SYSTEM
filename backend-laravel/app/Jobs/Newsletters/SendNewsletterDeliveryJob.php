<?php

namespace App\Jobs\Newsletters;

use App\Models\Newsletter;
use App\Models\NewsletterDelivery;
use App\Services\Newsletters\NewsletterCampaignService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNewsletterDeliveryJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;
    public int $backoff = 30; // seconds

    public function __construct(public string $deliveryId) {}

    public function handle(NewsletterCampaignService $service): void
    {
        $delivery = NewsletterDelivery::find($this->deliveryId);
        if (! $delivery) {
            return;
        }

        try {
            $service->sendDelivery($delivery);
        } finally {
            if ($newsletter = Newsletter::find($delivery->newsletterId)) {
                $service->finalizeIfComplete($newsletter);
            }
        }
    }

    public function failed(\Throwable $e): void
    {
        $delivery = NewsletterDelivery::find($this->deliveryId);
        if ($delivery && $delivery->status === NewsletterDelivery::STATUS_QUEUED) {
            $delivery->status = NewsletterDelivery::STATUS_FAILED;
            $delivery->failureReason = substr('Job failed: ' . $e->getMessage(), 0, 1024);
            $delivery->save();
        }
    }
}
