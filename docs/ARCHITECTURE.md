# ALFA MVP v0.2 — Architecture

## Overview

ALFA is a controlled agent workflow panel. Every action requires user approval before execution. There are no autonomous side effects.

## Flow Diagram

```
[User Input]
     |
     v
[API: /api/route-task]
     |
     +-- [Router] --> classifies intent --> selects agent
     |
     +-- [Agent] --> produces output (DEMO in v0.2)
     |
     +-- [Red Team] --> checks output for risks
     |         |
     |    BLOCKED? --> Error state, log, return
     |
     +-- [Simulator] --> creates preview of proposed action
     |
     +-- status = waiting_for_approval
     |
[UI: ApprovalGate shows Approve / Reject]
     |
     +-- Reject --> status = rejected, log, Alfred = Idle
     |
     +-- Approve --> [API: /api/approve-task]
                        |
                        +-- [Executor] --> writes to task-log.json
                        +-- status = execute_preview_completed
                        +-- Alfred = Idle
```

## Modules

### Router (`src/core/router.ts`)
- Input: raw user string
- Output: `{ intent, agent, reason }`
- Method: regex pattern matching against known intent categories
- Intents: `research`, `calendar`, `gmail`, `coding_placeholder`, `unknown`

### Agents (`src/agents/`)
- `researchAgent.ts`: Returns demo research briefing
- `calendarAgent.ts`: Returns hardcoded demo calendar events (read-only)
- `gmailAgent.ts`: Returns hardcoded demo email summaries (read-only)
- `codingAgent.placeholder.ts`: Placeholder, returns status message only

### Red Team (`src/core/redTeam.ts`)
- Input: original user input + agent output
- Output: `{ status: 'clear' | 'warning' | 'blocked', flags[], reason }`
- Checks for: destructive actions, external integrations, private data, shell execution
- If `blocked`: task is cancelled before reaching simulator

### Simulator (`src/core/simulator.ts`)
- Input: router result + agent result
- Output: `{ action, preview, safeToExecute }`
- Generates a human-readable preview of what would happen if approved
- In v0.2 all actions are local-only (write to JSON log)

### Executor (`src/core/executor.ts`)
- Reads/writes `src/data/task-log.json`
- Only called after user approval
- No network calls, no external writes

### Logger (`src/core/logger.ts`)
- Creates `LogEntry` records with step + timestamp + detail
- All steps produce a log entry

## Data Model

All state lives in the `Task` type (see `src/types/task.ts`). Tasks are persisted to `src/data/task-log.json` after approval or rejection. No database is used in v0.2.

## Alfred States

Alfred is a UI status orb that reflects the actual application state:
- `Idle`: no active task
- `Thinking`: router + agent running (set by AgentPanel)
- `Working`: agent completed, red team running (not a separate state in v0.2 — simplified to Thinking→Waiting)
- `Waiting`: approval gate open
- `Error`: red team blocked or runtime error

Alfred state is pure React state — not a fake animation.
