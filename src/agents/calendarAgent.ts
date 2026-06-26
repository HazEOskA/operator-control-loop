import type { AgentResult } from "@/types/task";

const DEMO_EVENTS = [
  {
    id: "demo-evt-001",
    title: "Team Standup",
    date: "2026-06-26",
    time: "09:00",
    duration: "30 min",
    attendees: ["Alice", "Bob", "Charlie"],
  },
  {
    id: "demo-evt-002",
    title: "Product Review",
    date: "2026-06-26",
    time: "14:00",
    duration: "60 min",
    attendees: ["Alice", "Diana"],
  },
  {
    id: "demo-evt-003",
    title: "ALFA Agent Demo",
    date: "2026-06-27",
    time: "10:00",
    duration: "45 min",
    attendees: ["Team"],
  },
];

export function runCalendarAgent(_input: string): AgentResult {
  const eventList = DEMO_EVENTS.map(
    (e) =>
      `• [${e.date} ${e.time}] ${e.title} (${e.duration}) — Attendees: ${e.attendees.join(", ")}`
  ).join("\n");

  const output = `
[DEMO — Calendar Agent — Read-Only]

⚠ This is a DEMO adapter. No real Google Calendar connection exists in v0.2.
⚠ No calendar events have been created or modified.

Upcoming Events (Demo Data):
${eventList}

Note: In a production deployment with Google OAuth configured, this agent
would read your actual calendar. All write operations are disabled in v0.2.
`.trim();

  return {
    agent: "calendarAgent",
    output,
    isDemo: true,
  };
}
