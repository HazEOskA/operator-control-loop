# Operator Loop v0.2 — Operator Control Loop

A small, stable local operator control panel MVP built with Next.js, TypeScript, React, and Tailwind CSS.

## Purpose

Prove one controlled operator workflow:

```
Input → Switchboard → Unit → Risk Gate → Dry Run → Operator Gate → Execution Preview → Trace Log → Status
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
      route-task/route.ts     # POST: receives input, routes via Switchboard, runs Unit, Risk Gate, Dry Run
      approve-task/route.ts   # POST: approve or reject a task at the Operator Gate
      task-log/route.ts       # GET: read saved trace log
  components/
    AlfredStatus.tsx          # Operator Orb status component
    AgentPanel.tsx            # Task input form (Unit Input)
    TaskTimeline.tsx          # Task Trace — step-by-step progress
    ApprovalGate.tsx          # Operator Gate — Approve / Reject UI
    SystemLogPanel.tsx        # Trace Log viewer
  agents/
    researchAgent.ts          # Scout Unit — demo research briefing
    calendarAgent.ts          # Schedule Unit — demo read-only calendar
    gmailAgent.ts             # Inbox Unit — demo read-only Gmail
    codingAgent.placeholder.ts # Forge Unit — placeholder, not active in v0.2
  core/
    router.ts                 # Switchboard — intent classifier -> unit selector
    redTeam.ts                # Risk Gate — checks output (clear / warning / blocked)
    simulator.ts              # Dry Run — preview generator
    executor.ts               # Execution Preview — local JSON log writer
    logger.ts                 # Trace Log entry factory
  types/
    task.ts                   # All TypeScript types
  data/
    task-log.json             # Local trace log (no database)
docs/
  ARCHITECTURE.md
  MVP_SCOPE.md
  SAFETY_RULES.md
  VALIDATION.md
```

## Operator Orb States

| State    | Color  | Meaning                              |
|----------|--------|--------------------------------------|
| Idle     | Indigo | Ready, no active task                |
| Thinking | Amber  | Switchboard + Unit processing        |
| Working  | Green  | Unit running                         |
| Waiting  | Blue   | Awaiting Operator Gate decision      |
| Error    | Red    | Task failed, Risk Gate blocked, error |

## Demo Disclaimer

All unit outputs in v0.2 are clearly labeled `[DEMO]`. No real data is fetched. No external services are called. See `docs/SAFETY_RULES.md`.

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [MVP Scope](docs/MVP_SCOPE.md)
- [Safety Rules](docs/SAFETY_RULES.md)
- [Validation Checklist](docs/VALIDATION.md)
