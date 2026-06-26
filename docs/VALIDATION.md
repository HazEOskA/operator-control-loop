# ALFA MVP v0.2 — Validation Checklist

Run this checklist manually after each deployment or major change.

## Build Validation

- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run type-check` passes with zero TypeScript errors

## Functional PASS Conditions

### Input
- [ ] User can type a task in the input field
- [ ] User can click an example chip to fill the input
- [ ] Ctrl+Enter submits the task
- [ ] Empty input does not submit

### Routing
- [ ] Router selects an agent (shown in Task Timeline)
- [ ] Intent is classified and shown
- [ ] Routing reason is shown

### Alfred Status
- [ ] Alfred shows Idle on page load
- [ ] Alfred shows Thinking when task is submitted
- [ ] Alfred shows Waiting when task reaches approval gate
- [ ] Alfred shows Idle after Approve
- [ ] Alfred shows Idle after Reject
- [ ] Alfred shows Error on blocked or failed task
- [ ] Clicking Alfred orb scrolls to task panel

### Task Timeline
- [ ] Timeline appears after task submission
- [ ] Each step appears in order with timestamp
- [ ] Router result block is shown (agent name, intent, reason)
- [ ] Red Team result block is shown (status color, flags if any)
- [ ] Simulator preview block is shown
- [ ] Agent output is shown (with DEMO badge if applicable)

### Red Team
- [ ] Clear tasks proceed to approval gate
- [ ] Warning tasks show warning banner in ApprovalGate
- [ ] Blocked tasks show Error state and do not reach approval gate

### Approval Gate
- [ ] Approve and Reject buttons are disabled until task reaches waiting_for_approval
- [ ] Approve button completes task and shows execute_preview_completed status
- [ ] Reject button cancels task and shows rejected status
- [ ] Execute Preview cannot happen before Approve is clicked
- [ ] Completed task shows completedAt timestamp

### Logs
- [ ] Session logs appear in SystemLogPanel in real time
- [ ] "Show Saved Logs" button loads persisted tasks from task-log.json
- [ ] Saved tasks show task ID, input, agent, status, timestamp
- [ ] Rejected tasks appear in log with rejected status
- [ ] Completed tasks appear in log with execute_preview_completed status

### Demo Labels
- [ ] Agent output shows [DEMO] badge for demo agents
- [ ] calendarAgent output contains "[DEMO — Calendar Agent — Read-Only]"
- [ ] gmailAgent output contains "[DEMO — Gmail Agent — Read-Only]"
- [ ] codingAgent output contains "[PLACEHOLDER — Coding Agent]"
- [ ] Header shows "DEMO MODE" badge

### Dead Button Check
- [ ] No visible button is non-functional
- [ ] All example chips fill the input field
- [ ] Show Saved Logs button loads data or shows "No saved tasks yet"

## Safety Validation

- [ ] No real email is sent during any test
- [ ] No real calendar event is created during any test
- [ ] No shell commands are executed
- [ ] task-log.json only contains expected task entries
- [ ] Blocked tasks write to log with error status, not silently dropped

## Known Demo Limitations (Expected, Not Failures)

- Calendar and Gmail data are hardcoded demo values — this is by design
- Coding agent returns placeholder output — this is by design
- No real LLM API is called — this is by design for v0.2
- Voice input is not implemented — documented as planned
