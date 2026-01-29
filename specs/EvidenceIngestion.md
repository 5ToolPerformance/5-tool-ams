# Phase 1 — Evidence Capture & CSV-First Ingestion

## Purpose of This README

This document defines **Phase 1** of the AMS platform:  
**Evidence Capture via Attachments**, with a CSV-first ingestion strategy.

It exists to:

- Communicate architectural intent
- Define strict scope boundaries
- Prevent over-engineering
- Enable safe delegation of implementation work (e.g. to Codex)

If something is not explicitly described here, it should be assumed **out of scope** for Phase 1.

---

## Phase 1 Objectives (High Level)

Phase 1 is about **capturing evidence**, not interpreting it.

Specifically:

- Enable vendor-independent CSV ingestion
- Allow coaches to upload evidence (CSV, video, manual assessments)
- Allow evidence to be attached to lessons **before or after lesson creation**
- Preserve raw data immutably for future processing
- Avoid blocking coach workflows due to timing or missing data

---

## Explicit Non-Goals (Very Important)

Phase 1 does **NOT** include:

- Parsing or normalizing CSV data
- Metric extraction or calculations
- TPS / SBS computation
- Charts or visualizations
- External user access (players, parents, scouts)
- Vendor API integrations (hard stop on new APIs)

If implementation starts drifting toward any of the above, it is incorrect.

---

## Core Concept: Attachments as Evidence

All evidence in AMS is represented as an **Attachment**.

Attachments are:

- Immutable evidence artifacts
- Associated with an athlete
- Optionally associated with a lesson
- Created independently of processing or interpretation

### Attachment Types (Phase 1)

- `file_csv` — raw session data
- `file_video` — training or assessment clips
- `manual_assessment` — structured coach-entered data (e.g. TS Iso)

---

## User Entry Points

### 1. Player Profile → Data Drop

- Coaches can upload CSVs or videos at the player level
- No lesson association required at upload time
- Used for:
  - Bulk uploads
  - Historical data
  - Delayed session data

### 2. Lesson Creation → Attach Evidence

- Coaches can attach evidence while logging a lesson
- Supports file uploads and manual assessments

### 3. Existing Lesson → Attach Evidence (Post-Hoc)

- Coaches can attach evidence to an already-created lesson
- Critical workflow for real-world coaching timing

Attachments may remain unattached indefinitely.

---

## Attachment Metadata (Canonical Contract)

Every attachment must include:

### Identity

- Attachment ID (immutable)
- Attachment Type (`file_csv`, `file_video`, `manual_assessment`)
- Created At
- Created By

### Ownership & Scope

- Athlete ID (required, immutable)
- Facility ID (required)
- Lesson ID (optional, mutable)

### Classification & Intent

- Source Type (e.g. HitTrax, Blast, Manual, Other)
- Evidence Category (optional: hitting, pitching, etc.)
- Coach Notes (free text)

### Storage Reference

#### For CSV / Video

- Storage provider
- Storage key/path
- Original filename
- File size
- MIME type

#### For Manual Assessments

- Assessment type (e.g. `ts_iso`)
- Assessment payload (structured data stored in DB)

### Processing State (Lightweight)

- Status: `uploaded`, `attached`, `processed`, `error`
- Processing metadata (optional, future-facing)

---

## Attachment ↔ Lesson Association Rules

These rules are strict.

### Cardinality

- One athlete → many attachments
- One lesson → zero or many attachments
- One attachment → at most one lesson

### Timing

- Attachments can be:
  - Created before a lesson
  - Created during lesson logging
  - Attached after lesson creation (post-hoc)

### Mutability

- Immutable:
  - Attachment ID
  - Athlete ID
  - Raw file reference
- Mutable:
  - Lesson ID
  - Coach notes
  - Evidence category
  - Processing status

### Reassignment

- Once attached to a lesson, attachments **cannot be reassigned** to a different lesson in Phase 1
- Detachment is allowed (returns attachment to player-level)

---

## CSV Ingestion Boundaries

### What CSV Ingestion Means (Phase 1)

CSV ingestion means:

- Accepting a CSV file
- Storing it immutably
- Recording metadata
- Making it available for future processing

Nothing more.

### What Happens at Upload

- Validate file type (CSV)
- Validate file size
- Store raw file
- Create attachment record

### What Does NOT Happen

- No parsing
- No schema validation
- No metric extraction
- No normalization
- No charts
- No failure due to “bad data”

If the file is a valid CSV, ingestion succeeds.

### Error Handling

- Hard failures:
  - Invalid file type
  - File too large
  - Storage failure
- Soft failures:
  - Any future processing errors
  - Processing errors never invalidate the attachment

---

## Video Upload Boundaries

- Videos are stored as-is in object storage
- Enforced constraints:
  - File size limits
  - Accepted formats only (e.g. mp4, mov)
- No transcoding or compression in Phase 1
- Video files are treated the same as CSVs at the attachment layer

---

## Manual Assessments

- Stored directly in the database
- Represent structured data, not files
- Treated as attachments with a defined type
- Recommended (but not required) to be lesson-attached
- No advanced validation or analytics in Phase 1

---

## Repository Structure (Important for Implementation)

The codebase follows a **domain / application / ui** separation.

### Domains

```

/domains
/attachments
- attachment types
- business rules
- validation logic (non-UI)

```

### Application Layer

```

/application
/attachments
- use cases (create, attach, detach)
- orchestration logic

```

### UI Layer

```

/ui
/attachments
- upload components
- attachment lists
- lesson attachment UI

```

### Database

```

/db
/schema
- attachment schema
- lesson schema updates (if needed)
/queries
- attachment queries
- lesson-attachment queries

```

No UI logic should leak into domains.  
No storage logic should live in UI.

---

## Phase 1 Exit Criteria

Phase 1 is complete when:

- Coaches can upload CSVs and videos
- Coaches can add manual assessments
- Attachments can be linked to lessons before or after creation
- No workflow depends on vendor APIs
- No CSV ingestion attempts interpretation

---

## Guiding Principle (Non-Negotiable)

> **Phase 1 is about capturing evidence, not explaining it.**

Any feature that violates this principle does not belong in this phase.

---

## Notes for AI Implementers (Codex)

- Do not add analytics, parsing, or charts
- Prefer simple, explicit logic over abstraction
- Preserve raw data always
- Defer cleverness to later phases
- When unsure, choose the option that preserves flexibility

If something feels like a “nice enhancement,” it is probably out of scope.
