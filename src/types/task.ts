export type AgentType =
  | "researchAgent"
  | "calendarAgent"
  | "gmailAgent"
  | "codingAgent"
  | "unknown";

export type IntentType =
  | "research"
  | "calendar"
  | "gmail"
  | "coding_placeholder"
  | "unknown";

export type AlfredState =
  | "Idle"
  | "Thinking"
  | "Working"
  | "Waiting"
  | "Error";

export type RedTeamStatus = "clear" | "warning" | "blocked";

export type TaskStatus =
  | "input_received"
  | "routed"
  | "agent_started"
  | "agent_completed"
  | "red_team_checked"
  | "simulated"
  | "waiting_for_approval"
  | "approved"
  | "rejected"
  | "execute_preview_completed"
  | "error";

export interface LogEntry {
  step: TaskStatus;
  timestamp: string;
  detail?: string;
}

export interface RouterResult {
  intent: IntentType;
  agent: AgentType;
  reason: string;
}

export interface AgentResult {
  agent: AgentType;
  output: string;
  isDemo: boolean;
  source?: "real_api" | "demo_fallback";
  provider?: string;
}

export interface RedTeamResult {
  status: RedTeamStatus;
  flags: string[];
  reason: string;
}

export interface SimulatorPreview {
  action: string;
  preview: string;
  safeToExecute: boolean;
}

export interface Task {
  id: string;
  input: string;
  createdAt: string;
  status: TaskStatus;
  routerResult?: RouterResult;
  agentResult?: AgentResult;
  redTeamResult?: RedTeamResult;
  simulatorPreview?: SimulatorPreview;
  logs: LogEntry[];
  completedAt?: string;
}

export interface TaskLogFile {
  tasks: Task[];
}

export interface RouteTaskRequest {
  input: string;
}

export interface RouteTaskResponse {
  task: Task;
}

export interface ApproveTaskRequest {
  taskId: string;
  action: "approve" | "reject";
}

export interface ApproveTaskResponse {
  task: Task;
}
