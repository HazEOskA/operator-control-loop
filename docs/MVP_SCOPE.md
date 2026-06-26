# ALFA MVP v0.2 — Scope Definition

## In Scope

### UI
- Text input form for submitting tasks
- Alfred status orb (5 states: Idle, Thinking, Working, Waiting, Error)
- Task timeline showing each step with status and detail
- Red Team result display (clear / warning / blocked)
- Simulator preview before approval
- Approve / Reject buttons (wired to real state changes)
- System log panel with live session logs + saved task log viewer
- Demo mode banner in header

### Backend (Next.js API routes)
- `POST /api/route-task`: full pipeline (router → agent → red team → simulator)
- `POST /api/approve-task`: approve or reject a waiting task
- `GET /api/task-log`: read persisted task log

### Agents
- `researchAgent`: demo research briefing (clearly labeled DEMO)
- `calendarAgent`: hardcoded demo calendar events (clearly labeled DEMO, read-only)
- `gmailAgent`: hardcoded demo email summaries (clearly labeled DEMO, read-only)
- `codingAgent`: placeholder (clearly labeled PLACEHOLDER)

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
- Streaming agent responses
- Real LLM API calls (planned for v0.3+)

## Planned (v0.3+)

- Claude API integration for real agent reasoning
- Google OAuth for real calendar/gmail read access
- Voice input via Web Speech API
- Electron desktop wrapper (ALFA Desktop)
- Persistent database (SQLite or similar)
- Multiple concurrent tasks
