# Client Portal Build Context

## Purpose

This document gives implementation context for building the first version of the client portal in the Athlete Management System (AMS).

This portal is for external client users, primarily parents and guardians. The first goal is to let a client log in and view one or more linked players. The first mobile-first version should focus on:

- secure client access to linked players
- a clear player profile home page
- a simple admin-driven invite flow
- placeholder pages for journaling, messaging coaches, and a future parent AI assistant

This is **not** the full messaging, journaling, or AI implementation. Those pages can begin as temporary placeholders with clean routing and navigation.

---

## Product Framing

The client portal is a new external-facing layer of the AMS.

It is not the same as the internal coach/admin app.

The client portal should:

- allow a client account to view multiple players
- allow a player to be linked to multiple client accounts
- begin with a polished mobile-first experience
- preserve a hard boundary between internal-only data and client-visible data

For the first version, think of the client portal as a **secure player development companion** for families.

---

## Authentication and Access Model

The portal is expected to use passwordless authentication.

High-level auth model:

- admin creates a client invite
- invite is tied to one or more players
- recipient receives invite email
- recipient signs in / creates account through passwordless auth
- on successful account creation, the system attaches the invited players to the new user

Authentication and authorization are separate concerns:

- authentication answers: who is this user?
- authorization answers: which players can this user access?

The core authorization source of truth is `player_client_access`.

---

## New Schema Additions and How They Should Be Used

The following tables already exist or are being added for client portal support.

### `user_roles`

Purpose:

- stores user role assignments within a facility

Expected use:

- add a `client` role for invited portal users
- use this instead of assuming every user is internal staff
- when invite is accepted, ensure the user has a `client` role for the facility

Important notes:

- a user may have more than one role in the long term
- all role checks should be facility-scoped

---

### `client_profiles`

Purpose:

- stores lightweight client-specific profile information

Expected use:

- create one row after a client accepts an invite and completes account creation
- use this for client-facing metadata rather than overloading the base user record

Useful fields for now:

- first name
- last name
- phone
- onboarding complete flag

---

### `client_invites`

Purpose:

- stores pending external client invites before the account is fully linked

Expected use:

- admin creates an invite for a parent / guardian / self-access user
- invite stores email, relationship type, token hash, expiration, status, and who created it
- invite is temporary and should not be the permanent access record

Status lifecycle:

- pending
- accepted
- expired
- revoked

Important notes:

- store hashed token, not raw token
- invite acceptance should be validated against expiration and status

---

### `client_invite_players`

Purpose:

- links a single invite to one or more players

Expected use:

- one invite may include multiple players for the same parent account
- when invite is accepted, these player assignments are converted into `player_client_access` rows

---

### `player_client_access`

Purpose:

- permanent authorization mapping between a real user account and one or more players

This is the most important table for the client portal.

Expected use:

- every portal request for player data should authorize through this table
- use it to determine which players a client user can access
- use the boolean permission fields to gate future features

Current permission concepts:

- `canView`
- `canLogActivity`
- `canUpload`
- `canMessage`

Important notes:

- all checks should be scoped by `userId`, `playerId`, and `facilityId`
- this table should be the main source of truth for client access
- do not infer access from invites once account creation is complete

---

## Core Access Rules

The implementation should follow these rules:

1. A client may be linked to multiple players.
2. A player may be linked to multiple client users.
3. A client should only be able to see players linked through `player_client_access`.
4. All portal queries should be facility-scoped.
5. Internal coach/admin-only data should not automatically be exposed in the client portal.
6. Temporary pages like journaling, messaging, and AI assistant should still be access-aware and player-scoped.

---

## Required Query Layer

The client portal will need a clean query/service layer. The names do not need to match exactly, but this is the intended behavior.

### 1. `getClientAccessiblePlayers(userId, facilityId)`

Purpose:

- return all players the logged-in client can access

Should:

- join `player_client_access` to player table
- filter to `status = active`
- require `canView = true`
- scope by `facilityId`
- return enough player summary info for a player switcher and default profile page

Suggested return shape:

- player id
- full name
- age / DOB if already supported
- profile image if available later
- handedness if available
- active injury summary if client-visible
- latest development plan summary if available

---

### 2. `getClientPlayerProfile(userId, facilityId, playerId)`

Purpose:

- return all client-visible information for a single player profile page

Should:

- first validate access through `player_client_access`
- only return client-visible data
- power the default page when a player is selected

Likely sections to return:

- player basics
- active development plans
- recent lessons or lesson summaries that are safe for client view
- routines that are safe for client view
- injuries or health items only if approved for client visibility

Important note:

- keep a hard boundary between internal notes and client-visible summaries

---

### 3. `getClientPortalContext(userId, facilityId)`

Purpose:

- return the initial shell data needed to load the portal

Should include:

- current client profile
- all accessible players
- a default selected player

Recommended behavior:

- if there is only one player, auto-select it
- if there are multiple players, use the first active one or a persisted last-selected player later

---

### 4. `acceptClientInvite({ token, userId })`

Purpose:

- complete invite acceptance after authentication

Expected flow:

1. look up invite by hashed token
2. validate status is pending
3. validate invite is not expired
4. create or confirm `client_profiles` row
5. create or confirm `user_roles` row with role `client`
6. fetch linked players from `client_invite_players`
7. create `player_client_access` rows for each linked player
8. mark invite accepted

Implementation note:

- handle idempotency cleanly in case a user reloads during acceptance

---

### 5. `getClientAccessForPlayer(userId, facilityId, playerId)`

Purpose:

- reusable helper to validate whether a client can access a given player and what actions are allowed

Should return:

- access row
- permissions
- relationship type
- active / revoked status

This should be reused by any future journaling, messaging, uploads, or AI routes.

---

## Admin Invite Flow

The admin experience should be straightforward.

### Admin Goal

An admin should be able to invite a parent or guardian into the portal and pre-link one or more players before that person has an account.

### Admin Invite Form

The first version of the admin invite experience should include:

- facility
- recipient email
- first name
- last name
- relationship type
- select one or more players

Optional later:

- toggle permissions
- custom welcome message
- resend invite
- revoke invite

### Relationship Type Options

Use the schema enum values:

- parent
- guardian
- self
- other

### Admin Flow

1. Admin opens client invite form.
2. Admin enters recipient information.
3. Admin selects one or more players.
4. System creates `client_invites` row.
5. System creates one or more `client_invite_players` rows.
6. System sends invite email with passwordless link.
7. After account creation / sign-in, invite is accepted and access rows are created.

### Admin UI Notes

This should likely live in the internal admin app, not the client portal.

For the first version, admins should be able to see:

- invite status
- invite email
- linked players
- created date
- expiration date
- resend / revoke actions later

---

## Client Portal Design Goals

The first version should be **mobile first**.

The portal should feel like a real app, not a squeezed desktop page.

### Key UX principles

- optimize for phone screens first
- keep navigation simple and thumb-friendly
- default to one player profile page at a time
- support multiple players through a switcher at the top
- use a fixed bottom navigation bar
- treat journaling, messaging, and AI assistant as separate routes/pages

This should feel closer to a lightweight social/app shell than a dashboard overloaded with tables.

---

## Portal Information Architecture

### Default Page

The default page should be the selected child’s profile page.

This is the main home screen of the client portal.

### Additional Temporary Pages

There should be placeholder routes/pages for:

- journaling
- messaging coaches
- parent AI assistant
- account settings

These do not need full business logic yet, but they should exist as navigable pages within the app shell.

---

## Mobile-First Layout

### Overall shell

Use a mobile-first app shell with:

- top section for current player context
- central scrollable content area
- fixed bottom navigation bar

### Top area

The top of the profile page should include:

- player switcher if multiple players exist
- selected player name
- a compact player summary

Potential summary items:

- player name
- age / graduation year if available
- primary sport details already stored in AMS
- high-level status badges later

### Main content area

For the initial player profile page, prioritize a readable stacked layout.

Suggested sections, in order:

1. Player header card
2. Development plan snapshot
3. Recent lesson summaries
4. Assigned routines or current work
5. Health / injury summary if client-visible

This page should be more narrative and card-based than table-based.

---

## Bottom Navigation Bar

The bottom navigation should be fixed, mobile-first, and always visible while inside the portal shell.

Use an Instagram-style bottom bar concept.

There should be four options.

### 1. Profile / Home

Purpose:

- takes user to the default selected player profile page

Suggested icon concept:

- home or player/profile icon

---

### 2. Journaling

Purpose:

- temporary placeholder page for future player/client journaling features

This route should exist now, even if the page only contains placeholder content.

Placeholder page content can say:

- journaling features coming soon
- this area will allow families to log reflections, updates, and development notes

Suggested icon concept:

- notebook / journal icon

---

### 3. Messaging Coaches

Purpose:

- temporary placeholder page for future coach messaging

This route should exist now, even if not yet connected to real messaging threads.

Placeholder page content can say:

- messaging features coming soon
- this area will allow parents to communicate with coaches about a selected player

Suggested icon concept:

- message / chat bubble icon

---

### 4. Parent AI Assistant

Purpose:

- temporary placeholder page for the future LLM-powered parent assistant

This route should exist now as the eventual home of the parent-facing AI experience.

Placeholder page content can say:

- AI assistant coming soon
- this area will allow parents to ask questions about development, routines, and player progress

Suggested icon concept:

- sparkles / assistant icon

---

### Account Settings Access

The user specifically wants account settings available from the bottom bar concept as well.

Because the bar is already crowded, use one of these approaches:

#### Preferred option

Make the far-right bottom nav item `Settings` for v1, and place the AI assistant as a temporary card entry on the profile page until a 5-tab nav is desired.

#### If following the user request literally

Support five bottom nav items:

- Profile
- Journaling
- Messaging
- AI Assistant
- Settings

If five items are used, keep icons minimal and labels short.

For implementation, prefer the five-item version if it still feels usable on mobile.

### Recommended final v1 nav set

- Profile
- Journal
- Messages
- AI
- Settings

This best matches the requested product direction.

---

## Default Selected Player Behavior

If a client has multiple linked players:

- show a player switcher at the top of the profile page
- allow easy switching between players without leaving the portal shell
- all temporary pages should remain aware of the currently selected player

For example:

- Journaling page should indicate which player is currently selected
- Messaging page should indicate the selected player context
- AI page should eventually use the selected player as grounding context

---

## Data Visibility Rules for v1

The client portal should not expose all internal AMS data.

Safe initial rule:

- only show data that is intentionally selected for client view

Examples of likely client-visible content:

- player basics
- development plan summaries
- routine summaries
- lesson summaries written or transformed for client readability

Examples of likely internal-only content:

- raw internal coach notes
- internal flags
- staff-only operational notes
- unfinished internal evaluation content not meant for parents

If there is uncertainty, default to not exposing it.

---

Here’s a **copy-paste-ready markdown section** you can append to your Codex context file 👇

---

````md
---

## Routing Strategy and App Structure (Important)

The current AMS app is **NOT being refactored** to move all internal routes into an `/internal` folder.

Instead, we are introducing the client portal as a **new route surface** under `/portal` while leaving all existing routes unchanged.

### Current Structure (Do NOT refactor existing routes)

```txt
app/
  layout.tsx
  page.tsx
  players/
  lessons/
  evaluations/
  ...
  portal/
    layout.tsx
    page.tsx
    journal/
    messages/
    assistant/
    settings/
```
````

### URL Structure

- Internal app (existing routes):

  - `/players`
  - `/lessons`
  - `/evaluations`

- Client portal (new routes):

  - `/portal`
  - `/portal/journal`
  - `/portal/messages`
  - `/portal/assistant`
  - `/portal/settings`

---

## Why This Approach Is Being Used

- Avoids risky refactor of existing internal routes
- Keeps development velocity high
- Establishes a clean product boundary without breaking anything
- Allows future migration to `/internal` or a separate app if needed

---

## Route Group Clarification (Do NOT use for this purpose)

Next.js supports **route groups** using `(folder)` syntax.

Example:

```txt
app/(internal)/dashboard/page.tsx → /dashboard
```

Important behavior:

- Route groups are **not included in the URL**
- They are only for organization and layout separation ([Next.js][1])

We are NOT using route groups here because:

- We WANT `/portal` to be a real URL segment
- We are not reorganizing internal routes right now
- We want a clear product boundary between internal and client-facing surfaces

---

## Portal Layout Requirements

The `/portal` route must have a completely separate layout from the internal app.

### `app/portal/layout.tsx` must:

- Be mobile-first
- Include fixed bottom navigation
- Not include any internal admin UI (no sidebar, no admin nav)
- Provide a clean, client-facing experience
- Eventually support selected player context (state or provider)

---

## Separation Rules (Critical)

Even though both internal and portal routes live in the same app:

### DO NOT:

- Reuse internal pages directly inside `/portal`
- Expose internal-only data to client views
- Assume internal UI patterns apply to portal

### DO:

- Create portal-specific UI components
- Use shared query/domain logic where safe
- Enforce access through `player_client_access`
- Treat `/portal` as a separate product surface

---

## Auth + Access Expectations

Routing alone does NOT enforce security.

All `/portal` routes must:

- Require authenticated users
- Require `client` role via `user_roles`
- Scope all queries by:

  - `userId`
  - `facilityId`
  - `playerId` (when applicable)

Internal routes should continue to require:

- `admin` or `coach` roles

---

## Future Direction (Do NOT implement now)

This structure is intentionally designed to allow:

- Future migration to:

  - `app/internal/` OR
  - separate frontend apps (internal vs portal)

- Shared backend (DB + API) with multiple frontend surfaces

For now:

> Treat `/portal` as a separate product inside the same app.

---

## Key Principle

The separation between internal and portal is defined by:

- layout
- auth
- data visibility
- user intent

NOT by folder restructuring.

---

## Summary for Codex

- Do NOT move existing routes
- Add new client portal under `/portal`
- Build portal as a mobile-first experience
- Use a dedicated layout and navigation system
- Enforce access via `player_client_access`
- Keep internal and client surfaces logically separated

---

## Placeholder Page Expectations

The journaling, messaging, assistant, and settings pages do not need final business logic yet.

They should still:

- render cleanly in the mobile shell
- preserve selected player context where appropriate
- fit the final design direction
- avoid looking broken or incomplete

Simple, polished placeholder cards are enough for now.

---

## Design Direction

Use the current AMS design language where possible, but adapt it for a more consumer-friendly mobile feel.

Guidance:

- mobile-first spacing
- card-driven layout
- readable typography
- minimal clutter
- fixed bottom navigation
- soft, clear hierarchy

The portal should feel polished and approachable for parents, not like internal software.

---

## Initial Build Priorities

1. Build the client portal layout shell.
2. Build the bottom navigation.
3. Build the default player profile page.
4. Add player switcher support for multi-player accounts.
5. Wire the required access queries.
6. Create admin invite flow.
7. Add temporary placeholder pages for Journal, Messages, AI, and Settings.

---

## Summary for Codex

When implementing this work, prioritize these truths:

- `player_client_access` is the core authorization layer
- `client_invites` and `client_invite_players` power onboarding
- `user_roles` and `client_profiles` should be created/updated when an invite is accepted
- the client portal is mobile first
- the default screen is the selected child’s profile page
- the portal should support multiple linked players
- the portal should use a fixed bottom navigation bar
- include temporary pages for Journal, Messages, AI Assistant, and Settings
- do not expose internal-only coaching data to clients by default

Build the first version as a clean, navigable shell with the correct data/access foundations rather than overbuilding unfinished business features.
