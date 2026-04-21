# AMS Monorepo Architecture

## Overview

This repository is structured as a **layered monorepo** using Nx. The goal is to maintain:

- Clear separation of concerns
- One-way dependency flow
- Reusable business logic
- Scalable multi-app and multi-worker architecture

The system is composed of:

- **Apps** (delivery surfaces)
- **Packages** (shared logic and infrastructure)
- **Workers** (background processing)
- **Docs** (operational + technical documentation)

---

## High-Level Architecture

```
apps / workers
      ↓
  application
      ↓
    domain
```

Supporting packages sit alongside:

```
contracts
auth
permissions
db
events
observability
config
```

---

## Core Principles

### 1. One-Way Dependencies

- Lower layers must **never depend on higher layers**
- Packages must **never import apps or workers**
- Circular dependencies are not allowed

### 2. Separation of Concerns

- **Apps** handle transport/UI concerns
- **Application** handles workflows and transactions
- **Domain** defines business concepts
- **DB** handles persistence only
- **Auth & Permissions** handle identity and access control

### 3. Centralized Business Logic

- All core workflows live in `application`
- No business logic should live in:

  - React components
  - API route handlers
  - Workers

### 4. Actor-Based Authorization

- Authentication resolves an **Actor**
- Application logic operates on the Actor
- Authorization is enforced via `permissions`

---

## Repository Structure

```
apps/
  ams/
  portal/
  api/

packages/
  domain/
  application/
  db/
  auth/
  permissions/
  contracts/
  events/
  observability/
  config/

workers/
  ts-worker/
  py-worker/

docs/
  architecture/
  product/
  admin/
  ops/
```

---

## Package Responsibilities

### `domain`

- Entities, value objects, enums
- Core business invariants
- No framework or infrastructure code

---

### `contracts`

- Zod schemas
- DTOs
- API request/response shapes
- Event payload definitions

---

### `permissions`

- Authorization logic
- Role and access checks
- Facility + resource-level policies

---

### `auth`

- Actor resolution
- Session/token helpers
- Identity mapping logic
- Shared auth utilities

---

### `db`

- Drizzle schema
- Repositories
- Query helpers
- Transaction primitives

---

### `events`

- Event names
- Queue/topic names
- Payload contracts

---

### `observability`

- Logging
- Tracing
- Metrics

---

### `config`

- Environment parsing
- Runtime configuration

---

### `application`

- Use cases
- Business workflows
- Transaction boundaries
- Event emission
- Permission enforcement

---

## Dependency Graph

### Allowed Imports

```
domain
  → (none)

contracts
  → domain

permissions
  → domain
  → contracts

auth
  → domain
  → contracts
  → permissions

db
  → domain
  → contracts

events
  → domain
  → contracts

observability
  → contracts (optional)

config
  → contracts (optional)

application
  → domain
  → db
  → contracts
  → permissions
  → events
  → observability
```

---

### App Dependencies

#### `apps/ams` / `apps/portal`

- application
- auth
- contracts
- permissions
- observability
- config

#### `apps/api`

- application
- auth
- contracts
- permissions
- events
- observability
- config

---

### Worker Dependencies

#### `ts-worker`

- application
- db
- contracts
- events
- observability
- config

#### `py-worker`

- Uses shared contracts via API or generated schemas (not TS imports)

---

## Forbidden Dependencies

```
domain        ✕ any internal package
contracts     ✕ application, db, apps, workers
db            ✕ application, apps, workers
permissions   ✕ db, application, apps, workers
auth          ✕ application, apps, workers
events        ✕ application, db, apps, workers
packages/*    ✕ apps/*
packages/*    ✕ workers/*
apps/*        ✕ other apps/*
application   ✕ apps/*
application   ✕ workers/*
```

---

## Authentication & Authorization Model

### Identity

- `users` = core identity
- `account` = OAuth provider linkage
- Magic link handled via verification tokens

---

### Authorization

#### Global Role

- Stored on `users.systemRole`
- Example: `super_admin`

#### Facility Role

- Stored in `userRoles`
- Includes:

  - `facilityId`
  - `role`
  - `access`
  - `isActive`

#### Resource Access

- Stored in tables like:

  - `player_client_access`

---

### Actor Model

All application logic operates on:

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

---

## Authorization Rules

1. If `systemRole === super_admin` → allow
2. Else evaluate facility membership
3. Else evaluate resource-level access

---

## Data Model Guidelines

### `users`

- Core identity
- Always contains:

  - name
  - email

---

### `userRoles`

- Facility-scoped roles
- Source of truth for authorization

---

### Profile Tables

#### `staffProfiles`

- jobTitle
- phone
- certifications

#### `clientProfiles`

- onboarding data
- client-specific fields

---

### Rule

- Identity → `users`
- Authorization → `userRoles`
- Metadata → profile tables

---

## Application Layer Rules

- All writes go through `application`
- Transactions live in `application`
- Permissions are enforced in `application`
- Events are emitted from `application`

---

## App Layer Rules

Apps are responsible for:

- Authentication (Auth.js config)
- Request handling
- Server actions / route handlers
- Calling application use cases
- UI-specific data shaping

Apps must NOT:

- Contain business logic
- Manage transactions
- Reimplement permission logic

---

## Worker Rules

Workers:

- Consume events
- Execute background jobs
- Call application or db helpers
- Emit follow-up events

Workers must NOT:

- Contain business logic that diverges from `application`

---

## Design Philosophy

This system is:

- **Strict on direction**
- **Pragmatic on usage**

We enforce:

- No circular dependencies
- Clean layering
- Centralized business logic

We allow:

- `contracts` to reuse domain types
- App-level read composition when necessary
- Practical flexibility where it improves developer velocity

---

## Summary

This architecture ensures:

- Scalability across multiple apps and facilities
- Clean separation between identity, authorization, and data
- Safe evolution of features like:

  - portal expansion
  - multi-facility support
  - workers and AI pipelines

---

## Future Considerations

- Introduce workflow orchestration (Temporal) if job complexity increases
- Expand permission system for fine-grained access control
- Introduce read-model layer if query complexity grows
- Add enforcement via Nx module boundary rules

---
