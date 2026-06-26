import { google } from "googleapis";
import { getOAuth2Client } from "./googleAuth";

export interface GmailResult {
  output: string;
  source: "real_gmail" | "demo_fallback";
  provider: "google_gmail" | "mock";
}

const MAX_MESSAGES = 5;

export async function fetchGmailInbox(): Promise<GmailResult> {
  const auth = getOAuth2Client();
  if (!auth) {
    return { output: "", source: "demo_fallback", provider: "mock" };
  }

  try {
    const gmail = google.gmail({ version: "v1", auth });

    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: "in:inbox",
      maxResults: MAX_MESSAGES,
    });

    const messages = listRes.data.messages ?? [];
    if (messages.length === 0) {
      return {
        output: "[REAL — Inbox Unit — Gmail Read-Only]\n\nNo messages found in inbox.",
        source: "real_gmail",
        provider: "google_gmail",
      };
    }

    const summaries = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });
        const headers = detail.data.payload?.headers ?? [];
        const from = headers.find((h) => h.name === "From")?.value ?? "Unknown";
        const subject = headers.find((h) => h.name === "Subject")?.value ?? "(no subject)";
        const date = headers.find((h) => h.name === "Date")?.value ?? "";
        const snippet = detail.data.snippet ?? "";
        return `• [${date}]\n  From: ${from}\n  Subject: ${subject}\n  Preview: ${snippet}`;
      })
    );

    const output = `
[REAL — Inbox Unit — Gmail Read-Only]

⚠ Read-only access. No emails sent, modified, or deleted.

Inbox Summary (${summaries.length} most recent):

${summaries.join("\n\n")}
`.trim();

    return { output, source: "real_gmail", provider: "google_gmail" };
  } catch {
    return { output: "", source: "demo_fallback", provider: "mock" };
  }
}
