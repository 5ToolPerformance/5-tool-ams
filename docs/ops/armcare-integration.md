# ArmCare Integration

ArmCare is the only active external sync integration for the multi-app
deployment.

## Active Routes

### API-owned sync

- `GET /api/cron/armcare-sync`
  - app: `apps/api`
  - auth: `Authorization: Bearer ${CRON_SECRET}`
  - behavior: runs `syncArmCare("cron")`
- `POST /api/v1/admin/external-sync`
  - app: `apps/api`
  - auth: authenticated actor plus `admin` role
  - body: `{ "system": "armcare" }`
  - behavior: runs `syncArmCare("manual")`

### API-owned ArmCare admin data

- `GET /api/v1/admin/unmatched-exams`
  - auth: authenticated `admin`
  - behavior: lists pending unmatched ArmCare exams
- `POST /api/v1/admin/unmatched-exams`
  - auth: authenticated `admin`, plus selected player access
  - behavior: resolves a pending unmatched exam to a PATH player
- `GET /api/v1/admin/unmatched-exams/unique-players`
  - auth: authenticated `admin`
  - behavior: lists unique pending ArmCare players and stats
- `POST /api/v1/admin/unmatched-exams/link-player`
  - auth: authenticated `admin`, plus selected player access
  - behavior: links a pending ArmCare player to a PATH player

### API-owned read routes

- `GET /api/v1/players/:id/armcare/recent-score`
  - auth: authenticated actor plus player access
  - behavior: returns the latest stored ArmCare score for that player

## App Proxies

AMS browser code calls AMS-local routes. Those routes forward to `apps/api`
server-side with the signed internal bearer token:

- `POST /api/admin/external-sync` -> `/api/v1/admin/external-sync`
- `GET /api/admin/unmatched-exams` -> `/api/v1/admin/unmatched-exams`
- `GET /api/admin/unmatched-exams/unique-players` -> `/api/v1/admin/unmatched-exams/unique-players`
- `POST /api/admin/unmatched-exams/link-player` -> `/api/v1/admin/unmatched-exams/link-player`
- `GET /api/players/:id/armcare/recent-score` -> `/api/v1/players/:id/armcare/recent-score`

Portal currently exposes only client-facing read access:

- `GET /api/players/:id/armcare/recent-score` -> `/api/v1/players/:id/armcare/recent-score`

Portal does not expose ArmCare admin sync or linking routes.

## Env

Only deployments that run ArmCare sync need ArmCare credentials. In the current
deployment, that is `apps/api` and the retained legacy baseline:

- `ARMCARE_STATUS`
- `ARMCARE_USERNAME`
- `ARMCARE_PASSWORD`
- `ARMCARE_AUTH_URL_STAGING`
- `ARMCARE_API_URL_STAGING`
- `ARMCARE_AUTH_URL_PROD`
- `ARMCARE_API_URL_PROD`

`apps/ams` and `apps/portal` do not require ArmCare credentials. They call
`apps/api` through signed server-side proxy routes using:

- `API_BASE_URL`
- `API_INTERNAL_AUTH_SECRET`

Scheduled sync additionally requires:

- `CRON_SECRET`

## Security Notes

- ArmCare credentials are server-side only and must never be placed in
  `NEXT_PUBLIC_*` variables.
- `API_INTERNAL_AUTH_SECRET` is used only by server-side app proxies and is not
  exposed to browser code.
- Cron sync rejects requests without `Authorization: Bearer ${CRON_SECRET}`.
- Manual sync requires an authenticated admin actor.
- Player linking and player score reads enforce player access before returning
  or mutating player-scoped data.
- Route responses use generic error messages for third-party failures; detailed
  upstream errors are logged server-side only.

## Follow-up Hardening

- Add explicit facility ownership to unmatched ArmCare rows during sync if the
  third-party data can be reliably mapped before manual linking.
- Add rate limiting for manual sync and linking routes.
- Add audit-event records for manual ArmCare sync triggers and manual player
  linking actions.
