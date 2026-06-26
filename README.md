# ALFA MVP v0.2 — Agent Control Loop

A small, stable local agent control panel MVP built with Next.js, TypeScript, React, and Tailwind CSS.

## Purpose

Prove one controlled agent workflow:

```
Input → Router → Agent → Red Team → Simulator → User Approval → Execute Preview → Logs → Status
```

## What This Is NOT

- Not a full autonomous agent platform
- Not connected to real Gmail or Google Calendar in v0.2
- Does not send emails, write calendar events, execute shell commands, or perform destructive actions
- Does not require any external API keys for the first commit

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    page.tsx                  # Main UI
    layout.tsx
    api/
      route-task/route.ts     # POST: receives input, routes, runs agent, red team, simulator
      approve-task/route.ts   # POST: approve or reject a task
      task-log/route.ts       # GET: read saved task log
  components/
    AlfredStatus.tsx          # Alfred desktop companion orb
    AgentPanel.tsx            # Task input form
    TaskTimeline.tsx          # Step-by-step task progress
    ApprovalGate.tsx          # Approve / Reject UI
    SystemLogPanel.tsx        # Live + saved log viewer
  agents/
    researchAgent.ts          # Demo research briefing agent
    calendarAgent.ts          # Demo read-only calendar agent
    gmailAgent.ts             # Demo read-only Gmail agent
    codingAgent.placeholder.ts # Placeholder - not active in v0.2
  core/
    router.ts                 # Intent classifier -> agent selector
    redTeam.ts                # Risk checker (clear / warning / blocked)
    simulator.ts              # Preview generator
    executor.ts               # Local JSON log writer
    logger.ts                 # Log entry factory
  types/
    task.ts                   # All TypeScript types
  data/
    task-log.json             # Local task log (no database)
docs/
  ARCHITECTURE.md
  MVP_SCOPE.md
  SAFETY_RULES.md
  VALIDATION.md
```

## Alfred States

| State    | Color  | Meaning                         |
|----------|--------|---------------------------------|
| Idle     | Indigo | Ready, no active task           |
| Thinking | Amber  | Processing input / routing      |
| Working  | Green  | Agent running                   |
| Waiting  | Blue   | Awaiting user approval          |
| Error    | Red    | Task failed or was blocked      |

## Demo Disclaimer

All agent outputs in v0.2 are clearly labeled `[DEMO]`. No real data is fetched. No external services are called. See `docs/SAFETY_RULES.md`.

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [MVP Scope](docs/MVP_SCOPE.md)
- [Safety Rules](docs/SAFETY_RULES.md)
- [Validation Checklist](docs/VALIDATION.md)
