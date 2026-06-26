"use client";

import { useState } from "react";
import type { Task } from "@/types/task";

interface ApprovalGateProps {
  task: Task | null;
  onDecision: (task: Task) => void;
  onAlfredStateChange: (state: "Idle" | "Error") => void;
}

export default function ApprovalGate({
  task,
  onDecision,
  onAlfredStateChange,
}: ApprovalGateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isWaiting = task?.status === "waiting_for_approval";

  const handleAction = async (action: "approve" | "reject") => {
    if (!task || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/approve-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, action }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Failed to process approval.");
      }

      const updatedTask: Task = data.task;
      onDecision(updatedTask);
      onAlfredStateChange("Idle");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      onAlfredStateChange("Error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!task) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-5">
        <h2 className="text-lg font-bold text-white mb-2">Approval Gate</h2>
        <p className="text-gray-500 text-sm">No task pending approval.</p>
      </div>
    );
  }

  const isCompleted =
    task.status === "approved" ||
    task.status === "rejected" ||
    task.status === "execute_preview_completed";

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-5">
      <h2 className="text-lg font-bold text-white mb-4">Approval Gate</h2>

      {isCompleted ? (
        <div
          className={`rounded-lg p-4 border ${
            task.status === "rejected"
              ? "bg-red-900/30 border-red-700"
              : "bg-emerald-900/30 border-emerald-700"
          }`}
        >
          <div
            className={`text-lg font-bold ${
              task.status === "rejected" ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {task.status === "rejected"
              ? "Task Rejected"
              : task.status === "approved"
              ? "Task Approved"
              : "Execute Preview Completed"}
          </div>
          <div className="text-sm text-gray-300 mt-1">
            {task.status === "rejected"
              ? "Task was cancelled. No actions were taken."
              : "Task result saved to local log. No external actions performed."}
          </div>
          {task.completedAt && (
            <div className="text-xs text-gray-500 mt-2">
              Completed at: {new Date(task.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      ) : isWaiting ? (
        <div>
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4">
            <div className="text-sm font-semibold text-blue-300 mb-1">
              Ready for your decision
            </div>
            <div className="text-xs text-gray-300">
              Task: <span className="text-white font-medium">&ldquo;{task.input}&rdquo;</span>
            </div>
            {task.simulatorPreview && (
              <div className="mt-2 text-xs text-cyan-300">
                Preview: {task.simulatorPreview.action}
              </div>
            )}
            {task.redTeamResult && task.redTeamResult.status !== "clear" && (
              <div
                className={`mt-2 text-xs font-semibold ${
                  task.redTeamResult.status === "warning"
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                ⚠ Red Team: {task.redTeamResult.status.toUpperCase()} — {task.redTeamResult.reason}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAction("approve")}
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {isLoading ? "Processing..." : "Approve"}
            </button>
            <button
              onClick={() => handleAction("reject")}
              disabled={isLoading}
              className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {isLoading ? "Processing..." : "Reject"}
            </button>
          </div>
        </div>
      ) : task.status === "error" ? (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <div className="text-red-400 font-bold">Task Error</div>
          <div className="text-sm text-gray-300 mt-1">
            {task.logs.find((l) => l.step === "error")?.detail ?? "An error occurred."}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">
            Processing... (Status: {task.status})
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 bg-red-900 border border-red-700 text-red-200 rounded-lg p-3 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
