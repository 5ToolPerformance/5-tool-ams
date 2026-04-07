# Phased Monorepo Migration Plan

## Summary
Transition the current single Next.js app into a `pnpm` workspace + Turborepo with three independently deployable apps on separate subdomains:
- `apps/api` at `api.5tool.com`
- `apps/portal` at `portal.5tool.com`
- `apps/ams` at `ams.5tool.com`

Keep `apps/portal` and `apps/ams` as server-rendered Next.js apps that continue using server functions where appropriate for page loading, mutations, and route protection. The API app becomes the versioned HTTP boundary for cross-app communication and externalized backend access. Use a phased strangler migration: extract shared packages first, then stand up the API app, then portal, then AMS, while preserving behavior.

## Implementation Changes
### Phase 0: Stabilize boundaries inside the current repo
- Define target workspace layout: `apps/*` and `packages/*`, with Turborepo pipelines for `dev`, `build`, `lint`, `test`, and typecheck.
- Inventory current code into four ownership buckets: API-only, AMS-only, portal-only, shared.
- Freeze new cross-surface direct imports from route/page code into mixed UI or mixed auth helpers.
- Normalize imports so extraction does not depend on the current single-app `@/*` alias.
- Establish the future networking model now:
  - AMS and portal remain Next apps with server functions for app-local behavior.
  - Cross-app calls go through the versioned API over HTTP.
  - Apps must not hardcode `api.5tool.com`; they derive the API origin from a root-domain env variable.

### Phase 1: Introduce the monorepo skeleton without moving behavior
- Add `pnpm-workspace.yaml`, `turbo.json`, per-app `package.json` files, and shared TS/ESLint config packages.
- Create shared packages with stable import namespaces:
  - `@ams/config-typescript`
  - `@ams/config-eslint`
  - `@ams/db`
  - `@ams/auth`
  - `@ams/domain`
  - `@ams/application`
  - `@ams/ui`
  - `@ams/api-client`
- Keep the current app as source of truth while package entrypoints are introduced.
- Add app-specific env contracts:
  - `apps/api`: API/auth/DB/integrations
  - `apps/portal`: root-domain + public app env + auth client config
  - `apps/ams`: root-domain + public app env + auth client config

### Phase 2: Extract shared runtime, auth, and data layers
- Move Drizzle schema, DB client creation, migrations, and reusable query modules into `@ams/db`.
- Move reusable code from `src/domain` and `src/application` into `@ams/domain` and `@ams/application`, preserving tests.
- Split auth into:
  - shared provider/session configuration in `@ams/auth`
  - AMS/internal auth helpers
  - portal/client auth helpers
- Keep server functions in AMS and portal for:
  - server-rendered page data loading
  - form/mutation actions that belong to the app UI layer
  - auth-aware redirects and route guards
- Limit direct DB access over time:
  - app-local server functions may initially use shared packages during migration
  - after API cutover, cross-app and shared mutable operations should go through the versioned API
- Remove current root-layout pathname special-casing so AMS and portal own their own shells independently.

### Phase 3: Stand up the versioned API app first
- Create `apps/api` as a dedicated Next.js API app.
- Move:
  - current `src/app/api/**`
  - NextAuth handler route
  - cron endpoints from `vercel.json`
  - integration and email endpoints used by portal/admin flows
- Introduce versioning immediately:
  - all business endpoints live under `/api/v1/...`
  - auth handler paths may remain unversioned if required by NextAuth, but app-consumed business APIs should be versioned from day one
- Add a thin compatibility strategy during migration:
  - old paths can temporarily proxy/redirect to `/api/v1/...`
  - new AMS/portal code should target only versioned endpoints
- Route handlers stay thin and delegate to `@ams/application`, `@ams/domain`, and `@ams/db`.
- Add shared API client helpers in `@ams/api-client` for typed calls from AMS and portal server functions.

### Phase 4: Stand up `apps/portal`
- Move `/portal` routes and portal-specific UI/features into `apps/portal`.
- Preserve server-function usage for portal:
  - server-rendered home/profile/journal/settings pages
  - invite acceptance and portal mutations via server actions/functions where appropriate
  - auth-aware player switching and guarded redirects
- Use the API app as the network boundary for shared/cross-app operations.
- Keep portal-specific shells, navigation, and visual language local to `apps/portal`.
- Extract only reusable primitives into `@ams/ui`.

### Phase 5: Stand up `apps/ams`
- Move the remaining internal App Router pages into `apps/ams`.
- Preserve server-function usage for AMS:
  - server-rendered dashboards and player tabs
  - form submissions and privileged mutations via server actions/functions where appropriate
  - role-aware redirects and route protection
- Convert AMS features that currently depend on mixed in-process imports so they use:
  - shared packages for stable pure logic and UI primitives
  - `apps/api` for versioned backend operations and cross-surface contracts
- Keep AMS-only layouts, sidebar, dashboards, resources, lessons, admin pages, and reports local to `apps/ams`.

### Phase 6: Domain, subdomain, and environment hardening
- Configure production subdomains explicitly:
  - `api.5tool.com`
  - `portal.5tool.com`
  - `ams.5tool.com`
- Give AMS and portal a root-domain env variable so API origins are derived, not hardcoded.
- Recommended env shape:
  - `ROOT_DOMAIN=5tool.com`
  - AMS derives `https://api.${ROOT_DOMAIN}`
  - Portal derives `https://api.${ROOT_DOMAIN}`
- If future environments need more flexibility, allow explicit override:
  - `API_ORIGIN` overrides derived origin when present
  - otherwise derive from `ROOT_DOMAIN`
- Add CORS/cookie/session policy review for subdomain-based operation, including any auth callback and cookie-domain implications.
- Ensure preview/staging environments can use the same derivation pattern or explicit override.

### Phase 7: Cutover and decommission the single app
- Run all three apps in parallel in lower environments first.
- Migrate deployment to three separate Vercel projects/apps in the same workspace.
- Move cron ownership fully to `apps/api`.
- Remove the legacy single-app route tree only after route parity, auth parity, and API parity are confirmed.

## Public Interfaces / Contracts
- Shared package entrypoints:
  - `@ams/db`
  - `@ams/auth`
  - `@ams/domain`
  - `@ams/application`
  - `@ams/ui`
  - `@ams/api-client`
  - `@ams/config-typescript`
  - `@ams/config-eslint`
- Versioned API contract:
  - business endpoints exposed under `/api/v1/...`
  - AMS and portal call versioned endpoints only
  - `@ams/api-client` is the single typed client surface for those calls
- Env contract:
  - `apps/ams` and `apps/portal` require `ROOT_DOMAIN`
  - optional `API_ORIGIN` can override derived API host
  - `apps/api` owns DB/auth/provider/integration/cron/email secrets
- Server-function rule:
  - AMS and portal keep using Next.js server functions/server actions where they are the correct UI boundary
  - API app owns the HTTP boundary and versioned backend interface

## Test Plan
- Baseline before migration:
  - capture current build, lint, and key Jest suites for auth, dashboard/player data, portal service, and critical API routes
- Package extraction:
  - keep existing unit tests passing after each move
  - add boundary checks to prevent app-to-app private imports
- API app:
  - contract tests for `/api/v1` endpoints
  - auth route coverage
  - cron auth coverage
  - portal invite and player/development endpoint coverage
- Portal app:
  - smoke tests for magic-link sign-in, invite acceptance, portal home, journal, settings, and player switching
  - verify portal server actions/functions call the versioned API correctly
- AMS app:
  - smoke tests for dashboard redirects, player detail tabs, lessons create/edit, resources, admin pages, and reports
  - verify AMS server actions/functions call the versioned API correctly
- Domain/deployment:
  - verify derived API origin logic from `ROOT_DOMAIN`
  - verify `API_ORIGIN` override behavior
  - verify subdomain auth/session behavior across `ams`, `portal`, and `api`

## Assumptions
- End state is three independently deployable apps in one monorepo.
- Shared package imports use the `@ams/*` namespace.
- AMS and portal remain full Next.js apps using server functions where appropriate, not pure client-side SPAs.
- The API app remains a Next.js app initially and introduces API versioning immediately.
- Production subdomains are `api.5tool.com`, `portal.5tool.com`, and `ams.5tool.com`.
- AMS and portal derive the API host from a root-domain env variable, with optional explicit override for environment flexibility.
- Drizzle schema and migrations remain a single shared data layer managed centrally.
- The safest extraction order is shared packages first, then API, then portal, then AMS.
