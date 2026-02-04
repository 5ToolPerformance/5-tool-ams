# AMS Constitution

<!-- Athlete Management System Constitution -->

## Core Principles

### I. Domain-First Architecture (NON-NEGOTIABLE)

The AMS is a **domain-driven system**. Business logic lives in the domain layer and is **never coupled to UI, routing, or framework concerns**.

- All core rules, calculations, invariants, and workflows must exist in `/domain`
- Domain logic must be:
  - Framework-agnostic
  - Deterministic
  - Independently testable
- UI components **consume** domain models; they never implement business rules
- APIs, background jobs, and analytics pipelines all depend on the same domain contracts

> If logic feels “important,” it belongs in the domain.

---

### II. Explicit Application Orchestration

The application layer coordinates **who calls what and when** — nothing more.

- `/application` is responsible for:
  - Use cases (create lesson, upload evidence, log injury, etc.)
  - Authorization checks
  - Transaction boundaries
  - Side-effect orchestration (storage, notifications, analytics hooks)
- Application code:
  - May call domain logic
  - May call infrastructure services
  - Must not contain business rules itself
- Each application action should map cleanly to a user or system intent

> Application code answers _“how the system responds”_, not _“what the rules are.”_

---

### III. UI as a Pure Consumer

The UI layer exists to **present state and collect intent**, not to decide outcomes.

- `/ui`:
  - Renders domain/application outputs
  - Collects user input
  - Manages client-side UX state (loading, errors, optimistic updates)
- UI must not:
  - Reimplement validation rules
  - Perform calculations that exist in domain logic
  - Encode business assumptions
- All UI behavior should be explainable by:
  - A domain model
  - An application use case

> The UI should be swappable without rewriting the system.

---

### IV. Code Quality & Maintainability

AMS code must remain readable under pressure and scalable under growth.

**Standards**

- Strong typing everywhere (no `any`, no silent coercion)
- Clear naming over clever abstractions
- Functions do one thing or are broken apart
- Files should fit on one screen when possible
- Dead code is removed, not commented out

**Structure**

- Prefer explicit over implicit
- Prefer boring over magical
- Prefer composition over inheritance

> If it’s hard to explain in a PR, it’s probably too complex.

---

### V. Test-First Thinking (Strongly Enforced)

Tests define correctness. Code exists to satisfy tests.

- Domain logic **must** have unit tests
- Application workflows **must** have integration tests
- Tests should describe behavior, not implementation
- Every bug fix requires a regression test

**Required Coverage**

- Domain rules
- Calculations and scoring logic
- Permission boundaries
- Data transformations (CSV → normalized models)

> Untested logic is considered experimental, not production-ready.

---

### VI. User Experience Consistency

AMS is used daily by coaches under time pressure. UX consistency is critical.

- UI patterns must be reused, not reinvented
- Similar actions behave the same across the app
- Forms follow consistent validation, error, and success patterns
- Feedback is immediate and explicit (toasts, badges, status changes)

**UX Principles**

- Optimize for speed, clarity, and confidence
- Minimize cognitive load
- Make “what just happened?” obvious

> Coaches should never have to guess whether something worked.

---

### VII. Performance Is a Feature

Performance regressions are treated as bugs.

- Pages must load fast with real production data
- Avoid unnecessary re-renders, over-fetching, and N+1 queries
- Expensive work is deferred, cached, or moved off the request path
- File uploads, CSV parsing, and analytics pipelines must scale with usage

**Expectations**

- Player profile pages must remain responsive at scale
- Bulk data operations must not block UI interactions
- Analytics workloads must never degrade core app performance

> If it feels slow to you, it’s unacceptable for users.

---

### VIII. Observability & Debuggability

If something breaks, we must be able to explain why.

- Meaningful logs over silent failures
- Errors include context, not just stack traces
- Application boundaries are observable
- Domain failures are explicit and descriptive

> Debugging should feel like reading a story, not solving a puzzle.

---

## Folder Responsibilities

### `/domain`

The **heart of AMS**.

Contains:

- Core entities (Player, Lesson, Injury, Metric, Attachment)
- Value objects and invariants
- Scoring logic and calculations
- Domain services and rules

Rules:

- No framework imports
- No database calls
- No UI logic
- Fully testable in isolation

---

### `/application`

The **system coordinator**.

Contains:

- Use cases and workflows
- Authorization and role checks
- Transaction orchestration
- Integration with storage, analytics, and external services

Rules:

- Calls domain logic
- Calls infrastructure
- No rendering logic
- Minimal business rules

---

### `/ui`

The **user-facing layer**.

Contains:

- Pages and layouts
- Reusable UI components
- View models and adapters
- UX state management

Rules:

- No domain logic
- No persistence logic
- Consume application outputs only

---

## Development Workflow & Quality Gates

- Every PR must:
  - Respect domain/application/ui boundaries
  - Include tests where logic is introduced or changed
  - Avoid unnecessary abstractions
- Breaking changes require:
  - Migration plan
  - Documentation update
- Refactors must improve clarity, not just structure

---

## Governance

- This constitution supersedes personal preference and convenience
- Violations must be justified explicitly in PRs
- Amendments require:
  - Documentation update
  - Clear rationale
  - Migration or cleanup plan if needed

> The constitution exists to protect velocity _and_ quality.

---

**Version**: 1.0.0  
**Ratified**: 2026-02-04  
**Last Amended**: 2026-02-04
