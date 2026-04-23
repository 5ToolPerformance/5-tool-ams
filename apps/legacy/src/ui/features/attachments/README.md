# Attachments Viewer Feature

## Purpose

This folder contains the UI feature responsible for **viewing attachments inside the application**.

Attachments represent files uploaded to the system that provide **evidence or context** for an athlete. These include:

- Performance data (CSV, video)
- Context documents (PDFs, DOCX, images, etc.)

The goal of this feature is to allow users to **view attachments in-app via modal popups**, without navigating away from their current page (player profile, lesson, etc.).

This is a **read-only viewer layer** — no editing, parsing, or analytics happens here.

---

## Core Requirements

### High-Level Behavior

- Clicking **“View”** on any attachment opens a modal
- The modal renders the attachment inline when possible
- The background page remains unchanged
- The same viewer is reused everywhere attachments appear

### Attachment Types Supported

- CSV files (performance data)
- Video files
- Documents (PDF, images, DOCX when possible)

### Always Supported

- Download action (even if preview is unavailable)
- Metadata display (file name, type, effective date, source)
- Read-only access

---

## Conceptual Architecture

There is **one modal** that delegates rendering to type-specific viewers.

```

AttachmentViewerModal
├── CSVViewer
├── MediaViewer
└── DocumentViewer

```

The modal is file-agnostic and selects the appropriate viewer based on attachment metadata.

---

## Modal Responsibilities

The modal:

- Receives attachment metadata and a signed blob URL
- Displays a consistent header
- Chooses the correct viewer based on attachment type
- Handles loading and error states
- Enforces read-only behavior

### Modal Header (Always Present)

- File name
- Attachment type badge (CSV / Video / Document)
- Effective date (for context documents)
- Download button
- Close button

---

## Viewer Responsibilities

### CSV Viewer

**Purpose:** Allow coaches to verify uploaded performance data.

Scope:

- Render a scrollable table
- Display column headers
- Show row count
- Optionally show basic stats (min / max / avg if cheap)

Explicitly out of scope:

- Editing
- Charting
- Filtering UI
- Analytics

CSV parsing here is **for display only** and does not persist data.

---

### Media Viewer (Video)

**Purpose:** Allow playback of uploaded performance videos.

Scope:

- In-modal video playback
- Play / pause / scrub
- Fullscreen option
- Metadata visible

Out of scope:

- Drawing tools
- Annotations
- Frame-by-frame analysis

---

### Document Viewer

**Purpose:** View contextual documents attached to a player.

Rendering rules:

- PDFs → render inline if supported
- Images → render inline with zoom
- DOCX / unsupported formats → fallback to download

If preview is unavailable, show a clear message:

> “Preview not available — download to view.”

---

## Permissions & Safety

Before rendering:

- Attachment must belong to the active facility
- User must have permission to view the attachment
- Blob URLs should be signed and time-limited

Inside the viewer:

- No mutation actions
- No sharing
- No editing

This is especially important for medical or restricted context documents.

---

## Reuse & Non-Goals

### Reuse

This viewer must be reusable from:

- Player Profile → Context & Documents tab
- Lesson attachments
- Future dashboards
- Search results
- Analytics drill-downs (later)

There should **never** be multiple attachment viewers in the app.

### Non-Goals (Intentionally Out of Scope)

- Annotations
- AI summaries
- Metric parsing
- Editing files
- Versioning
- Cross-file comparisons

These may be added in future phases.

---

## Phase Alignment

This feature is part of **Phase 1 completion polish**.

Once this viewer system is complete:

- The attachment ingestion layer is considered finished
- No further refactors should be required before analytics / Databricks work
- Future features should build on top of this viewer, not replace it

---

## Design Philosophy

- Trust > Flash
- Read-only > Editable
- One viewer system > many one-offs
- Honest fallbacks > broken previews
- Support light and dark mode
- Utilize HeroUI where needed

Attachments are evidence — this feature is the lens through which coaches understand them.
