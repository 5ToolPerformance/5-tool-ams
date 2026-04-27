# Monorepo Transition Plan With Parallel-Run Safety

## Summary
Readiness score: **64/100**.

This repo is **moderately ready** for a monorepo transition. It already has a usable layered structure in `src/application`, `src/domain`, and `src/db`, TypeScript is currently clean, and a representative portal service test passes. The main risk is that those boundaries are still mostly **conventional rather than enforced**, so extraction will require a stabilization phase before code can be moved safely.

Readiness basis:
- Positive: clear layer naming, substantial test surface (`57` test files), clean typecheck, portal already exists as a separate route surface, and business logic is often already routed through `application`.
- Negative: single-app `@/*` alias, root-owned env/auth/build config, `80` API route files still embedded in the app, `91` files under `src/app`/`src/ui`/`src/hooks` importing `@/db`, and `13` files with `/portal` path branching that assumes one shared shell.

## Implementation Changes
### Phase 0: Freeze the current app as the production baseline
- Keep the current root Next app as the only production deployment until parity is proven in the monorepo.
- Record baseline checks that must remain green during migration: root `build`, root typecheck, key portal/auth/API tests, and critical manual flows.
- Declare `ARCHITECTURE.md` the source of truth and use **Nx + pnpm workspaces** as the target monorepo shape.
- Add a migration rule: no new direct imports from route/UI code into `db` unless there is no existing application use case.

### Phase 1: Stabilize extraction boundaries inside the existing repo
- Introduce explicit internal target layers before moving files:
  - app-only
  - shared UI
  - domain
  - application
  - db
  - auth/config
- Remove single-app assumptions that will block split apps:
  - move portal-vs-AMS layout decisions out of shared root shell logic
  - isolate portal-only auth and routing behavior from shared root concerns
  - stop using DB query types directly in UI; replace them with domain/contracts-facing types
- Replace the root-only `@/*` mental model with future package-oriented import boundaries, while keeping compatibility shims during the stabilization phase.
- Inventory every current feature into one of four buckets: `ams-only`, `portal-only`, `api-only`, `shared-package`.

### Phase 2: Create the workspace skeleton without cutting over traffic
- Add `pnpm-workspace.yaml` and Nx workspace config at the repo root.
- Create target folders:
  - `apps/ams`
  - `apps/portal`
  - `apps/api`
  - `packages/domain`
  - `packages/application`
  - `packages/db`
  - `packages/auth`
  - `packages/contracts`
  - `packages/permissions`
  - `packages/config`
  - `packages/observability`
- Keep the current root app operational while these folders are introduced.
- Add shared TS, ESLint, Jest/Nx target configuration so new packages can be validated before any route cutover.
- Add Nx boundary rules matching `ARCHITECTURE.md` so new violations fail immediately.

### Phase 3: Extract shared packages in the safest order
- Extract `packages/domain` first:
  - pure types
  - validation
  - serialization
  - rules
  - business constants
- Extract `packages/contracts` next:
  - DTOs
  - request/response schemas
  - shared API payload types
  - event payload schemas where needed
- Extract `packages/db` next:
  - Drizzle schema
  - migrations
  - DB client creation
  - query modules
- Extract `packages/application` after `domain` and `db` are stable:
  - workflows
  - orchestration
  - transaction boundaries
  - report/data assembly
- Extract `packages/auth`, `packages/permissions`, and `packages/config` last in this group because they currently depend on root env and root app auth wiring.
- Keep compatibility exports during extraction so the root app can keep running unchanged while imports are migrated incrementally.

### Phase 4: Stand up the API app first
- Build `apps/api` as the first new deployable surface.
- Move business HTTP endpoints from the current app into `apps/api`, but leave the legacy routes in the current app temporarily proxying or delegating until parity is confirmed.
- Put all new business endpoints under `/api/v1/...`.
- Move cron ownership into `apps/api` only after the new API deployment is verified.
- Keep auth-related handler paths compatible with the auth library requirements, but make all app-consumed business APIs versioned from day one.
- Publish a typed API client package used by AMS and portal server functions.

### Phase 5: Stand up the portal app second
- Move `/portal` routes, portal layouts, portal UI, and portal-specific workflows into `apps/portal`.
- Keep portal-specific server rendering, redirects, and mutations inside the portal app.
- Replace any remaining shared-shell `/portal` branching with portal-owned layout and navigation.
- Route shared data access through `packages/application` or the new API client, not direct portal-to-DB imports.
- Run `apps/portal` in lower environments while the current root app still serves the existing portal paths in production.

### Phase 6: Stand up the AMS app third
- Move the remaining internal routes and AMS-specific UI into `apps/ams`.
- Keep AMS-only dashboards, resources, lessons, admin pages, and reports local to `apps/ams`.
- Use shared packages for logic and the API app for versioned cross-surface operations.
- Remove direct AMS page imports of DB/query modules as part of the move; AMS pages should depend on `application`, contracts, and app-local UI only.

### Phase 7: Parallel run, parity, and cutover
- Deploy `apps/api`, `apps/portal`, and `apps/ams` in non-production first while the current app remains live.
- Validate parity against the current app for:
  - auth/session behavior
  - portal invite flow
  - player pages
  - lessons create/edit
  - admin routes
  - report generation
  - cron behavior
- Cut traffic in this order:
  1. `api`
  2. `portal`
  3. `ams`
- Keep legacy routes/proxies until production parity is proven for a full release window.
- Remove the root single-app route tree only after all three apps are serving production traffic and rollback paths are no longer needed.

## Public Interfaces / Contract Changes
- New workspace structure under `apps/*` and `packages/*`.
- Stable package entrypoints:
  - `@ams/domain`
  - `@ams/contracts`
  - `@ams/db`
  - `@ams/application`
  - `@ams/auth`
  - `@ams/permissions`
  - `@ams/config`
- New business API contract under `/api/v1/...`.
- New rule for UI-facing code:
  - app/UI/hook layers must not import DB schema/query modules directly
  - DB-derived UI types must be replaced by domain/contracts/application-facing types
- Environment ownership split:
  - `apps/api` owns DB, cron, provider, integration, and email secrets
  - `apps/portal` and `apps/ams` own only app-specific runtime/public config plus API/auth client settings
- Internal API calls from `apps/ams` and `apps/portal` must use the signed
  bearer token contract in `docs/api-auth.md`; raw identity headers are not
  accepted by `apps/api`.

## Test Plan
- Baseline before extraction:
  - root typecheck
  - root build
  - critical auth and portal tests
  - representative API route tests
- During package extraction:
  - package-level unit tests move with code
  - Nx boundary enforcement must pass
  - no increase in direct UI-to-DB imports
- API app:
  - contract tests for `/api/v1`
  - auth handler validation
  - cron authorization and scheduling checks
- Portal app:
  - invite acceptance
  - portal sign-in
  - player switching
  - journal/settings smoke tests
- AMS app:
  - dashboard access
  - player tab rendering
  - lessons/resource/admin/report smoke tests
- Cutover:
  - compare old vs new responses/flows in staging
  - verify rollback path still works until final decommission

## Assumptions
- The target monorepo tool is **Nx**, not Turborepo.
- The current app must stay functional until the new monorepo apps are production-ready, so migration uses a **strangler/parallel-run** approach, not a big-bang move.
- End state is three deployable apps: `apps/api`, `apps/portal`, `apps/ams`.
- `ARCHITECTURE.md` package boundaries are the intended long-term dependency rules.
- Readiness score `64/100` means: viable to start now, but Phase 1 stabilization is mandatory before large-scale file moves.
