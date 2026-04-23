# Client Portal Journal Implementation Spec

## Objective

Build the remaining functionality for the new **Journal** feature in the client portal using the already-implemented Drizzle schema.

This feature should allow players and parents to log outside-of-facility activity and reflection data, while allowing coaches to review the same information in a structured and useful way.

The first supported journal entry types are:

- **Throwing**
- **Hitting**

The architecture should be designed so future entry types can be added without a major refactor, such as:

- strength
- wellness
- recovery
- nutrition
- other custom journal types

This implementation should follow the current AMS architecture direction:

- keep domain logic out of UI components
- use domain + application + query layers
- server-first where appropriate
- typed DTOs and serializers where useful
- keep UI simple and client-portal-friendly
- optimize for low-friction daily logging

---

# Product Goals

## Player / Parent Goals

Players or parents should be able to:

- create a journal entry from the client portal
- choose the type of entry
- log a throwing session with workload and arm-status details
- log a hitting game/performance reflection with at-bat outcomes
- view recent journal history
- edit or delete their own journal entries
- feel that the journal is fast and easy to use, not like filling out a long internal coaching form

## Coach Goals

Coaches should be able to:

- view recent journal activity for a player
- review throwing activity outside the facility
- review hitting game reflections and at-bat outcomes
- identify patterns and context between facility visits
- eventually connect journal activity into player performance views

## System Goals

The implementation should:

- treat `journal_entries` as the shared parent entry object
- keep throwing and hitting details in domain-specific child tables
- support future entry types cleanly
- allow derived throwing summary calculations
- keep queries easy to consume from the client portal
- avoid putting business logic in route handlers or UI

---

# Scope

## In Scope for this implementation

- domain models / schemas / validators for journal entry workflows
- application-level create, update, delete, read flows
- query functions for journal page data
- portal UI for listing and creating journal entries
- throwing entry form
- hitting entry form
- recent entries list
- journal entry detail cards
- edit support
- delete support
- throwing summary recomputation hook/function after write operations
- mobile first UI for client portal components

## Out of Scope for now

- notifications
- reminders
- streak systems
- analytics dashboards beyond basic summaries
- performance tab integration beyond laying groundwork
- strength/wellness entry types
- image/file attachments
- advanced coach comments system
- background jobs unless already required by architecture

---

# Assumptions

- The Drizzle schema files for the journal tables are already implemented.
- Auth and client portal user identity already exist.
- There is already a portal route area, likely something like `app/portal/...`.
- Players and parents only see journal data for the player(s) they are allowed to access.
- Coaches/admins may later need broader views, but this initial UI is for the client portal.
- Existing project patterns for queries, mutations, and route handlers should be followed where practical.

---

# High Level Architecture

Use the following layers:

## Domain layer

Responsible for:

- journal types
- validation schemas
- DTO input/output definitions
- normalization/parsing helpers
- transformation logic between raw form input and persistence input
- throwing workload calculation helpers
- hitting aggregate helpers

## Application layer

Responsible for:

- orchestrating create/update/delete flows
- permission checks using current portal user context
- transactional writes across parent and child journal tables
- invoking derived summary recomputation after writes
- returning clean result objects for routes/actions

## Query layer

Responsible for:

- fetching recent journal entries for a player
- fetching a single full journal entry by id
- fetching list data for the portal journal page
- fetching throwing detail children
- fetching hitting detail children and at-bat rows
- fetching journal entry edit payloads

## UI layer

Responsible for:

- journal page shells
- cards/lists/forms/dialogs
- calling application actions
- rendering query results
- keeping interaction simple and low-friction

---

# Required Files and Responsibilities

## Domain

Create a journal domain area, for example:

- `src/domain/journal/types.ts`
- `src/domain/journal/schemas.ts`
- `src/domain/journal/serializers.ts`
- `src/domain/journal/throwing.ts`
- `src/domain/journal/hitting.ts`

### `types.ts`

Define the primary domain types for:

- journal entry type enums
- create/update input DTOs
- portal-facing summary DTOs
- throwing entry payload DTO
- hitting entry payload DTO
- list item DTOs
- detail DTOs

Suggested types:

- `JournalEntryType`
- `JournalEntryListItem`
- `JournalEntryDetail`
- `CreateThrowingJournalEntryInput`
- `CreateHittingJournalEntryInput`
- `UpdateThrowingJournalEntryInput`
- `UpdateHittingJournalEntryInput`
- `ThrowingWorkloadSegmentInput`
- `ThrowingArmCheckinInput`
- `HittingAtBatInput`

### `schemas.ts`

Add zod schemas for:

- shared journal entry base fields
- throwing create/update input
- hitting create/update input
- workload segment validation
- at-bat row validation

Validation expectations:

#### Shared fields

- `entryDate` required
- `entryType` required
- `contextType` optional where supported
- `title` optional
- `summaryNote` optional with sane max lengths

#### Throwing form validation

- at least one workload segment is required
- each segment requires:
  - `throwType`
  - `throwCount`
- `pitchCount` optional
- `intentLevel` optional
- `velocityAvg` and `velocityMax` optional
- arm checkin is optional but should validate if present
- allow low-friction logging, do not over-require fields

#### Hitting form validation

- `atBats` array required for game reflection flow
- each at-bat requires:
  - `atBatNumber`
  - `outcome`
- optional metadata:
  - opponent
  - location
  - confidenceScore
  - overallFeel
  - summaryNote

### `serializers.ts`

Add helpers to:

- convert form values into application inputs
- convert DB query results into UI DTOs
- build a normalized entry detail shape regardless of entry type
- serialize edit payloads for form default values

### `throwing.ts`

Add domain helpers for:

- total throw count aggregation
- total pitch count aggregation
- workload quality classification
- high-intent exposure detection
- game exposure detection
- bullpen exposure detection

Also add a simple v1 workload unit calculation helper:

- compute workload units from workload segment rows
- prefer velocity-aware logic when velocity is present
- else intent-based
- else throw-type-only weighting

Keep this isolated so the formula can evolve later.

### `hitting.ts`

Add domain helpers for:

- plate appearance count from at-bat rows
- at-bat count from at-bat rows
- aggregate counts by outcome
- generate small hitting summary text if useful
- normalize at-bat numbering

---

## Application

Create application services, for example:

- `src/application/journal/createJournalEntry.ts`
- `src/application/journal/updateJournalEntry.ts`
- `src/application/journal/deleteJournalEntry.ts`
- `src/application/journal/getJournalEntryDetail.ts`
- `src/application/journal/listJournalEntriesForPlayer.ts`
- `src/application/journal/recomputeThrowingDailySummary.ts`

These should contain the main orchestration logic.

## `createJournalEntry.ts`

Implement create flows for:

- shared parent `journal_entries` row
- type-specific child row
- type-specific child details

Support:

- throwing entry creation
- hitting entry creation

### Throwing create flow

Transaction should create:

1. `journal_entries`
2. `throwing_journal_entries`
3. one or more `throwing_workload_entries`
4. optional `throwing_arm_checkins`

After transaction: 5. recompute or upsert `throwing_workload_daily_summaries` for that player/date

### Hitting create flow

Transaction should create:

1. `journal_entries`
2. `hitting_journal_entries`
3. one or more `hitting_journal_at_bats`

The application function should accept a discriminated union input based on `entryType`.

## `updateJournalEntry.ts`

Implement update flows for:

- shared journal entry fields
- child entry fields
- replacing child rows safely where appropriate

Recommended approach:

- fetch existing entry with permission check
- update shared parent
- update type-specific child parent
- for workload segments / at-bats:
  - simplest v1 approach is delete-and-reinsert child rows for the entry
- for throwing arm checkin:
  - upsert or delete/recreate depending on submitted values
- recompute throwing daily summary after throwing updates

## `deleteJournalEntry.ts`

Implement delete flow:

- verify access
- determine entry type
- delete child rows first if needed
- delete child parent row
- delete shared `journal_entries` row
- recompute throwing daily summary if deleting a throwing entry
- return structured result

## `getJournalEntryDetail.ts`

Return a fully hydrated detail object for one journal entry:

- shared parent fields
- child detail fields
- workload segments or at-bats
- arm checkin if present
- portal-friendly normalized shape

## `listJournalEntriesForPlayer.ts`

Return recent entries for a player with:

- date
- entry type
- title or generated fallback title
- small summary
- context type
- counts/highlights
- link target / entry id

Support filters for:

- all
- throwing
- hitting

## `recomputeThrowingDailySummary.ts`

Implement an application service that:

- loads all throwing journal data for a player on a given date
- aggregates all workload segments across all throwing journal entries that day
- merges optional arm checkin inputs if present
- upserts `throwing_workload_daily_summaries`

This function should be reusable from:

- create
- update
- delete

Keep this as the single source of truth for daily summary recomputation.

---

# Query Layer

Create query functions, for example:

- `src/db/queries/journal/getJournalEntriesForPlayer.ts`
- `src/db/queries/journal/getJournalEntryById.ts`
- `src/db/queries/journal/getThrowingEntriesForDay.ts`
- `src/db/queries/journal/getThrowingSummaryForRange.ts`

## `getJournalEntriesForPlayer`

Should return recent entries with enough data for journal list cards.

Needs to:

- join `journal_entries`
- conditionally join hitting or throwing child parents
- order by `entryDate desc`, then `createdOn desc`
- support pagination or limit
- support optional type filter

Return a normalized list DTO rather than leaking raw DB row shapes to UI.

## `getJournalEntryById`

Should return:

- shared parent row
- type-specific child parent
- child detail rows
- throwing arm checkin if applicable

Can either:

- return raw joined data for serialization in application layer
  or
- return normalized detail DTO directly

## `getThrowingEntriesForDay`

Needed by recompute logic:

- fetch all throwing journal entries for `playerId + date`
- include workload segments
- include arm checkins
- used to calculate/upsert the daily summary

## `getThrowingSummaryForRange`

Optional but useful for future graphing:

- return daily summary rows for a date range
- used later for portal trend cards

---

# Permissions and Access Rules

Codex should implement access checks carefully.

## Portal view assumptions

- players can access only their own journal data
- parents can access only journal data for linked player accounts
- coaches/admins may have broader access if existing portal/internal rules allow it

Do not assume journal data is public just because it is in the portal.

All application read/write flows should use an access utility or existing portal player access resolver.

If there is already an abstraction for portal player authorization, use it.

If not, create a small helper such as:

- `assertCanAccessPortalPlayer(playerId, sessionUser)`
- `assertCanWritePortalJournalEntry(playerId, sessionUser)`
- `assertCanAccessJournalEntry(journalEntryId, sessionUser)`

---

# Routes / Actions

Use the existing project conventions.

If the portal uses server actions, implement server actions.
If the project is more API-route driven for mutations, use API routes.
Prefer consistency with the current portal architecture.

Likely needed operations:

- create journal entry
- update journal entry
- delete journal entry

Suggested endpoints or actions:

- `createJournalEntryAction`
- `updateJournalEntryAction`
- `deleteJournalEntryAction`

They should:

- validate with zod
- call application services
- return structured success/error objects
- avoid embedding business logic directly in UI files

---

# UI Requirements

Implement the journal page in the client portal.

Suggested route:

- `app/portal/[playerId]/journal/page.tsx`
  or whatever portal route structure already exists

Use the real project route conventions rather than forcing this exact path.

## Main Journal Page

The journal page should include:

### 1. Journal page header

Show:

- page title
- short description
- primary CTA: `Log Entry`

Optional secondary UI:

- type filter tabs or pills:
  - All
  - Throwing
  - Hitting

### 2. Recent journal feed

Render recent entries in descending order.
Each entry should show:

- date
- type badge
- title or fallback label
- short summary
- quick stats
- edit action
- delete action

### 3. Empty state

If there are no entries:

- show a friendly empty state
- explain the purpose of the journal
- provide CTA to create first entry

---

# Required Components

Create components roughly along these lines:

- `JournalPage`
- `JournalHeader`
- `JournalFeed`
- `JournalEntryCard`
- `JournalEntryTypeBadge`
- `JournalCreateEntryDialog` or sheet
- `JournalEntryTypePicker`
- `ThrowingJournalForm`
- `ThrowingWorkloadSegmentFieldArray`
- `ThrowingArmCheckinFields`
- `HittingJournalForm`
- `HittingAtBatFieldArray`
- `JournalEntryDetailCard`
- `JournalDeleteDialog`

Use your existing design system and form patterns.

Prefer composition over one giant component.

---

# Throwing Form UX Requirements

The throwing form should be low friction.

## Shared fields

- entry date
- context type
- title optional
- summary note optional

## Throwing-specific fields

- overall feel optional
- confidence score optional

## Workload segments

Allow multiple segments.
Each segment should support:

- throw type
- throw count
- pitch count optional
- intent optional
- velocity avg optional
- velocity max optional
- notes optional

The UI should make adding/removing segments easy.

Default to starting with one segment.

## Arm checkin section

Optional section with:

- arm soreness
- body fatigue
- arm fatigue
- recovery score
- feels off
- status note

Do not require this section for successful submission.

---

# Hitting Form UX Requirements

The hitting form should support game reflection first.

## Shared fields

- entry date
- context type default or suggested as `game`
- title optional
- summary note optional

## Hitting-specific fields

- opponent optional
- team name optional
- location optional
- overall feel optional
- confidence score optional

## At-bat list

Allow multiple at-bats.
Each at-bat should support:

- at-bat number
- outcome
- notes optional

Optional advanced fields:

- pitch type seen
- pitch location
- count at result
- runners in scoring position
- rbi

Start simple in UI. Advanced fields can be hidden behind an expand toggle if needed.

---

# Form and Component Standards

Follow existing project standards.

## Forms

- use the project’s preferred form library and patterns
- support edit mode
- support server validation errors
- keep schema validation centralized
- do not duplicate validation rules in many places

## Components

- support light/dark theme
- match portal design language
- keep cards and forms clean, simple, and readable
- no overdesigned internal-tool look
- should feel appropriate for parents and players
- keep components mobile first for all components that will be used in /portal route

## Accessibility

- labeled controls
- keyboard-friendly dialogs
- clear validation messages
- destructive delete confirmation

---

# Suggested DTO Shapes

These do not need to match exactly, but codex should preserve the spirit.

## Journal list item DTO

```ts
type JournalEntryListItem = {
  id: string;
  entryDate: string;
  entryType: "throwing" | "hitting" | "strength" | "wellness" | "other";
  contextType: string | null;
  title: string | null;
  summary: string | null;
  highlights: string[];
  createdOn: string;
};
```

## Throwing detail DTO

```ts
type ThrowingJournalEntryDetail = {
  id: string;
  entryType: "throwing";
  entryDate: string;
  contextType: string | null;
  title: string | null;
  summaryNote: string | null;
  overallFeel: number | null;
  confidenceScore: number | null;
  sessionNote: string | null;
  workloadSegments: Array<{
    id: string;
    throwType: string;
    throwCount: number;
    pitchCount: number | null;
    intentLevel: string | null;
    velocityAvg: number | null;
    velocityMax: number | null;
    notes: string | null;
  }>;
  armCheckin: {
    armSoreness: number | null;
    bodyFatigue: number | null;
    armFatigue: number | null;
    recoveryScore: number | null;
    feelsOff: boolean | null;
    statusNote: string | null;
  } | null;
};
```

## Hitting detail DTO

```ts
type HittingJournalEntryDetail = {
  id: string;
  entryType: "hitting";
  entryDate: string;
  contextType: string | null;
  title: string | null;
  summaryNote: string | null;
  opponent: string | null;
  teamName: string | null;
  location: string | null;
  overallFeel: number | null;
  confidenceScore: number | null;
  atBats: Array<{
    id: string;
    atBatNumber: number;
    outcome: string;
    notes: string | null;
    pitchTypeSeen: string | null;
    pitchLocation: string | null;
    countAtResult: string | null;
    runnersInScoringPosition: boolean | null;
    rbi: number | null;
  }>;
};
```

---

# Throwing Daily Summary Logic

Codex should implement basic upsert logic for `throwing_workload_daily_summaries`.

## Source inputs

For a single player and date:

- all throwing journal entries
- all workload segments under those entries
- all arm checkins under those entries

## Derived fields

Compute:

- `totalThrowCount`
- `totalPitchCount`
- `workloadUnits`
- `workloadQuality`
- `entryCount`
- `hasGameExposure`
- `hasBullpen`
- `hasHighIntentExposure`
- `sorenessScore`
- `fatigueScore`

For v1:

- if multiple arm checkins exist due to future edge cases, choose a deterministic approach
- likely use latest checkin or average values
- document this decision in code comments

Do not overcomplicate acute/chronic calculations yet unless easy to add.
It is okay to leave:

- `acute7Load`
- `chronic28Load`
- `acuteChronicRatio`
- `readinessScore`
- `readinessStatus`
- `readinessReason`

as nullable if the full logic is not being built in this pass.

However, the structure should make it easy to add later.

---

# List Card Display Logic

Codex should create clean summary text/highlights for each type.

## Throwing card examples

Show highlights such as:

- `82 throws`
- `2 segments`
- `bullpen`
- `arm soreness: 2/5`

## Hitting card examples

Show highlights such as:

- `4 AB`
- `1 single`
- `1 walk`
- `felt more on time today`

Generate these in serializer/helpers, not in JSX string soup.

---

# Edit Mode Requirements

Editing should work for both entry types.

## Throwing edit

- load shared parent fields
- load throwing child parent
- load workload segments
- load arm checkin
- populate form defaults
- save through update application flow

## Hitting edit

- load shared parent fields
- load hitting child parent
- load at-bats
- populate form defaults
- save through update application flow

Prefer reusing the same form components for create/edit.

---

# Delete Requirements

Provide delete support from the journal feed.
Use a confirmation dialog.

Delete should:

- confirm the entry type
- call delete application action
- refresh list state cleanly
- if throwing, recompute daily summary afterward

---

# Performance and Query Notes

- keep list queries lightweight
- hydrate full detail only when needed for edit/detail
- avoid N+1 query patterns if possible
- keep ordering deterministic
- if pagination already exists in the portal patterns, use it
- otherwise start with a reasonable recent limit

---

# Testing Expectations

Codex should add tests where the project already expects them.

At minimum, add focused tests for:

## Domain tests

- throwing workload aggregation
- workload quality classification
- hitting outcome aggregation

## Application tests

- create throwing journal entry creates parent + children
- create hitting journal entry creates parent + children
- update replaces child rows correctly
- delete removes entry correctly
- throwing daily summary upsert works for create/update/delete

## Validation tests

- invalid workload segment rejected
- invalid at-bat rejected
- missing required fields rejected

If the repo does not currently have strong test coverage in these areas, prioritize clean and readable implementation over overbuilding tests, but add at least targeted unit coverage where practical.

---

# Code Quality Expectations

- do not put database write orchestration inside route handlers
- do not put summary-generation logic inside JSX
- keep discriminated unions explicit
- prefer small focused functions
- keep naming aligned with existing AMS conventions
- avoid generic “utils.ts” dumping grounds
- add comments where decisions may not be obvious
- be conservative about abstraction, but do not duplicate major logic

---

# Deliverables

Codex should implement the following:

## Domain

- journal domain types
- zod schemas
- serializers
- throwing helpers
- hitting helpers

## Application

- create journal entry flow
- update journal entry flow
- delete journal entry flow
- list journal entries flow
- get journal entry detail flow
- recompute throwing daily summary flow

## Query layer

- recent entries query
- full entry detail query
- throwing day aggregation query
- optional throwing summary range query

## UI

- client portal journal page
- recent journal feed
- create entry dialog/sheet
- throwing form
- hitting form
- edit flow
- delete flow
- empty state
- type filtering

---

# Implementation Priority

## Phase 1

- query layer
- domain schemas and serializers
- create flows
- list page
- throwing form
- hitting form

## Phase 2

- edit flow
- delete flow
- throwing summary recompute
- better list card summaries

## Phase 3

- detail view polish
- optional trend cards from daily summary
- groundwork for future strength/wellness journal types

---

# Notes for Codex

Important implementation guidance:

- Build this to be extensible, but do not over-abstract for future entry types yet.
- The immediate goal is a great experience for throwing and hitting.
- `journal_entries` is the shared parent object and should be treated that way consistently.
- Throwing summary recomputation should be centralized in one application service.
- Use derived DTOs for the UI rather than passing raw Drizzle row bundles through components.
- Favor clarity and maintainability over excessive cleverness.
- The final result should feel like a polished, low-friction player journal in the client portal, not an internal admin form cloned into the portal.
