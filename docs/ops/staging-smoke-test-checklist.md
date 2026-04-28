# Staging Smoke Test Checklist

Run this checklist after deploying `apps/api`, `apps/ams`, and `apps/portal` to
staging, and before enabling public production traffic.

## Preconditions

- [ ] `pnpm typecheck:all` passed.
- [ ] `pnpm lint:all` passed with no errors.
- [ ] `pnpm build:all` passed.
- [ ] API, AMS, and portal are deployed as separate app targets.
- [ ] Staging database migrations are applied.
- [ ] Test users exist for:
  - [ ] AMS admin
  - [ ] AMS coach/staff user
  - [ ] Portal client/player user
  - [ ] user without access to a selected player/facility

## Env And Secrets

### API

- [ ] `DATABASE_URL` points to the staging database.
- [ ] `API_INTERNAL_AUTH_SECRET` is set and matches AMS/portal.
- [ ] `CRON_SECRET` is set.
- [ ] `PORTAL_APP_URL` points to the staging portal URL.
- [ ] `PORTAL_EMAIL_API_KEY` is set to a staging-safe email provider key.
- [ ] `PORTAL_EMAIL_FROM` is set to a verified staging sender.
- [ ] `ARMCARE_STATUS` is set to the intended staging/prod mode.
- [ ] `ARMCARE_USERNAME` is set only on API.
- [ ] `ARMCARE_PASSWORD` is set only on API.
- [ ] `ARMCARE_AUTH_URL_STAGING` and `ARMCARE_API_URL_STAGING` are set.
- [ ] `ARMCARE_AUTH_URL_PROD` and `ARMCARE_API_URL_PROD` are set if production
  mode is being tested.
- [ ] Azure storage vars point to staging-safe storage:
  - [ ] `AZURE_STORAGE_ACCOUNT_NAME`
  - [ ] `AZURE_STORAGE_CONNECTION_STRING`
  - [ ] `AZURE_STORAGE_CONTAINER_NAME`
- [ ] `PUPPETEER_EXECUTABLE_PATH` is set only if required by the staging
  runtime.

### AMS

- [ ] `DATABASE_URL` points to the staging database.
- [ ] `API_BASE_URL` points to the staging API origin.
- [ ] `API_INTERNAL_AUTH_SECRET` matches API.
- [ ] Auth provider secrets are configured for the staging callback URL.
- [ ] Email/storage/report env vars required by AMS are configured.
- [ ] No ArmCare username/password is configured in AMS.

### Portal

- [ ] `DATABASE_URL` points to the staging database.
- [ ] `API_BASE_URL` points to the staging API origin.
- [ ] `API_INTERNAL_AUTH_SECRET` matches API.
- [ ] `AUTH_SECRET` is set.
- [ ] `AUTH_RESEND_KEY` is set to a staging-safe key.
- [ ] `AUTH_RESEND_FROM` is set to a verified staging sender.
- [ ] No ArmCare username/password is configured in portal.

## Signed API Auth Boundary

- [ ] Direct browser/client request to a protected `apps/api /api/v1/*` route
  without `Authorization: Bearer <internal-token>` is rejected.
- [ ] Direct request with raw `x-ams-user-id` or `x-ams-user-email` headers is
  rejected or treated as unauthenticated.
- [ ] AMS-local `/api/*` route succeeds for an authenticated authorized user.
- [ ] Portal-local `/api/*` route succeeds for an authenticated authorized user.
- [ ] AMS/portal browser responses never include `API_INTERNAL_AUTH_SECRET` or
  a signed internal API token.
- [ ] API logs identify signed internal requests without logging bearer token
  contents.

## Cron Checks

- [ ] API deployment owns cron schedules.
- [ ] Legacy/root deployment does not schedule `/api/cron/*`.
- [ ] `GET /api/cron/armcare-sync` without `CRON_SECRET` is rejected.
- [ ] `GET /api/cron/weekly-usage-reports` without `CRON_SECRET` is rejected.
- [ ] Each cron route succeeds with `Authorization: Bearer ${CRON_SECRET}`.
- [ ] Cron execution logs do not expose secrets or third-party credentials.
- [ ] Cron schedules remain disabled until API smoke tests pass.

## Auth Login Checks

### AMS

- [ ] Admin user can sign in.
- [ ] Coach/staff user can sign in.
- [ ] User without facility access is blocked from protected staff views.
- [ ] Session survives refresh and navigation.
- [ ] Sign out clears access to protected AMS routes.

### Portal

- [ ] Portal client/player user can sign in.
- [ ] Invite or magic-link flow works with staging email.
- [ ] User without player access cannot view another player's data.
- [ ] Session survives refresh and navigation.
- [ ] Sign out clears access to protected portal routes.

## File Upload And Stream Checks

### AMS

- [ ] Attachment upload succeeds for an authorized user.
- [ ] Oversized attachment is rejected.
- [ ] Invalid MIME type or extension is rejected.
- [ ] Attachment stream/view/content routes return expected content.
- [ ] `Range` requests work for stream routes.
- [ ] Important response headers are preserved:
  - [ ] `Content-Type`
  - [ ] `Content-Length` when present
  - [ ] `Content-Disposition`
  - [ ] `Cache-Control`
- [ ] Unauthorized user cannot read another player's attachment.
- [ ] Drill file upload/link/delete paths work for authorized users.
- [ ] Drill file stream rejects unauthorized users.

### Portal

- [ ] Client-facing attachment view/stream/content route works for an
  authorized portal user.
- [ ] Portal user cannot access another player's attachment.
- [ ] Portal upload route is tested only if enabled for clients.
- [ ] Portal does not expose drill file write routes unless intentionally
  enabled.

## PDF And Report Checks

- [ ] AMS PDF routes run in Node runtime.
- [ ] Staging runtime has a working Chromium strategy:
  - [ ] serverless Chromium works, or
  - [ ] `PUPPETEER_EXECUTABLE_PATH` points to a working executable.
- [ ] Development report PDF renders.
- [ ] Routines report PDF renders.
- [ ] Universal routines PDF renders.
- [ ] Weekly usage PDF renders.
- [ ] PDF responses include expected headers:
  - [ ] `Content-Type: application/pdf`
  - [ ] `Content-Disposition`
  - [ ] `Cache-Control: private, no-store`
- [ ] Unauthorized user cannot render another player's report.
- [ ] API report data route works through AMS proxy.
- [ ] Weekly usage report generation route works through API with correct auth.

## ArmCare Checks

- [ ] API has ArmCare credentials; AMS and portal do not.
- [ ] Manual AMS ArmCare sync calls AMS-local route and is proxied to API.
- [ ] Manual sync requires authenticated admin access.
- [ ] Non-admin user cannot trigger manual sync.
- [ ] ArmCare cron requires `CRON_SECRET`.
- [ ] Latest player ArmCare score read works from AMS.
- [ ] Latest player ArmCare score read works from portal for an authorized
  portal user.
- [ ] User without player access cannot read that player's ArmCare score.
- [ ] Unmatched exam list works for AMS admin.
- [ ] Unmatched exam link/resolve enforces selected player access.
- [ ] API responses do not expose ArmCare credentials or raw upstream auth
  errors.

## Rollback And Fallback Checks

- [ ] Current production deployment IDs or release artifacts are recorded.
- [ ] Database migration rollback or forward-fix plan is documented for this
  release.
- [ ] API can be rolled back without breaking deployed AMS/portal versions.
- [ ] AMS can be rolled back while continuing to use the staging API.
- [ ] Portal can be rolled back while continuing to use the staging API.
- [ ] Legacy fallback status is explicit:
  - [ ] fallback-only, or
  - [ ] still user-facing during transition.
- [ ] Legacy/root does not own cron while API cron ownership is enabled.
- [ ] Feature flags or traffic routing can remove public access to a failed app
  deployment.
- [ ] On-call owner and rollback decision threshold are documented.

## Final Go/No-Go

- [ ] API smoke tests passed.
- [ ] AMS smoke tests passed.
- [ ] Portal smoke tests passed.
- [ ] Crons verified and enabled only after API checks passed.
- [ ] File and PDF checks passed in staging infrastructure.
- [ ] ArmCare checks passed against the intended staging/prod mode.
- [ ] No secret appeared in browser responses, logs, or client bundles during
  smoke testing.
- [ ] Rollback path was tested or rehearsed.
