# Evidence Attachment Tasks

## Task List
- [ ] Define lesson-form evidence upload UX (collapsed section in Player Notes) and data flow for create vs edit
- [x] Add lesson participant attachment metadata to read model and form state (lessonPlayerId mapping)
- [x] Update lesson create flow to return lessonPlayerId mapping for post-submit uploads
- [x] Make lesson update flow attachment-safe (avoid deleting lessonPlayers / attachments)
- [x] Implement collapsed upload section in `StepPlayerNotes` (type, file, notes, source)
- [x] Implement pending upload queue with submit-time uploads for create/edit
- [x] Add attachment upload integration to lesson submit and error handling
- [ ] Add/adjust tests or verification steps for create/edit attachment uploads
