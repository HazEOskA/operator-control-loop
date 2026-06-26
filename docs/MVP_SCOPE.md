# Operator Loop v0.2 — Scope Definition

## In Scope

### UI
- Text input form for submitting tasks (Unit Input)
- Operator Orb status indicator (5 states: Idle, Thinking, Working, Waiting, Error)
- Task Trace showing each step with status and detail
- Risk Gate result display (clear / warning / blocked)
- Dry Run preview before approval
- Approve / Reject buttons at Operator Gate (wired to real state changes)
- Trace Log panel with live session trace + saved task log viewer
- Demo mode banner in header

### Backend (Next.js API routes)
- `POST /api/route-task`: full pipeline (Switchboard → Unit → Risk Gate → Dry Run)
- `POST /api/approve-task`: approve or reject a waiting task at Operator Gate
- `GET /api/task-log`: read persisted trace log

### Units
- `researchAgent` (Scout Unit): demo research briefing (clearly labeled DEMO)
- `calendarAgent` (Schedule Unit): hardcoded demo calendar events (clearly labeled DEMO, read-only)
- `gmailAgent` (Inbox Unit): hardcoded demo email summaries (clearly labeled DEMO, read-only)
- `codingAgent` (Forge Unit): placeholder (clearly labeled PLACEHOLDER)

### Storage
- Local JSON file: `src/data/task-log.json`
- No database, no cloud storage

## Out of Scope (v0.2)

- Real Google OAuth / Calendar API
- Real Gmail API (sending or reading live data)
- Shell execution
- File deletion
- Deploy execution
- Payment or crypto actions
- Voice input (documented as planned)
- Electron / Tauri desktop wrapper
- Database
- Multi-user sessions
- Streaming unit responses
- Real LLM API calls (planned for v0.3+)

## Planned (v0.3+)

- Claude API integration for real unit reasoning
- Google OAuth for real calendar/gmail read access
- Voice input via Web Speech API
- Electron desktop wrapper (Operator Desktop)
- Persistent database (SQLite or similar)
- Multiple concurrent tasks
