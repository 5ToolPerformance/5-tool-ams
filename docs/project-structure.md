# Project Structure

This project is organized around clear server/application boundaries. Code should
live in the narrowest layer that owns its responsibility, and imports should make
that ownership obvious.

## `src/application`

Application code owns workflows and use cases. It coordinates auth context,
domain rules, persistence queries, external systems, storage, and route-facing
or UI-facing data shapes.

Use this directory for:

- Route and server-action orchestration.
- Feature workflows such as creating lessons, generating reports, syncing
  external systems, or preparing page data.
- Calls to `src/db` queries combined with authorization, validation, or domain
  mapping.
- API-client functions used by client components or hooks.

Application modules may import from `src/domain`, `src/db`, and `src/utils`.
They should not export service classes. Prefer a one-file-one-function shape,
with small `index.ts` barrels only at stable feature boundaries.

## `src/domain`

Domain code owns business rules, feature types, pure validation, and
transformations that do not depend on infrastructure.

Use this directory for:

- Domain types and shared domain errors.
- Pure validators and invariants.
- Business-rule helpers and calculations.
- Feature constants that represent business concepts.

Domain modules may import from `src/utils` when the helper is generic and
dependency-light. They should not import from `src/application`, `src/db`,
Next.js, auth providers, storage clients, or external APIs.

## `src/db`

Database code owns schema definitions, migrations, and persistence access.

Use this directory for:

- Drizzle schema and migration artifacts.
- Query functions that read or write persistence state.
- Transaction-compatible helpers that accept a db connection when needed.

Query modules should expose standalone functions, not repository objects. Reuse
existing query functions before adding new ones. Route handlers and components
should generally go through `src/application`; direct db imports are acceptable
only for server-side persistence boundaries that do not need workflow logic.

## `src/utils`

Utility code owns generic, dependency-light helpers that are not feature
specific.

Use this directory for:

- Date, string, clipboard, class-name, query-string, and generic math/stat
  helpers.
- Helpers that are reusable across unrelated features.

Utilities should not know about domain entities, db schema, auth context, route
handlers, or application workflows. If a helper understands a business concept,
move it to `src/domain` or `src/application` instead.

## Import Policy

- Components and routes should import workflows from `src/application`.
- Domain rules, domain types, and business validation should come from
  `src/domain`.
- Persistence access should come from `src/db`, usually through application
  workflows rather than directly from UI-facing code.
- Generic helpers should come from `src/utils`.
- `src/lib` is not a target location for new code.

## Barrel Policy

`index.ts` barrels are permitted when they define an intentional public API for a
feature, type group, or layer boundary. Barrels should not re-export entire
unrelated folders, hide cross-layer imports, or become compatibility shims for
old locations. Prefer direct function imports when a barrel does not clarify
ownership.
