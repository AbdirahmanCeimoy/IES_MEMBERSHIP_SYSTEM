# Production Switch-Over

This checklist assumes the original NestJS backend in [`/backend`](c:/Users/apdir/OneDrive/Documents/ies/backend) remains the source of truth until cutover is complete.

## 1. Freeze The Public API Contract

- Keep the same public API URL if possible.
- Preferred: switch the reverse proxy upstream from NestJS to Laravel while preserving the same external `/api` hostname and path.
- Only change frontend deploy env `NEXT_PUBLIC_API_BASE` if the public API hostname must change.
- Current frontend API base is read from [`frontend/lib/apiClient.ts`](c:/Users/apdir/OneDrive/Documents/ies/frontend/lib/apiClient.ts).

## 2. Map Old Env To New Env

Use the old backend env in [`backend/.env`](c:/Users/apdir/OneDrive/Documents/ies/backend/.env) as the reference.

| Old NestJS env | New Laravel env | Rule |
|---|---|---|
| `JWT_SECRET` | `JWT_SECRET` | Use the exact same value to preserve active token validation. |
| `JWT_EXPIRES_IN` | `JWT_EXPIRES_IN` | Keep identical. |
| `CORS_ORIGINS` | `CORS_ORIGINS` | Keep identical. |
| `RATE_LIMIT_WINDOW_MS` | `RATE_LIMIT_WINDOW_MS` | Keep identical. |
| `RATE_LIMIT_MAX_REQUESTS` | `RATE_LIMIT_MAX_REQUESTS` | Keep identical. |
| `SMTP_HOST` | `SMTP_HOST` | Keep identical. |
| `SMTP_PORT` | `SMTP_PORT` | Keep identical. |
| `SMTP_USER` | `SMTP_USER` | Keep identical. |
| `SMTP_PASS` | `SMTP_PASS` | Keep identical. |
| `SMTP_FROM` | `SMTP_FROM` | Keep identical. |
| `SMTP_SECURE` | `SMTP_SECURE` | Keep identical. |
| `SMTP_REPLY_TO` | `SMTP_REPLY_TO` | Copy if used. |
| `SMTP_AUDIT_BCC` | `SMTP_AUDIT_BCC` | Copy if used. |
| `MAIL_BRAND_LOGO_URL` | `MAIL_BRAND_LOGO_URL` | Optional override if email branding logo is hosted on a different public URL. |
| `MEMBERSHIP_DOCUMENTS_ROOT` | `MEMBERSHIP_DOCUMENTS_ROOT` | Point to a persistent absolute path outside the release directory. |
| `DATABASE_URL=file:...` | `DB_*` | Replace with MySQL connection fields. |
| `PORT` | web server / process manager | Set at Nginx, Apache, FPM, or service level. |
| `NODE_ENV` | `APP_ENV` + `APP_DEBUG` | `production` => `APP_ENV=production`, `APP_DEBUG=false`. |

Use [`backend-laravel/.env.production.example`](c:/Users/apdir/OneDrive/Documents/ies/backend-laravel/.env.production.example) as the Laravel production template.

## 3. Deploy Order

1. Provision MySQL and import or migrate data before traffic switch.
2. Deploy Laravel code to a separate backend target.
3. Copy production env into `backend-laravel/.env`.
4. Run:

```powershell
cd backend-laravel
"C:\Users\apdir\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe" -c php.ini composer.phar install --no-interaction --no-dev --optimize-autoloader
"C:\Users\apdir\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe" -c php.ini artisan migrate --force
```

5. Verify Laravel target before cutover.
6. Cut traffic by switching the API upstream from NestJS to Laravel.
7. Keep the old NestJS backend online but not receiving traffic until rollback window closes.

## 3A. Security Checklist

- Use `APP_URL=https://...` only.
- Keep `APP_DEBUG=false`.
- Use `CACHE_STORE=database` or another shared production-safe cache backend.
- Set `MAIL_EHLO_DOMAIN` to the live mail hostname.
- Keep `SMTP_ALLOW_SELF_SIGNED=false`.
- Ensure `CORS_ORIGINS` contains only live HTTPS frontend origins.
- Set `MEMBERSHIP_DOCUMENTS_ROOT` to a mounted persistent folder outside `backend-laravel/`.
- Serve the official logo from the deployed public host, or set `MAIL_BRAND_LOGO_URL` if email branding should load from another trusted host.

## 4. Frontend Redirect

Two safe options:

- Preferred: do not change frontend code or frontend env. Keep the same public API hostname and only move the proxy upstream.
- If API hostname must change: redeploy frontend with `NEXT_PUBLIC_API_BASE` set to the Laravel API base. The variable contract is shown in [`frontend/.env.local.example`](c:/Users/apdir/OneDrive/Documents/ies/frontend/.env.local.example).

## 5. Verification Before Cutover

For side-by-side staging parity, run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\remote-parity.ps1 -OldApiBase "https://old-api.example.com/api" -NewApiBase "https://new-api.example.com/api"
```

This uses [`scripts/compare-backends.mjs`](c:/Users/apdir/OneDrive/Documents/ies/scripts/compare-backends.mjs). It creates test users, so use it against staging, a clone, or a safe pre-cutover environment.

## 6. Verification After Cutover

Create one dedicated smoke user in production, then run:

```powershell
$env:API_BASE="https://api.example.com/api"
$env:SMOKE_USERNAME="smoke_member"
$env:SMOKE_PASSWORD="replace-with-password"
node scripts\cutover-smoke.mjs
```

The smoke script is [`scripts/cutover-smoke.mjs`](c:/Users/apdir/OneDrive/Documents/ies/scripts/cutover-smoke.mjs).

## 7. Rollback

Rollback trigger examples:

- login response shape mismatch
- JWT rejection for valid old tokens
- membership verification mismatch
- upload, admin, or document download regression

Rollback steps:

1. Move proxy traffic back to the old NestJS backend.
2. Leave Laravel database untouched for forensics.
3. Keep the exact same frontend deployment.
4. Capture request/response diffs from the failing endpoint.
5. Fix Laravel parity issue offline.
6. Re-run staging parity before a second cutover attempt.

## 8. Current Verified State

- Local Laravel contract tests pass.
- Local side-by-side parity smoke pass is green against the current old backend runtime.
- Laravel now exposes `/api/health/live` and `/api/health/ready` for hosting probes and readiness checks.
- Membership documents can be moved onto a persistent host path using `MEMBERSHIP_DOCUMENTS_ROOT`.
