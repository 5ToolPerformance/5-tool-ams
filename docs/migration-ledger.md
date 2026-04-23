# Migration Ledger

This ledger tracks copy-first migration status. Source files remain in `apps/legacy` until the legacy app is decommissioned.

| Surface | Status | Notes |
| --- | --- | --- |
| `apps/legacy` | `copied-to-app` | Full current Next.js app copied from the former root structure and retained as the production baseline. |
| `apps/api` | `copied-to-api` | Legacy API routes copied into `app/api/v1`, with auth and cron kept at compatible top-level paths. |
| `apps/portal` | `copied-to-portal` | Portal route tree and portal UI/hooks copied into the standalone app; shared layers resolve through packages. |
| `apps/ams` | `copied-to-ams` | Non-portal route tree copied into the standalone app; shared layers resolve through packages. |
| `packages/domain` | `copied-to-package` | Legacy domain source copied into the package with package entrypoints and subpath imports enabled; the package now uses domain-owned contracts and local utilities instead of DB query types, DB schema aliases, or contracts/app compatibility aliases, and the `positions` slice exposes only domain-owned types while persistence lives in `packages/db`. |
| `packages/contracts` | `copied-to-package` | Legacy shared types copied into contracts for app-facing imports; DB-derived assessment write shapes moved out so contracts no longer depend on db schema/types, and the package currently passes full-package lint/typecheck in its migrated form. |
| `packages/db` | `copied-to-package` | Legacy db client, schema, queries, and migrations copied into the package; the package now uses explicit `@ams/domain/*` imports and package-local helpers/types instead of legacy cross-package aliases. |
| `packages/application` | `copied-to-package` | Legacy application workflows copied into the package; shared db/domain/config/contracts dependencies now resolve through `@ams/*` entrypoints instead of legacy compatibility aliases, and the package currently passes full-package lint/typecheck in its migrated form. |
| `packages/auth` | `copied-to-package` | Shared auth logic now uses session-getter plus app-supplied query adapters; DB-backed actor/resource lookups live in each app-local `src/application/auth/*` wrapper, so the shared package no longer depends on `db` and currently passes full-package lint/typecheck in its migrated form. |
| `packages/permissions` | `copied-to-package` | Initial pure authorization helpers are now extracted from `packages/auth`; the package owns shared role/facility/resource authorization decisions without DB access and currently passes full-package lint/typecheck in its migrated form. |
| `packages/config` | `copied-to-package` | Legacy env parsing copied into the shared config package. |
| `packages/observability` | `legacy-only` | Observability layer scaffolded only. |

## Rules

- Copy into a target app/package before refactoring it.
- Do not remove the corresponding source from `apps/legacy` during rollout.
- After a copy, the target location becomes the modernization branch; `apps/legacy` accepts only parity-preserving fixes.
- App runtime concerns such as `auth()` wiring stay inside each app; shared packages may depend on a session getter interface, but not on an app entrypoint.
- `apps/api`, `apps/portal`, and `apps/ams` should import shared layers through `@ams/*` entrypoints; `@/application/auth/*`, `@/auth`, and other app-local aliases remain app-owned exceptions.
- `packages/auth` and `packages/contracts` are protected by lint rules against regressing to app/db compatibility aliases, and both currently pass full-package lint/typecheck in their migrated form.
- `packages/permissions` is protected against regressing to db, application, auth runtime, config, and compatibility-alias imports, and it currently passes full-package lint/typecheck in its migrated form.
- `packages/application` is protected against regressing to legacy `@/db`, `@/domain`, `@/env`, and shared type compatibility aliases, and it currently passes full-package lint/typecheck in its migrated form.
- `packages/domain` is now protected against regressing to DB query/schema imports, contracts imports, and shared app compatibility aliases.
- `packages/db` is now protected against regressing to legacy `@/domain/*`, `@/utils/*`, and `@/types/*` compatibility aliases; explicit `@ams/domain/*` imports and package-local helpers/types are required there.
- The root ESLint config now prebuilds the Nx ProjectGraph with plugin isolation disabled, which avoids the local plugin-worker startup failure and keeps `@nx/enforce-module-boundaries` active for migrated apps/packages.
- With the Nx rule now active, `packages/auth` is now aligned with the target dependency graph; DB-backed actor/resource lookups are app-owned, while the shared package owns session/auth utility logic plus permission enforcement.
