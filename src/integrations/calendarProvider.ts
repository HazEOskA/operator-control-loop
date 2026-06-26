import { google } from "googleapis";
import { getOAuth2Client } from "./googleAuth";

export interface CalendarResult {
  output: string;
  source: "real_calendar" | "demo_fallback";
  provider: "google_calendar" | "mock";
}

const LOOKAHEAD_DAYS = 7;
const MAX_EVENTS = 10;

export async function fetchCalendarEvents(): Promise<CalendarResult> {
  const auth = getOAuth2Client();
  if (!auth) {
    return { output: "", source: "demo_fallback", provider: "mock" };
  }

  try {
    const calendar = google.calendar({ version: "v3", auth });

    const now = new Date();
    const timeMax = new Date(now.getTime() + LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000);

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: MAX_EVENTS,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items ?? [];
    if (events.length === 0) {
      return {
        output: `[REAL — Schedule Unit — Calendar Read-Only]\n\nNo events found in the next ${LOOKAHEAD_DAYS} days.`,
        source: "real_calendar",
        provider: "google_calendar",
      };
    }

    const eventLines = events.map((evt) => {
      const start = evt.start?.dateTime ?? evt.start?.date ?? "Unknown time";
      const title = evt.summary ?? "(no title)";
      const attendees = (evt.attendees ?? [])
        .map((a) => a.displayName ?? a.email ?? "")
        .filter(Boolean)
        .join(", ");
      return `• [${start}] ${title}${attendees ? `\n  Attendees: ${attendees}` : ""}`;
    });

    const output = `
[REAL — Schedule Unit — Calendar Read-Only]

⚠ Read-only access. No events created, modified, or deleted.

Upcoming Events (next ${LOOKAHEAD_DAYS} days):

${eventLines.join("\n\n")}
`.trim();

    return { output, source: "real_calendar", provider: "google_calendar" };
  } catch {
    return { output: "", source: "demo_fallback", provider: "mock" };
  }
}
