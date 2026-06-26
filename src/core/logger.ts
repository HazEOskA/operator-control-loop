import type { LogEntry, Task, TaskStatus } from "@/types/task";

export function createLogEntry(step: TaskStatus, detail?: string): LogEntry {
  return {
    step,
    timestamp: new Date().toISOString(),
    detail,
  };
}

export function appendLog(task: Task, step: TaskStatus, detail?: string): Task {
  return {
    ...task,
    logs: [...task.logs, createLogEntry(step, detail)],
    status: step,
  };
}
