# Operator Loop — Google Read-Only Integration

## Overview

v0.2 adds read-only Google adapters for the Inbox Unit (Gmail) and Schedule Unit (Calendar).
Both units use the `googleapis` npm package with OAuth2 credentials stored server-side.

**Hard safety rules in force:**
- No email sending, replies, forwarding, deletion, archiving, or labeling.
- No calendar event creation, updates, or deletion.
- Read-only OAuth scopes only.
- No secrets exposed to the browser — all API calls happen in Next.js API routes.

---

## Required Scopes

| Unit          | Scope                                                      |
|---------------|------------------------------------------------------------|
| Inbox Unit    | `https://www.googleapis.com/auth/gmail.readonly`           |
| Schedule Unit | `https://www.googleapis.com/auth/calendar.readonly`        |

---

## Setup Guide

### Step 1 — Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a new project (or use an existing one).
3. Enable these APIs:
   - **Gmail API**
   - **Google Calendar API**

### Step 2 — Create OAuth2 Credentials

1. Go to **APIs & Services → Credentials**.
2. Click **Create Credentials → OAuth client ID**.
3. Application type: **Desktop app** (easiest for local token generation).
4. Name it (e.g. `operator-loop-local`).
5. Download the credentials JSON or note the **Client ID** and **Client Secret**.

### Step 3 — Obtain a Refresh Token (One-Time)

Run the following Node.js snippet locally to complete the OAuth2 consent flow
and obtain a refresh token. You only need to do this once per Google account.

```js
// get-refresh-token.js — run with: node get-refresh-token.js
const { google } = require("googleapis");
const readline = require("readline");

const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"; // Desktop app out-of-band

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
];

const authUrl = oauth2Client.generateAuthUrl({ access_type: "offline", scope: SCOPES });
console.log("Open this URL in a browser and paste the code below:\n", authUrl);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("\nEnter the authorization code: ", async (code) => {
  rl.close();
  const { tokens } = await oauth2Client.getToken(code);
  console.log("\nRefresh token:", tokens.refresh_token);
});
```

### Step 4 — Configure .env.local

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
```

### Step 5 — Restart the dev server

```bash
npm run dev
```

---

## How It Works

### Without Google credentials (default)

Both units return `DEMO FALLBACK` output with hardcoded sample data.
The UI shows an amber **DEMO FALLBACK** badge on Unit Output.
No Google API calls are made.

### With valid Google credentials

| Unit          | Badge shown       | Data source                       |
|---------------|-------------------|-----------------------------------|
| Inbox Unit    | REAL GMAIL (blue) | Gmail API — `users.messages.list` |
| Schedule Unit | REAL CALENDAR (teal) | Calendar API — `events.list`   |

### On API error

If a valid credential exists but the API call fails (network error, expired token,
quota exceeded, etc.), both units silently return `DEMO FALLBACK`.
The trace log records `demo_fallback` so the fallback is always visible.

---

## Architecture

```
src/integrations/
  googleAuth.ts       — shared OAuth2 client factory (reads env vars, returns null if missing)
  gmailProvider.ts    — fetchGmailInbox(): GmailResult
  calendarProvider.ts — fetchCalendarEvents(): CalendarResult

src/agents/
  gmailAgent.ts       — async; calls fetchGmailInbox(), falls back to demo
  calendarAgent.ts    — async; calls fetchCalendarEvents(), falls back to demo
```

All three integration files are server-side only (called from Next.js API routes).

---

## Files Changed

| File | Change |
|------|--------|
| `src/types/task.ts` | Added `"real_gmail" \| "real_calendar"` to `AgentResult.source` |
| `src/integrations/googleAuth.ts` | New — OAuth2 client factory |
| `src/integrations/gmailProvider.ts` | New — Gmail read-only provider |
| `src/integrations/calendarProvider.ts` | New — Calendar read-only provider |
| `src/agents/gmailAgent.ts` | Now async; calls provider, falls back to demo |
| `src/agents/calendarAgent.ts` | Now async; calls provider, falls back to demo |
| `src/app/api/route-task/route.ts` | Awaits both agents; improved modeLabel logging |
| `src/components/TaskTimeline.tsx` | Added REAL GMAIL and REAL CALENDAR badges |
| `.env.example` | Documents all three Google env vars with setup instructions |

---

## Safety Checklist

- [ ] No email sending (Gmail API write methods are never called)
- [ ] No email modification (read-only scope enforced by OAuth)
- [ ] No calendar writes (read-only scope enforced by OAuth)
- [ ] No secrets in frontend (all API calls in server-side route handlers)
- [ ] Graceful fallback if config missing
- [ ] Graceful fallback on API error
- [ ] All outputs labeled REAL GMAIL / REAL CALENDAR / DEMO FALLBACK
