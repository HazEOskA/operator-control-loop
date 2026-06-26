# Operator Loop v0.2.1 — API Integration

## Overview

v0.2.1 adds a real Anthropic API smoke test to the Research Unit (Scout Unit). All other units remain in demo mode. No behavior changes to the pipeline, Risk Gate, Operator Gate, or trace log.

## Configuration

Copy `.env.example` to `.env.local` and set your API key:

```bash
cp .env.example .env.local
# Edit .env.local and replace "your-api-key-here" with your key
```

The `ANTHROPIC_API_KEY` variable is read server-side only inside `src/integrations/llmProvider.ts`. It is never exposed to the browser.

## How It Works

### With a valid API key

1. Research Unit calls `callLlm()` in `src/integrations/llmProvider.ts`
2. `callLlm()` initializes the Anthropic SDK with `process.env.ANTHROPIC_API_KEY`
3. Sends a structured prompt to `claude-opus-4-8` with adaptive thinking
4. Returns real output with `source: "real_api"` and `provider: "anthropic/claude-opus-4-8"`
5. Task Trace shows a **REAL API** (green) badge on the Unit Output block
6. Trace Log records `real_api (anthropic/claude-opus-4-8)` in the agent_completed step

### Without an API key (or on error)

1. `callLlm()` detects missing key or catches any API error
2. Returns `source: "demo_fallback"` with empty output
3. Research Unit returns its static demo briefing
4. Task Trace shows a **DEMO FALLBACK** (amber) badge
5. Trace Log records `demo_fallback` in the agent_completed step

## Files Changed

| File | Change |
|------|--------|
| `src/types/task.ts` | Added optional `source` and `provider` fields to `AgentResult` |
| `src/integrations/llmProvider.ts` | New — Anthropic SDK wrapper (server-side only) |
| `src/agents/researchAgent.ts` | Now async; calls `callLlm()`, falls back to demo on missing key or error |
| `src/components/TaskTimeline.tsx` | Shows REAL API / DEMO FALLBACK badge based on `agentResult.source` |
| `src/app/api/route-task/route.ts` | Awaits async `runResearchAgent`; logs API mode in trace |

## Safety Properties Preserved

- No email sending, no calendar writes, no shell execution
- API key never leaves the server
- Any API error (network, auth, rate limit) silently falls back to demo — the pipeline never crashes
- All safety rules from `docs/SAFETY_RULES.md` remain in force

## Planned (v0.3+)

- Claude API integration for Calendar and Inbox units (requires OAuth)
- Streaming unit responses
- Real Google Calendar / Gmail read access
