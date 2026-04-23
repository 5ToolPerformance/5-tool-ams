# AGENTS.md

## Purpose

This repository is an Nx monorepo for the AMS platform.
AI coding agents working in this repo must follow the architectural boundaries and conventions described here.

The goal is to keep the codebase:

- layered
- modular
- reusable
- safe to evolve

Agents should prefer small, correct changes that preserve architecture over large rewrites that blur boundaries.

---

## Repository Overview

```txt
apps/
  ams/           # Internal staff-facing Next.js app
  portal/        # Client/player/parent-facing Next.js app
  api/           # Fastify API

packages/
  domain/        # Business entities, enums, invariants
  application/   # Use cases, orchestration, transactions
  db/            # Drizzle schema, repositories, db helpers
  auth/          # Shared auth and actor helpers
  permissions/   # Authorization and policy rules
  contracts/     # Zod schemas, DTOs, API/event payloads
  events/        # Event names and payload contracts
  observability/ # Logging, tracing, metrics helpers
  config/        # Environment and runtime config

workers/
  ts-worker/     # Node/TypeScript background jobs
  py-worker/     # Python worker(s), if present

docs/
  architecture/
  product/
  admin/
  ops/
```

---

## Architecture Summary

The repo uses a layered dependency model:

```txt
apps / workers
      ↓
  application
      ↓
    domain
```

Supporting packages:

```txt
contracts
auth
permissions
db
events
observability
config
```

### Core rules

- Lower-level packages must never depend on higher-level packages
- Packages must never import apps or workers
- Circular dependencies are forbidden
- Business logic belongs in `application`
- Transactions belong in `application`
- Authorization belongs in `permissions`
- Identity/session helpers belong in `auth`
- Persistence belongs in `db`
- DTOs and schemas belong in `contracts`

---

## Package Responsibilities

### `packages/domain`

Owns:

- business entities
- enums
- value objects
- invariants
- pure domain logic

Do not put:

- framework code
- DB code
- API code
- auth/session code

---

### `packages/application`

Owns:

- use cases
- workflow orchestration
- transaction boundaries
- permission enforcement
- emitting events after successful operations

Examples:

- create lesson
- resolve injury
- link attachment
- refresh player snapshot

Do not put:

- request/response transport logic
- raw session/cookie handling
- React/UI code

---

### `packages/db`

Owns:

- Drizzle schema
- database client setup
- repositories
- query helpers
- transaction primitives

Do not put:

- business workflows
- authorization decisions
- UI-specific read shaping

---

### `packages/auth`

Owns:

- actor resolution helpers
- shared auth/session helpers
- identity mapping helpers
- global/system role interpretation

Do not put:

- Next.js sign-in pages
- app-specific provider UI
- business workflows

---

### `packages/permissions`

Owns:

- authorization checks
- facility-scoped access rules
- resource-level policy checks

Examples:

- can create lesson
- can manage facility
- can view player
- can access attachment

---

### `packages/contracts`

Owns:

- zod schemas
- DTOs
- request/response shapes
- event/job payload schemas

Keep this package lightweight and portable.

---

### `packages/events`

Owns:

- event names
- queue names
- payload contracts

Use this package for all cross-process event definitions.

---

### `packages/observability`

Owns:

- logging
- tracing
- metrics helpers

---

### `packages/config`

Owns:

- environment parsing
- runtime configuration

---

## Allowed Dependency Graph

### Packages

```txt
domain
  -> none

contracts
  -> domain

permissions
  -> domain
  -> contracts

auth
  -> domain
  -> contracts
  -> permissions

db
  -> domain
  -> contracts

events
  -> domain
  -> contracts

observability
  -> contracts (optional)

config
  -> contracts (optional)

application
  -> domain
  -> db
  -> contracts
  -> permissions
  -> events
  -> observability
```

### Apps

```txt
apps/ams
  -> application
  -> auth
  -> contracts
  -> permissions
  -> observability
  -> config

apps/portal
  -> application
  -> auth
  -> contracts
  -> permissions
  -> observability
  -> config

apps/api
  -> application
  -> auth
  -> contracts
  -> permissions
  -> events
  -> observability
  -> config
```

### Workers

```txt
workers/ts-worker
  -> application
  -> db
  -> contracts
  -> events
  -> observability
  -> config
```

Python workers should consume shared contracts through generated schemas, APIs, or queue payload definitions, not through TypeScript imports.

---

## Forbidden Dependencies

Agents must not introduce these:

```txt
domain        -X-> any internal package
contracts     -X-> application, db, apps, workers
db            -X-> application, apps, workers
permissions   -X-> db, application, apps, workers
auth          -X-> application, apps, workers
events        -X-> application, db, apps, workers
packages/*    -X-> apps/*
packages/*    -X-> workers/*
apps/*        -X-> other apps/*
application   -X-> apps/*
application   -X-> workers/*
```

Also avoid:

- circular dependencies
- “shared” junk-drawer packages
- duplicating business rules across apps and workers

---

## Auth and Authorization Rules

### Identity model

- `users` = core identity
- `account` = OAuth provider linkage
- magic links use verification-token flow
- `userRoles` = facility-scoped authorization
- `staffProfiles` and `clientProfiles` = role-specific metadata

### Global roles

A user may have a system-level role such as:

- `standard`
- `super_admin`

`super_admin` bypasses facility-scoped authorization checks.

### Facility roles

Facility roles belong in `userRoles`, not on `users`.

Expected fields include:

- `facilityId`
- `role`
- `access`
- `isActive`

### Actor model

Application logic should receive an `Actor`, not raw sessions or request objects.

Example:

```ts
type Actor = {
  userId: string;
  email: string | null;
  systemRole: "standard" | "super_admin";
  memberships: Array<{
    facilityId: string;
    role: "player" | "coach" | "admin";
    access: "read/write" | "read-only" | "write-only";
    isActive: boolean;
  }>;
};
```

### Authorization order

1. If `systemRole === "super_admin"`, allow
2. Else check facility membership
3. Else check resource-level access
4. Else deny

---

## App-Level Rules

### Apps own

- Auth.js app entrypoints
- provider configuration
- sign-in/sign-up flows
- request context
- route handlers
- server actions
- UI-specific data shaping
- cache invalidation
- redirects and notFound handling

### Apps must not own

- transaction orchestration
- shared business logic
- duplicated permission logic
- complex DB workflows

### Preferred app pattern

1. Resolve request/session context
2. Build or fetch `Actor`
3. Validate input using `contracts`
4. Call `application` use case or DB read helper
5. Return shaped result for the app

---

## Application-Layer Rules

All writes and multi-step workflows should go through `application`.

Use `application` for:

- transactional operations
- cross-entity writes
- permission-checked workflows
- event-emitting workflows

Do not:

- read cookies
- read headers
- depend on Next.js or Fastify request objects
- depend on app-specific code

Pass `actor` and typed input into use cases.

---

## DB Rules

DB code should focus on:

- schema
- repositories
- queries
- transaction primitives

Do not:

- put business rules in repositories
- make authorization decisions in DB helpers
- shape UI-specific responses in DB code unless it is a clearly reusable read model

---

## Worker Rules

Workers are first-class execution targets.

Workers may:

- consume jobs/events
- call `application`
- call controlled DB helpers where appropriate
- emit follow-up events
- log/traces via `observability`

Workers must not:

- implement separate business rules that diverge from `application`
- invent ad hoc event payloads outside `contracts` / `events`

---

## Data Fetching Guidance

Do not default everything to shared client hooks.

For Next.js apps:

- prefer server-side fetching for initial page data
- use client hooks only where interactivity/revalidation is needed

Shared client hooks can be introduced later, but only when truly reused across apps.

---

## Documentation Rules

Long-form architecture and process docs belong in `docs/`, not inside packages.

Preferred locations:

```txt
docs/architecture/
docs/product/
docs/admin/
docs/ops/
```

Small package READMEs are fine, but canonical architectural guidance belongs in `docs/architecture`.

Agents should consult:

- `docs/architecture/ARCHITECTURE.md`
- `docs/architecture/DEPENDENCY_RULES.md` if present

---

## When Adding New Code

Before creating files or logic, determine:

1. Is this UI, transport, business logic, persistence, auth, or permissions?
2. Does it belong in an app or a shared package?
3. Does it respect the dependency graph?
4. Is there already an existing use case or repository that should be extended instead?

### Place code using this heuristic

- UI/page/server action/route-specific composition -> app
- business workflow -> `application`
- persistence/query/repository -> `db`
- identity/session helper -> `auth`
- authorization check -> `permissions`
- schema/DTO/payload -> `contracts`
- event name/payload contract -> `events`

---

## What Agents Should Avoid

Do not:

- create new packages casually
- create vague `shared`, `common`, or `utils` dumping grounds
- put transactions in route handlers
- put business logic in React components
- put app-specific code in shared packages
- duplicate auth logic across apps
- duplicate permission checks inline in many places
- bypass architecture for speed

---

## Preferred Change Strategy

When making changes:

- preserve working behavior
- prefer additive migration over destructive rewrites
- keep AMS internal app stability as a priority
- migrate legacy structures behind compatibility layers when needed
- keep portal flexibility higher than AMS during transition

---

## Migration Guidance

When transitioning legacy code:

- preserve existing AMS behavior first
- add new source-of-truth tables/flows incrementally
- use dual-read or fallback strategies during migration
- remove legacy columns only after new flows are stable

Examples:

- prefer `userRoles`, but temporarily fall back to legacy `users.role` and `users.facilityId`
- update portal onboarding to sync `users.name`
- keep staff and client metadata in separate profile tables

---

## If Unsure

If the correct placement is unclear, prefer:

- app-level placement for request-specific composition
- `application` for shared workflow logic
- smaller additive changes over broad refactors

When in doubt, do not invent a new layer. Reuse the existing ones.

---
