import fs from "fs";
import path from "path";
import type { Task, TaskLogFile } from "@/types/task";

const LOG_PATH = path.join(process.cwd(), "src", "data", "task-log.json");

export function readTaskLog(): TaskLogFile {
  try {
    const raw = fs.readFileSync(LOG_PATH, "utf-8");
    return JSON.parse(raw) as TaskLogFile;
  } catch {
    return { tasks: [] };
  }
}

export function writeTaskToLog(task: Task): void {
  const log = readTaskLog();
  const existingIndex = log.tasks.findIndex((t) => t.id === task.id);

  if (existingIndex >= 0) {
    log.tasks[existingIndex] = task;
  } else {
    log.tasks.push(task);
  }

  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), "utf-8");
}

export function getTaskById(taskId: string): Task | undefined {
  const log = readTaskLog();
  return log.tasks.find((t) => t.id === taskId);
}

export function executePreview(task: Task): Task {
  const completedTask: Task = {
    ...task,
    status: "execute_preview_completed",
    completedAt: new Date().toISOString(),
    logs: [
      ...task.logs,
      {
        step: "execute_preview_completed",
        timestamp: new Date().toISOString(),
        detail: "Task result saved to local log. No external actions performed.",
      },
    ],
  };

  writeTaskToLog(completedTask);
  return completedTask;
}
