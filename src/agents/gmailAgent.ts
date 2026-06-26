import type { AgentResult } from "@/types/task";
import { fetchGmailInbox } from "@/integrations/gmailProvider";

const DEMO_EMAILS = [
  {
    from: "alice@example.com",
    subject: "Operator Loop Project Update",
    preview: "Hey, just wanted to check in on the Operator Loop v0.2 progress...",
    date: "2026-06-25",
  },
  {
    from: "bob@example.com",
    subject: "Team Meeting Notes",
    preview: "Hi everyone, here are the notes from yesterday's meeting...",
    date: "2026-06-24",
  },
  {
    from: "noreply@github.com",
    subject: "New PR: feat/operator-control-loop",
    preview: "A pull request was opened in HazEOskA/operator-control-loop...",
    date: "2026-06-23",
  },
];

const DEMO_OUTPUT = `
[DEMO — Inbox Unit — Read-Only]

⚠ This is a DEMO adapter. No real Gmail connection is configured.
⚠ No emails have been sent, modified, or deleted.

Inbox Summary (Demo Data — ${DEMO_EMAILS.length} of N messages):

${DEMO_EMAILS.map(
  (e) => `• [${e.date}] From: ${e.from}\n  Subject: ${e.subject}\n  Preview: ${e.preview}`
).join("\n\n")}

Note: Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN
in .env.local to connect to a real Gmail inbox (read-only).
`.trim();

export async function runGmailAgent(_input: string): Promise<AgentResult> {
  const result = await fetchGmailInbox();

  if (result.source === "real_gmail" && result.output) {
    return {
      agent: "gmailAgent",
      output: result.output,
      isDemo: false,
      source: "real_gmail",
      provider: result.provider,
    };
  }

  return {
    agent: "gmailAgent",
    output: DEMO_OUTPUT,
    isDemo: true,
    source: "demo_fallback",
    provider: "mock",
  };
}
