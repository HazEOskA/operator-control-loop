"use client";

import type { Task, TaskStatus } from "@/types/task";

interface TaskTimelineProps {
  task: Task | null;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  input_received: "Input Received",
  routed: "Routed to Agent",
  agent_started: "Agent Started",
  agent_completed: "Agent Completed",
  red_team_checked: "Red Team Checked",
  simulated: "Simulated Preview",
  waiting_for_approval: "Waiting for Approval",
  approved: "Approved",
  rejected: "Rejected",
  execute_preview_completed: "Execute Preview Completed",
  error: "Error",
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  input_received: "bg-gray-500",
  routed: "bg-purple-500",
  agent_started: "bg-amber-500",
  agent_completed: "bg-emerald-500",
  red_team_checked: "bg-orange-500",
  simulated: "bg-cyan-500",
  waiting_for_approval: "bg-blue-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  execute_preview_completed: "bg-emerald-600",
  error: "bg-red-600",
};

export default function TaskTimeline({ task }: TaskTimelineProps) {
  if (!task) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-5">
        <h2 className="text-lg font-bold text-white mb-2">Task Timeline</h2>
        <p className="text-gray-500 text-sm">Submit a task to see the timeline.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-5">
      <h2 className="text-lg font-bold text-white mb-1">Task Timeline</h2>
      <p className="text-xs text-gray-500 mb-4 font-mono">ID: {task.id}</p>

      {task.routerResult && (
        <div className="mb-4 bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Router</div>
          <div className="text-sm text-white">
            Agent: <span className="text-indigo-400 font-mono">{task.routerResult.agent}</span>
          </div>
          <div className="text-sm text-gray-300">Intent: {task.routerResult.intent}</div>
          <div className="text-xs text-gray-500 mt-1">{task.routerResult.reason}</div>
        </div>
      )}

      {task.redTeamResult && (
        <div
          className={`mb-4 rounded-lg p-3 border ${
            task.redTeamResult.status === "clear"
              ? "bg-emerald-900/30 border-emerald-700"
              : task.redTeamResult.status === "warning"
              ? "bg-amber-900/30 border-amber-700"
              : "bg-red-900/30 border-red-700"
          }`}
        >
          <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Red Team</div>
          <div
            className={`text-sm font-bold uppercase ${
              task.redTeamResult.status === "clear"
                ? "text-emerald-400"
                : task.redTeamResult.status === "warning"
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            {task.redTeamResult.status}
          </div>
          <div className="text-xs text-gray-300 mt-1">{task.redTeamResult.reason}</div>
          {task.redTeamResult.flags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-1">
              {task.redTeamResult.flags.map((flag) => (
                <span
                  key={flag}
                  className="text-xs bg-red-900 text-red-200 border border-red-700 rounded px-1.5 py-0.5"
                >
                  {flag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {task.simulatorPreview && (
        <div className="mb-4 bg-cyan-900/20 rounded-lg p-3 border border-cyan-800">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-1">
            Simulator Preview
          </div>
          <div className="text-sm font-semibold text-cyan-300">{task.simulatorPreview.action}</div>
          <div className="text-xs text-gray-300 mt-1">{task.simulatorPreview.preview}</div>
        </div>
      )}

      {task.agentResult && (
        <div className="mb-4 bg-gray-800 rounded-lg p-3 border border-gray-700">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-1">
            Agent Output{task.agentResult.isDemo && (
              <span className="ml-2 bg-amber-800 text-amber-200 text-xs px-1.5 py-0.5 rounded">
                DEMO
              </span>
            )}
          </div>
          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
            {task.agentResult.output}
          </pre>
        </div>
      )}

      <div className="mt-2">
        <div className="text-xs font-semibold text-gray-400 uppercase mb-2">Steps</div>
        <ol className="space-y-2">
          {task.logs.map((log, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  STATUS_COLORS[log.step] ?? "bg-gray-500"
                }`}
              />
              <div>
                <div className="text-sm text-white font-medium">
                  {STATUS_LABELS[log.step] ?? log.step}
                </div>
                {log.detail && (
                  <div className="text-xs text-gray-400 mt-0.5">{log.detail}</div>
                )}
                <div className="text-xs text-gray-600 mt-0.5">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
