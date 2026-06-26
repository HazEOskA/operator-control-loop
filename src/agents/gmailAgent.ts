import type { AgentResult } from "@/types/task";

const DEMO_EMAILS = [
  {
    id: "demo-email-001",
    from: "alice@example.com",
    subject: "ALFA Project Update",
    preview: "Hey, just wanted to check in on the ALFA MVP progress...",
    date: "2026-06-25",
    unread: true,
  },
  {
    id: "demo-email-002",
    from: "bob@example.com",
    subject: "Team Meeting Notes",
    preview: "Hi everyone, here are the notes from yesterday's meeting...",
    date: "2026-06-24",
    unread: false,
  },
  {
    id: "demo-email-003",
    from: "noreply@github.com",
    subject: "New PR: feat/alfa-mvp-control-loop",
    preview: "A pull request was opened in hazeoska/alfa-agent-control-loop...",
    date: "2026-06-23",
    unread: false,
  },
];

export function runGmailAgent(_input: string): AgentResult {
  const emailList = DEMO_EMAILS.map(
    (e) =>
      `• [${e.date}] ${e.unread ? "🔵 " : ""}From: ${e.from}\n  Subject: ${e.subject}\n  Preview: ${e.preview}`
  ).join("\n\n");

  const output = `
[DEMO — Gmail Agent — Read-Only]

⚠ This is a DEMO adapter. No real Gmail connection exists in v0.2.
⚠ No emails have been sent, modified, or deleted.

Inbox Summary (Demo Data — 3 of N messages):
${emailList}

Note: In a production deployment with Google OAuth configured, this agent
would read your actual Gmail inbox. All send/write operations are disabled in v0.2.
`.trim();

  return {
    agent: "gmailAgent",
    output,
    isDemo: true,
  };
}
