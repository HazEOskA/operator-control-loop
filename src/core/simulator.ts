import type { AgentResult, RouterResult, SimulatorPreview } from "@/types/task";

export function simulate(
  routerResult: RouterResult,
  agentResult: AgentResult
): SimulatorPreview {
  const agentLabel = agentResult.isDemo ? "[DEMO]" : "";

  const previews: Record<string, SimulatorPreview> = {
    researchAgent: {
      action: "Save research briefing to task log",
      preview: `${agentLabel} Research summary will be saved locally as a completed task entry. No external calls will be made.`,
      safeToExecute: true,
    },
    calendarAgent: {
      action: "Save calendar read result to task log",
      preview: `${agentLabel} Read-only calendar demo data will be logged. No calendar events will be created or modified.`,
      safeToExecute: true,
    },
    gmailAgent: {
      action: "Save gmail read result to task log",
      preview: `${agentLabel} Read-only Gmail demo data will be logged. No emails will be sent or modified.`,
      safeToExecute: true,
    },
    codingAgent: {
      action: "Log coding placeholder result",
      preview: "[PLACEHOLDER] Coding agent is not active in v0.2. Result will be logged as a placeholder entry only.",
      safeToExecute: true,
    },
    unknown: {
      action: "Log unhandled intent",
      preview: "Unknown intent will be logged as unresolved. No action taken.",
      safeToExecute: true,
    },
  };

  return (
    previews[routerResult.agent] ?? {
      action: "Log task result",
      preview: "Result will be saved to local task log only.",
      safeToExecute: true,
    }
  );
}
