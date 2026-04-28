# API Authentication Contract

`apps/api` does not trust client-supplied identity headers. Requests that include
`x-ams-user-id` or `x-ams-user-email` are treated as unauthenticated.

AMS and portal must call API routes from server-side code only and attach a
short-lived signed bearer token:

```ts
import { createInternalApiToken } from "@ams/auth/internal-api-token";

const token = createInternalApiToken({
  secret: process.env.API_INTERNAL_AUTH_SECRET!,
  issuer: "ams", // or "portal"
  audience: "api",
  userId: session.user.id,
  email: session.user.email,
});

await fetch(`${process.env.API_BASE_URL}/api/v1/players`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

Required deployment rules:

- `API_INTERNAL_AUTH_SECRET` must be the same high-entropy value in `apps/api`
  and in the server runtime of `apps/ams` / `apps/portal`.
- The secret must be at least 32 characters and must never be exposed through a
  `NEXT_PUBLIC_*` variable or sent to the browser.
- Tokens are HMAC-SHA256 signed, scoped to `audience: "api"`, and expire after
  five minutes by default.
- Browser code should call an AMS/portal route handler or server action. That
  server code resolves the Auth.js session, signs the internal token, and calls
  `apps/api`.
- Public clients must never send `x-ams-user-id` or `x-ams-user-email`.

`apps/api` still resolves authorization through the shared auth context after
the token is verified, so existing role, facility, player, and attachment checks
continue to apply.

## API Cron Ownership

Cron routes are owned by `apps/api`. Deployment schedules for `/api/cron/*`
belong in the API deployment target, currently `apps/api/vercel.json`, not the
repo root or `apps/legacy`.

Current scheduled API cron routes:

- `GET /api/cron/armcare-sync`, scheduled daily at `0 7 * * *`
- `GET /api/cron/weekly-usage-reports`, scheduled Mondays at `0 12 * * 1`

`GET /api/cron/active` is a manually callable health/test endpoint and is not
scheduled.

All cron endpoints require:

```txt
Authorization: Bearer <CRON_SECRET>
```

Required deployment rule:

- `CRON_SECRET` must be configured in the `apps/api` runtime environment.
- Vercel cron requests must send `Authorization: Bearer ${CRON_SECRET}`.
- Legacy cron route copies remain only for transition parity and must not be
  scheduled from root or `apps/legacy` deployment config.
