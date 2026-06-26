# Operator Loop — Static Assets

## Alfred State Images

Place PNG files at the following paths to activate the Alfred portrait layer in the UI.
The `AlfredStatus` component loads these at runtime; if a file is missing the component
falls back to the existing orb/status indicator without crashing.

| State    | Required file path                    |
|----------|---------------------------------------|
| Idle     | `public/alfred/alfred-idle.png`       |
| Thinking | `public/alfred/alfred-thinking.png`   |
| Working  | `public/alfred/alfred-working.png`    |
| Waiting  | `public/alfred/alfred-waiting.png`    |
| Error    | `public/alfred/alfred-error.png`      |

### Recommended image spec

- Format: PNG with transparency (or solid background)
- Dimensions: 128 × 128 px minimum; 256 × 256 px recommended
- Aspect ratio: square
- These images are displayed at `w-24 h-24` (96 px) inside the Alfred status card

### How the state maps to app behavior

| State    | When shown                                            |
|----------|-------------------------------------------------------|
| Idle     | No active task — ready for input                      |
| Thinking | Switchboard + Research Unit running                   |
| Working  | Unit completed, Risk Gate check in progress           |
| Waiting  | Operator Gate open, awaiting Approve / Reject         |
| Error    | Risk Gate blocked the task, or a runtime error        |

### Adding images

Drop the PNG files into `public/alfred/` and restart the dev server.
No code changes are required — the component reads from this directory automatically.
