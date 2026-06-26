# ALFA MVP v0.2 — Safety Rules

These rules are enforced in v0.2 and must not be removed without explicit version upgrade decisions.

## Hard Rules (Never in v0.2)

| Rule | Detail |
|------|--------|
| No email sending | gmailAgent is read-only demo only |
| No calendar writing | calendarAgent is read-only demo only |
| No file deletion | No rm, unlink, or destructive fs operations |
| No shell execution | No exec, spawn, or child_process calls |
| No deploy execution | No CI triggers, no Vercel deploys from agent |
| No payment or crypto | No financial transactions of any kind |
| No destructive database ops | No DROP, TRUNCATE, or DELETE in v0.2 (no DB exists) |

## Required Behaviors

| Behavior | Detail |
|----------|--------|
| Every task is logged | All steps written to task-log.json |
| Approval required | No execute step without user clicking Approve |
| Red team check | Every agent result is checked before approval gate |
| Rejection logged | Rejected tasks are written to log with rejected status |
| Error logged | Failed runs set status to error and write to log |
| Demo labels visible | All mock/demo data clearly labeled in UI and output |
| No silent failures | Failed agent runs return Error state, not empty output |

## Red Team Block Conditions

The following patterns cause a task to be blocked before reaching the approval gate:

- `destructive_action`: delete, remove, destroy, wipe, drop, rm -rf, format, overwrite
- `shell_execution`: exec, execute, run command, shell, bash, powershell, backtick patterns

## Red Team Warning Conditions

The following patterns set status to warning (approval gate still shown, warning displayed):

- `external_integration`: send email, compose email, reply to, create event, write to calendar, post, publish, deploy, push to production
- `private_data`: password, secret, token, api key, credential, private key, SSN, credit card, bank account, PII

## Rollback Plan

If any safety rule is accidentally broken:

1. Revert the commit that introduced the violation (`git revert <sha>`)
2. Audit task-log.json for any unintended side effects
3. Document the violation in a post-mortem before re-implementing

## Version Upgrade Gate

To unlock any item from "Hard Rules" above in a future version:

1. Explicit version bump (e.g. v0.3)
2. Separate OAuth / permission setup documented
3. User-facing clear labeling that the feature is now real (not demo)
4. Separate safety review for the new capability
