# Operator Loop v0.2 — Validation Checklist

Run this checklist manually after each deployment or major change.

## Build Validation

- [ ] `npm install` completes without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run type-check` passes with zero TypeScript errors

## Functional PASS Conditions

### Input
- [ ] User can type a task in the Unit Input field
- [ ] User can click an example chip to fill the input
- [ ] Ctrl+Enter submits the task
- [ ] Empty input does not submit

### Switchboard (Routing)
- [ ] Switchboard selects a unit (shown in Task Trace)
- [ ] Intent is classified and shown
- [ ] Routing reason is shown

### Operator Orb Status
- [ ] Operator Orb shows Idle on page load
- [ ] Operator Orb shows Thinking when task is submitted
- [ ] Operator Orb shows Waiting when task reaches Operator Gate
- [ ] Operator Orb shows Idle after Approve
- [ ] Operator Orb shows Idle after Reject
- [ ] Operator Orb shows Error on blocked or failed task
- [ ] Clicking Operator Orb scrolls to task panel

### Task Trace
- [ ] Trace appears after task submission
- [ ] Each step appears in order with timestamp
- [ ] Switchboard result block is shown (unit name, intent, reason)
- [ ] Risk Gate result block is shown (status color, flags if any)
- [ ] Dry Run preview block is shown
- [ ] Unit output is shown (with DEMO badge if applicable)

### Risk Gate
- [ ] Clear tasks proceed to Operator Gate
- [ ] Warning tasks show warning banner in Operator Gate
- [ ] Blocked tasks show Error state and do not reach Operator Gate

### Operator Gate
- [ ] Approve and Reject buttons are disabled until task reaches waiting_for_approval
- [ ] Approve button completes task and shows execute_preview_completed status
- [ ] Reject button cancels task and shows rejected status
- [ ] Execution Preview cannot happen before Approve is clicked
- [ ] Completed task shows completedAt timestamp

### Trace Log
- [ ] Session trace entries appear in Trace Log in real time
- [ ] "Show Trace Log" button loads persisted tasks from task-log.json
- [ ] Saved tasks show task ID, input, unit, status, timestamp
- [ ] Rejected tasks appear in trace with rejected status
- [ ] Completed tasks appear in trace with execute_preview_completed status

### Demo Labels
- [ ] Unit output shows [DEMO] badge for demo units
- [ ] Schedule Unit output contains "[DEMO — Schedule Unit — Read-Only]"
- [ ] Inbox Unit output contains "[DEMO — Inbox Unit — Read-Only]"
- [ ] Forge Unit output contains "[PLACEHOLDER — Forge Unit]"
- [ ] Header shows "DEMO MODE" badge

### Dead Button Check
- [ ] No visible button is non-functional
- [ ] All example chips fill the input field
- [ ] Show Trace Log button loads data or shows "No saved tasks yet"

## Safety Validation

- [ ] No real email is sent during any test
- [ ] No real calendar event is created during any test
- [ ] No shell commands are executed
- [ ] task-log.json only contains expected task entries
- [ ] Blocked tasks write to trace log with error status, not silently dropped

## Known Demo Limitations (Expected, Not Failures)

- Schedule Unit and Inbox Unit data are hardcoded demo values — this is by design
- Forge Unit returns placeholder output — this is by design
- No real LLM API is called — this is by design for v0.2
- Voice input is not implemented — documented as planned
