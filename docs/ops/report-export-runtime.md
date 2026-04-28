# Report and Export Runtime

Report/export ownership is split during the multi-app transition:

- `apps/api` owns JSON report API routes and weekly usage generation endpoints.
- `apps/ams` still owns PDF rendering routes because there are no matching
  `apps/api` PDF route equivalents yet.
- `apps/legacy` keeps copied report routes only for transition parity.
- `apps/portal` currently links to report PDF paths from copied UI, but does
  not own matching route handlers.

## API-Owned Routes

- `GET /api/v1/reports/retrieve-data`
- `POST /api/v1/admin/weekly-usage-reports`
- `GET /api/cron/weekly-usage-reports`

The AMS browser-facing fallback generation route
`POST /api/admin/weekly-usage-reports` proxies to
`/api/v1/admin/weekly-usage-reports` with the signed internal API token.

## AMS App-Local PDF Routes

- `GET /reports/development/:playerId/pdf`
- `GET /reports/routines/:playerId/pdf`
- `GET /reports/universal-routines/:routineId/pdf`
- `GET /reports/weekly-usage/:reportId/pdf`

These routes are intentionally app-local until API equivalents exist. They:

- require `runtime = "nodejs"`
- use `@ams/application/reports/puppeteer`
- require local `PUPPETEER_EXECUTABLE_PATH` outside production/serverless
- use `@sparticuz/chromium` automatically when running in production,
  Vercel, or AWS-style serverless environments
- return `Content-Type: application/pdf`
- return `Content-Disposition` as `inline` or `attachment` depending on route
  behavior/query params
- return `Cache-Control: private, no-store`
- enforce app-local auth/resource checks before rendering

## CSV Export

The player CSV export is currently client-generated in AMS from
`GET /api/players`; there is no server-side CSV export route yet.

## Required Environment

- `PUPPETEER_EXECUTABLE_PATH`: required for local PDF generation only.
- `DATABASE_URL`: required by report data reads.
- `API_BASE_URL` and `API_INTERNAL_AUTH_SECRET`: required by AMS report API
  proxies.
- `CRON_SECRET`: required by API-owned cron generation.

## Remaining Gaps

- Add `apps/api` equivalents for PDF rendering before moving PDF ownership out
  of AMS.
- Add portal-local report PDF proxy or portal-specific report routes before
  portal exposes copied report export links in production.
- Consider server-side CSV export if CSV downloads need audit logging,
  authorization at export time, or consistent download headers.
