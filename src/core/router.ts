import type { AgentType, IntentType, RouterResult } from "@/types/task";

const INTENT_PATTERNS: Array<{
  intent: IntentType;
  agent: AgentType;
  patterns: RegExp[];
  reason: string;
}> = [
  {
    intent: "research",
    agent: "researchAgent",
    patterns: [
      /\b(research|find|look up|search|summarize|explain|what is|who is|tell me about)\b/i,
      /\b(overview|summary|information|data|facts|details|report)\b/i,
    ],
    reason: "Input contains research/information keywords.",
  },
  {
    intent: "calendar",
    agent: "calendarAgent",
    patterns: [
      /\b(calendar|schedule|meeting|appointment|event|reminder|book|plan)\b/i,
      /\b(today|tomorrow|next week|monday|tuesday|wednesday|thursday|friday)\b/i,
    ],
    reason: "Input contains calendar/scheduling keywords.",
  },
  {
    intent: "gmail",
    agent: "gmailAgent",
    patterns: [
      /\b(email|gmail|mail|inbox|message|send|reply|compose|thread)\b/i,
      /\b(unread|draft|sent|received|attachment)\b/i,
    ],
    reason: "Input contains email/gmail keywords.",
  },
  {
    intent: "coding_placeholder",
    agent: "codingAgent",
    patterns: [
      /\b(code|coding|program|function|debug|fix|write|script|deploy|build)\b/i,
      /\b(typescript|javascript|python|react|next\.?js|api|component)\b/i,
    ],
    reason: "Input contains coding/programming keywords.",
  },
];

export function routeTask(input: string): RouterResult {
  for (const { intent, agent, patterns, reason } of INTENT_PATTERNS) {
    if (patterns.some((p) => p.test(input))) {
      return { intent, agent, reason };
    }
  }

  return {
    intent: "unknown",
    agent: "unknown",
    reason: "No matching intent pattern found. Defaulting to unknown.",
  };
}
