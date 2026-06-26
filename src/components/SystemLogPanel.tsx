"use client";

import { useState } from "react";
import type { Task } from "@/types/task";

interface SystemLogPanelProps {
  currentTask: Task | null;
}

export default function SystemLogPanel({ currentTask }: SystemLogPanelProps) {
  const [persistedTasks, setPersistedTasks] = useState<Task[]>([]);
  const [isLoadingLog, setIsLoadingLog] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [showLog, setShowLog] = useState(false);

  const loadTaskLog = async () => {
    setIsLoadingLog(true);
    setLogError(null);
    try {
      const res = await fetch("/api/task-log");
      if (!res.ok) throw new Error("Failed to load task log.");
      const data = await res.json();
      setPersistedTasks(data.tasks ?? []);
      setShowLog(true);
    } catch (err) {
      setLogError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoadingLog(false);
    }
  };

  const allLogs = currentTask?.logs ?? [];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">System Log</h2>
        <button
          onClick={loadTaskLog}
          disabled={isLoadingLog}
          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 rounded px-3 py-1.5 transition-colors disabled:opacity-40"
        >
          {isLoadingLog ? "Loading..." : "Show Saved Logs"}
        </button>
      </div>

      {allLogs.length > 0 ? (
        <div className="space-y-1 mb-4 max-h-40 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-1">
            Current Session
          </div>
          {allLogs.map((log, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs font-mono bg-gray-800 rounded px-2 py-1"
            >
              <span className="text-gray-500 flex-shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span
                className={`flex-shrink-0 font-semibold uppercase ${
                  log.step === "error"
                    ? "text-red-400"
                    : log.step === "approved" || log.step === "execute_preview_completed"
                    ? "text-emerald-400"
                    : log.step === "rejected"
                    ? "text-red-400"
                    : log.step === "red_team_checked"
                    ? "text-orange-400"
                    : "text-indigo-400"
                }`}
              >
                [{log.step}]
              </span>
              <span className="text-gray-300 break-all">{log.detail ?? ""}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-4">No active session logs.</p>
      )}

      {logError && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded p-2 text-xs mb-3">
          {logError}
        </div>
      )}

      {showLog && persistedTasks.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Saved Tasks ({persistedTasks.length})
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {[...persistedTasks].reverse().map((t) => (
              <div
                key={t.id}
                className="bg-gray-800 rounded-lg p-3 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-gray-500 truncate max-w-[60%]">
                    {t.id.slice(0, 8)}…
                  </span>
                  <span
                    className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded ${
                      t.status === "execute_preview_completed"
                        ? "bg-emerald-900 text-emerald-300"
                        : t.status === "rejected"
                        ? "bg-red-900 text-red-300"
                        : t.status === "error"
                        ? "bg-red-900 text-red-300"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="text-sm text-white truncate">{t.input}</div>
                {t.routerResult && (
                  <div className="text-xs text-indigo-400 mt-0.5">
                    Agent: {t.routerResult.agent}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-0.5">
                  {new Date(t.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLog && persistedTasks.length === 0 && (
        <div className="text-gray-500 text-sm">No saved tasks yet.</div>
      )}
    </div>
  );
}
