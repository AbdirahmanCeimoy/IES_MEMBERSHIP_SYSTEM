<?php

namespace App\Http\Controllers\Newsletters;

use App\Http\Controllers\Controller;
use App\Jobs\Newsletters\SendNewsletterDeliveryJob;
use App\Models\Newsletter;
use App\Models\NewsletterDelivery;
use App\Models\NewsletterSubscriber;
use App\Services\Newsletters\NewsletterCampaignService;
use App\Services\Newsletters\ResendMailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminNewslettersController extends Controller
{
    public function __construct(
        private readonly NewsletterCampaignService $campaigns,
        private readonly ResendMailService $mail,
    ) {}

    public function dashboard(): JsonResponse
    {
        $subs = DB::table('NewsletterSubscriber')
            ->selectRaw('status, COUNT(*) as c')
            ->groupBy('status')
            ->pluck('c', 'status');

        $campaigns = DB::table('Newsletter')
            ->selectRaw('status, COUNT(*) as c')
            ->groupBy('status')
            ->pluck('c', 'status');

        $deliveries = DB::table('NewsletterDelivery')
            ->selectRaw('status, COUNT(*) as c')
            ->groupBy('status')
            ->pluck('c', 'status');

        return response()->json([
            'subscribers' => [
                'total' => (int) array_sum($subs->all()),
                'subscribed' => (int) ($subs[NewsletterSubscriber::STATUS_SUBSCRIBED] ?? 0),
                'pending' => (int) ($subs[NewsletterSubscriber::STATUS_PENDING] ?? 0),
                'unsubscribed' => (int) ($subs[NewsletterSubscriber::STATUS_UNSUBSCRIBED] ?? 0),
                'suppressed' => (int) ($subs[NewsletterSubscriber::STATUS_SUPPRESSED] ?? 0),
            ],
            'campaigns' => [
                'total' => (int) array_sum($campaigns->all()),
                'draft' => (int) ($campaigns[Newsletter::STATUS_DRAFT] ?? 0),
                'sending' => (int) ($campaigns[Newsletter::STATUS_SENDING] ?? 0),
                'sent' => (int) ($campaigns[Newsletter::STATUS_SENT] ?? 0),
                'partially_failed' => (int) ($campaigns[Newsletter::STATUS_PARTIALLY_FAILED] ?? 0),
                'failed' => (int) ($campaigns[Newsletter::STATUS_FAILED] ?? 0),
            ],
            'deliveries' => [
                'queued' => (int) ($deliveries[NewsletterDelivery::STATUS_QUEUED] ?? 0),
                'sent' => (int) ($deliveries[NewsletterDelivery::STATUS_SENT] ?? 0),
                'delivered' => (int) ($deliveries[NewsletterDelivery::STATUS_DELIVERED] ?? 0),
                'bounced' => (int) ($deliveries[NewsletterDelivery::STATUS_BOUNCED] ?? 0),
                'failed' => (int) ($deliveries[NewsletterDelivery::STATUS_FAILED] ?? 0),
            ],
        ]);
    }

    public function listSubscribers(Request $request): JsonResponse
    {
        $query = NewsletterSubscriber::query()->orderByDesc('createdAt');

        if ($search = $request->query('q')) {
            $query->where('email', 'like', '%' . strtolower((string) $search) . '%');
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $perPage = min((int) $request->query('perPage', 50), 200);
        $page = max(1, (int) $request->query('page', 1));
        $total = (clone $query)->count();
        $items = $query->forPage($page, $perPage)->get(['id', 'email', 'status', 'emailVerifiedAt', 'unsubscribedAt', 'source', 'createdAt']);

        return response()->json([
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'perPage' => $perPage,
        ]);
    }

    public function suppressSubscriber(string $id): JsonResponse
    {
        $sub = NewsletterSubscriber::findOrFail($id);
        $sub->status = NewsletterSubscriber::STATUS_SUPPRESSED;
        $sub->unsubscribedAt = $sub->unsubscribedAt ?: now();
        $sub->save();
        return response()->json(['success' => true]);
    }

    public function listCampaigns(Request $request): JsonResponse
    {
        $perPage = min((int) $request->query('perPage', 25), 100);
        $page = max(1, (int) $request->query('page', 1));
        $query = Newsletter::query()->orderByDesc('createdAt');
        $total = (clone $query)->count();
        $items = $query->forPage($page, $perPage)
            ->get(['id', 'subject', 'previewText', 'status', 'recipientCount', 'acceptedCount', 'deliveredCount', 'bouncedCount', 'failedCount', 'startedAt', 'completedAt', 'createdAt']);

        return response()->json([
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'perPage' => $perPage,
        ]);
    }

    public function createCampaign(Request $request): JsonResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'previewText' => ['nullable', 'string', 'max:255'],
            'contentHtml' => ['required', 'string', 'max:200000'],
            'contentText' => ['nullable', 'string', 'max:200000'],
        ]);

        $user = $request->user();
        $createdBy = $user ? ($user->id ?? null) : null;
        $newsletter = $this->campaigns->createDraft($data, $createdBy);

        return response()->json(['item' => $newsletter], 201);
    }

    public function getCampaign(string $id): JsonResponse
    {
        return response()->json(['item' => Newsletter::findOrFail($id)]);
    }

    public function updateCampaign(string $id, Request $request): JsonResponse
    {
        $data = $request->validate([
            'subject' => ['nullable', 'string', 'max:255'],
            'previewText' => ['nullable', 'string', 'max:255'],
            'contentHtml' => ['nullable', 'string', 'max:200000'],
            'contentText' => ['nullable', 'string', 'max:200000'],
        ]);

        $newsletter = Newsletter::findOrFail($id);
        try {
            $this->campaigns->updateDraft($newsletter, $data);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 409);
        }

        return response()->json(['item' => $newsletter]);
    }

    public function deleteCampaign(string $id): JsonResponse
    {
        $newsletter = Newsletter::findOrFail($id);
        if ($newsletter->status !== Newsletter::STATUS_DRAFT) {
            return response()->json(['success' => false, 'message' => 'Only drafts can be deleted.'], 409);
        }
        $newsletter->delete();
        return response()->json(['success' => true]);
    }

    public function eligibleRecipientCount(): JsonResponse
    {
        return response()->json(['count' => $this->campaigns->eligibleRecipientCount()]);
    }

    public function sendTest(string $id, Request $request): JsonResponse
    {
        $data = $request->validate([
            'to' => ['required', 'email:rfc', 'max:255'],
        ]);
        $newsletter = Newsletter::findOrFail($id);

        $html = '<div style="padding:12px;background:#fff3cd;color:#78350f;margin-bottom:16px;border-radius:8px">TEST SEND — this is a preview, not sent to subscribers.</div>' . $newsletter->contentHtml;
        $text = ($newsletter->contentText ?: strip_tags($newsletter->contentHtml));

        $this->mail->send(
            to: $data['to'],
            subject: '[TEST] ' . $newsletter->subject,
            html: $html,
            text: $text,
        );

        return response()->json(['success' => true]);
    }

    public function send(string $id): JsonResponse
    {
        $newsletter = Newsletter::findOrFail($id);
        try {
            $result = $this->campaigns->dispatch($newsletter);
        } catch (\DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 409);
        }

        return response()->json([
            'success' => true,
            'queued' => $result['queued'],
            'item' => $result['newsletter'],
        ], 202);
    }

    public function campaignDeliveries(string $id, Request $request): JsonResponse
    {
        $perPage = min((int) $request->query('perPage', 100), 500);
        $page = max(1, (int) $request->query('page', 1));
        $query = NewsletterDelivery::query()->where('newsletterId', $id)->orderByDesc('createdAt');
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        $total = (clone $query)->count();
        $items = $query->forPage($page, $perPage)->get(['id', 'email', 'status', 'providerMessageId', 'sentAt', 'deliveredAt', 'bouncedAt', 'failureReason', 'attempts', 'createdAt']);

        return response()->json([
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'perPage' => $perPage,
        ]);
    }

    public function retryFailed(string $id): JsonResponse
    {
        $failed = NewsletterDelivery::query()
            ->where('newsletterId', $id)
            ->where('status', NewsletterDelivery::STATUS_FAILED)
            ->get();

        $requeued = 0;
        foreach ($failed as $delivery) {
            $delivery->status = NewsletterDelivery::STATUS_QUEUED;
            $delivery->failureReason = null;
            $delivery->save();
            SendNewsletterDeliveryJob::dispatch($delivery->id)->onQueue('newsletters');
            $requeued++;
        }

        // Reset failed count — it will be reincremented by the worker if they fail again.
        $newsletter = Newsletter::find($id);
        if ($newsletter) {
            $newsletter->failedCount = 0;
            $newsletter->status = Newsletter::STATUS_SENDING;
            $newsletter->completedAt = null;
            $newsletter->save();
        }

        return response()->json(['success' => true, 'requeued' => $requeued]);
    }
}
