# Newsletter Subscription System — Setup

Covers subscription, confirmation, unsubscribe, campaigns via Resend, and queue-based delivery. The feature is additive — no existing authentication, routes, or SMTP configuration were modified.

## 1. Environment variables

Add these to `backend-laravel/.env` (already appended to `.env.example`):

```
QUEUE_CONNECTION=database
NEWSLETTER_QUEUE=newsletters

FRONTEND_URL=https://your-frontend-domain.example

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM="IES Newsletter <no-reply@your-verified-domain.example>"
RESEND_REPLY_TO=newsletter@iesomalia.org.so
RESEND_WEBHOOK_SECRET=generate_a_long_random_string
```

Frontend (`frontend/.env.local` or deployment env):

```
NEXT_PUBLIC_API_BASE=https://your-api-domain.example/api
```

`RESEND_FROM` must use a verified sending domain configured in your Resend account. Never put `RESEND_*` keys into `NEXT_PUBLIC_*` — they must stay server-side.

## 2. Database migrations

```
php artisan migrate
```

This creates: `NewsletterSubscriber`, `Newsletter`, `NewsletterDelivery`, and the `jobs` / `failed_jobs` / `job_batches` tables (only if they don't already exist).

## 3. Queue worker

Campaigns are dispatched one delivery at a time onto the `newsletters` queue. In production, run a long-lived worker:

```
php artisan queue:work database --queue=newsletters --tries=3 --backoff=30 --timeout=60
```

Supervise it with systemd / Supervisor / your platform's process manager. Restart it after deploys with `php artisan queue:restart`.

For local testing you can run the same command in a terminal while the dev app is running.

## 4. Resend webhook (optional but recommended)

To track `delivered` / `bounced` / `complained` states beyond the initial "accepted by API", configure a Resend webhook pointing at:

```
POST https://your-api-domain.example/api/newsletters/webhooks/resend
Header: X-Webhook-Secret: <same value as RESEND_WEBHOOK_SECRET>
```

Or, if your Resend integration only lets you add a query string:

```
POST https://your-api-domain.example/api/newsletters/webhooks/resend?secret=<RESEND_WEBHOOK_SECRET>
```

The endpoint accepts events `email.sent`, `email.delivered`, `email.bounced`, `email.complained`. Bounces and complaints automatically suppress the recipient from future campaigns.

## 5. API surface

Public (no auth):

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/newsletters/subscribe` | `{ email, source? }` — accepts an email, sends confirmation. |
| POST / GET | `/api/newsletters/confirm/{token}` | Confirms a pending subscription. |
| POST / GET | `/api/newsletters/unsubscribe/{token}` | Unsubscribes by token. |
| POST | `/api/newsletters/webhooks/resend` | Resend events (secret-gated). |

Admin (JWT, role: ADMIN):

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/admin/newsletters/dashboard` | Aggregated counts. |
| GET | `/api/admin/newsletters/eligible-count` | Confirmed subscriber count. |
| GET | `/api/admin/newsletters/subscribers` | Paginated subscriber list (`q`, `status`, `page`, `perPage`). |
| PATCH | `/api/admin/newsletters/subscribers/{id}/suppress` | Suppress a subscriber. |
| GET | `/api/admin/newsletters/campaigns` | Paginated campaign list. |
| POST | `/api/admin/newsletters/campaigns` | Create a draft (`subject`, `previewText?`, `contentHtml`, `contentText?`). |
| GET | `/api/admin/newsletters/campaigns/{id}` | Fetch a campaign. |
| PATCH | `/api/admin/newsletters/campaigns/{id}` | Update a draft. |
| DELETE | `/api/admin/newsletters/campaigns/{id}` | Delete a draft. |
| POST | `/api/admin/newsletters/campaigns/{id}/test` | Send a test to a single email (`to`). |
| POST | `/api/admin/newsletters/campaigns/{id}/send` | Queue campaign for sending. Idempotent. Returns 202 with queued count. |
| GET | `/api/admin/newsletters/campaigns/{id}/deliveries` | Per-recipient delivery rows. |
| POST | `/api/admin/newsletters/campaigns/{id}/retry-failed` | Requeue only the `failed` deliveries. |

## 6. Idempotency and duplicate protection

- `NewsletterSubscriber.email` is `UNIQUE`. Concurrent subscribes race on a `lockForUpdate` row to the same winner.
- `/send` transitions the campaign to `sending` under a row lock — repeat calls return 409.
- `NewsletterDelivery` has `UNIQUE (newsletterId, email)` — if a page refresh re-queues, duplicates are rejected before dispatch.
- Webhook events use the Resend message id first and fall back to recipient email.

## 7. Security notes

- Subscribe endpoint is rate-limited per-IP (10/min) and per-email (3/10min) with `RateLimiter`.
- Tokens are 64-char random strings and only live server-side; the client only ever sees them in email links.
- Admin endpoints require `jwt.auth` + `role:ADMIN` (reuses existing middleware; nothing new introduced).
- Confirmation and unsubscribe pages run server-side on Next.js and never embed API secrets in client bundles.
- Private HTML is sanitized at render time only to the extent needed for emails; the admin composer accepts raw HTML from an authenticated admin. If you later add a WYSIWYG editor, pass its output through a server-side allowlist sanitizer before storing.

## 8. What is NOT included (deferred to Phase 3)

- Admin UI pages under `/admin/newsletters/` (dashboard, subscribers table, composer, history). The backend API is complete and consumable.
- Automated test suite (Phase 4). The structure is in place to add Pest/PHPUnit tests under `tests/Feature/Newsletters/`.
- Resend package via Composer. The service calls Resend's REST API through Laravel's native `Http` client, so no new dependency is needed.

## 9. Smoke test

```
# From the backend:
php artisan migrate
php artisan queue:work database --queue=newsletters &

# From a client:
curl -X POST https://your-api/api/newsletters/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com"}'

# Check the confirmation email, click the link. Then:
curl https://your-api/api/admin/newsletters/eligible-count -H 'Authorization: Bearer <ADMIN JWT>'
```
