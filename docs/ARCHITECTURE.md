# Operator Loop v0.2 — Architecture

## Overview

Operator Loop is a controlled operator workflow panel. Every action requires user approval before execution. There are no autonomous side effects.

## Flow Diagram

```
[User Input]
     |
     v
[API: /api/route-task]
     |
     +-- [Switchboard] --> classifies intent --> selects unit
     |
     +-- [Unit] --> produces output (DEMO in v0.2)
     |
     +-- [Risk Gate] --> checks output for risks
     |         |
     |    BLOCKED? --> Error state, trace log, return
     |
     +-- [Dry Run] --> creates preview of proposed action
     |
     +-- status = waiting_for_approval
     |
[UI: Operator Gate shows Approve / Reject]
     |
     +-- Reject --> status = rejected, trace log, Operator Orb = Idle
     |
     +-- Approve --> [API: /api/approve-task]
                        |
                        +-- [Execution Preview] --> writes to task-log.json
                        +-- status = execute_preview_completed
                        +-- Operator Orb = Idle
```

## Modules

### Switchboard (`src/core/router.ts`)
- Input: raw user string
- Output: `{ intent, agent, reason }`
- Method: regex pattern matching against known intent categories
- Intents: `research`, `calendar`, `gmail`, `coding_placeholder`, `unknown`

### Units (`src/agents/`)
- `researchAgent.ts` (Scout Unit): Returns demo research briefing
- `calendarAgent.ts` (Schedule Unit): Returns hardcoded demo calendar events (read-only)
- `gmailAgent.ts` (Inbox Unit): Returns hardcoded demo email summaries (read-only)
- `codingAgent.placeholder.ts` (Forge Unit): Placeholder, returns status message only

### Risk Gate (`src/core/redTeam.ts`)
- Input: original user input + unit output
- Output: `{ status: 'clear' | 'warning' | 'blocked', flags[], reason }`
- Checks for: destructive actions, external integrations, private data, shell execution
- If `blocked`: task is cancelled before reaching Dry Run

### Dry Run (`src/core/simulator.ts`)
- Input: switchboard result + unit result
- Output: `{ action, preview, safeToExecute }`
- Generates a human-readable preview of what would happen if approved
- In v0.2 all actions are local-only (write to JSON trace log)

### Execution Preview (`src/core/executor.ts`)
- Reads/writes `src/data/task-log.json`
- Only called after user approval at Operator Gate
- No network calls, no external writes

### Trace Log (`src/core/logger.ts`)
- Creates `LogEntry` records with step + timestamp + detail
- All steps produce a log entry

## Data Model

All state lives in the `Task` type (see `src/types/task.ts`). Tasks are persisted to `src/data/task-log.json` after approval or rejection. No database is used in v0.2.

## Operator Orb States

The Operator Orb is a UI status indicator that reflects actual application state:
- `Idle`: no active task
- `Thinking`: Switchboard + unit running (set by AgentPanel)
- `Working`: unit completed, Risk Gate running (simplified to Thinking→Waiting in v0.2)
- `Waiting`: Operator Gate open, awaiting decision
- `Error`: Risk Gate blocked or runtime error

Operator Orb state is pure React state — not a fake animation.
