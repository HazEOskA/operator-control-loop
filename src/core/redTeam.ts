import type { AgentResult, RedTeamResult, RedTeamStatus } from "@/types/task";

interface RiskPattern {
  flag: string;
  patterns: RegExp[];
  severity: "warning" | "blocked";
}

const RISK_PATTERNS: RiskPattern[] = [
  {
    flag: "destructive_action",
    patterns: [
      /\b(delete|remove|destroy|wipe|drop|truncate|kill|terminate)\b/i,
      /\b(rm -rf|format|overwrite)\b/i,
    ],
    severity: "blocked",
  },
  {
    flag: "external_integration",
    patterns: [
      /\b(send email|compose email|reply to|create event|write to calendar)\b/i,
      /\b(post|publish|deploy|push to production)\b/i,
    ],
    severity: "warning",
  },
  {
    flag: "private_data",
    patterns: [
      /\b(password|secret|token|api key|credential|private key|ssn|social security)\b/i,
      /\b(credit card|bank account|personal data|pii)\b/i,
    ],
    severity: "warning",
  },
  {
    flag: "shell_execution",
    patterns: [
      /\b(exec|execute|run command|shell|bash|powershell|cmd)\b/i,
      /`[^`]+`|\$\([^)]+\)/,
    ],
    severity: "blocked",
  },
];

export function runRedTeam(
  input: string,
  agentResult: AgentResult
): RedTeamResult {
  const combined = `${input} ${agentResult.output}`.toLowerCase();
  const triggeredFlags: string[] = [];
  let highestSeverity: RedTeamStatus = "clear";

  for (const { flag, patterns, severity } of RISK_PATTERNS) {
    if (patterns.some((p) => p.test(combined))) {
      triggeredFlags.push(flag);
      if (severity === "blocked") {
        highestSeverity = "blocked";
      } else if (highestSeverity === "clear") {
        highestSeverity = "warning";
      }
    }
  }

  if (highestSeverity === "clear") {
    return {
      status: "clear",
      flags: [],
      reason: "No risks detected. Output is safe to preview.",
    };
  }

  const reasons: Record<string, string> = {
    destructive_action: "Potential destructive action detected.",
    external_integration: "External integration action flagged (v0.2 is read-only).",
    private_data: "Possible private or sensitive data in output.",
    shell_execution: "Shell execution pattern detected — blocked in v0.2.",
  };

  const flagReasons = triggeredFlags.map((f) => reasons[f] ?? f).join(" ");

  return {
    status: highestSeverity,
    flags: triggeredFlags,
    reason: flagReasons,
  };
}
