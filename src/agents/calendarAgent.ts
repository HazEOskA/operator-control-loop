import type { AgentResult } from "@/types/task";
import { fetchCalendarEvents } from "@/integrations/calendarProvider";

const DEMO_EVENTS = [
  { title: "Team Standup", date: "2026-06-26", time: "09:00", duration: "30 min", attendees: ["Alice", "Bob", "Charlie"] },
  { title: "Product Review", date: "2026-06-26", time: "14:00", duration: "60 min", attendees: ["Alice", "Diana"] },
  { title: "Operator Loop Demo", date: "2026-06-27", time: "10:00", duration: "45 min", attendees: ["Team"] },
];

const DEMO_OUTPUT = `
[DEMO — Schedule Unit — Read-Only]

⚠ This is a DEMO adapter. No real Google Calendar connection is configured.
⚠ No calendar events have been created or modified.

Upcoming Events (Demo Data):

${DEMO_EVENTS.map(
  (e) => `• [${e.date} ${e.time}] ${e.title} (${e.duration}) — Attendees: ${e.attendees.join(", ")}`
).join("\n")}

Note: Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN
in .env.local to connect to a real Google Calendar (read-only).
`.trim();

export async function runCalendarAgent(_input: string): Promise<AgentResult> {
  const result = await fetchCalendarEvents();

  if (result.source === "real_calendar" && result.output) {
    return {
      agent: "calendarAgent",
      output: result.output,
      isDemo: false,
      source: "real_calendar",
      provider: result.provider,
    };
  }

  return {
    agent: "calendarAgent",
    output: DEMO_OUTPUT,
    isDemo: true,
    source: "demo_fallback",
    provider: "mock",
  };
}
