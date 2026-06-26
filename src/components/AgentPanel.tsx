"use client";

import { useState } from "react";
import type { Task } from "@/types/task";

interface AgentPanelProps {
  onTaskSubmitted: (task: Task) => void;
  onAlfredStateChange: (state: "Thinking" | "Working" | "Waiting" | "Error" | "Idle") => void;
  disabled?: boolean;
}

export default function AgentPanel({
  onTaskSubmitted,
  onAlfredStateChange,
  disabled = false,
}: AgentPanelProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setError(null);
    onAlfredStateChange("Thinking");

    try {
      const res = await fetch("/api/route-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Failed to route task.");
      }

      const task: Task = data.task;
      onAlfredStateChange(
        task.status === "error"
          ? "Error"
          : task.status === "waiting_for_approval"
          ? "Waiting"
          : "Working"
      );
      onTaskSubmitted(task);
      setInput("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      onAlfredStateChange("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const EXAMPLE_INPUTS = [
    "Research the history of AI assistants",
    "Show my calendar for today",
    "Summarize my inbox emails",
    "Help me write a React component",
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-5">
      <h2 className="text-lg font-bold text-white mb-4">Agent Input</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe a task for ALFA... (e.g. 'Research quantum computing')"
          rows={3}
          disabled={isLoading || disabled}
          className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-indigo-500 placeholder-gray-500 disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(e);
          }}
        />

        <div className="flex gap-2 flex-wrap">
          {EXAMPLE_INPUTS.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setInput(ex)}
              disabled={isLoading || disabled}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 rounded px-2 py-1 transition-colors disabled:opacity-40"
            >
              {ex}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? "Processing..." : "Submit Task (Ctrl+Enter)"}
        </button>
      </form>

      {error && (
        <div className="mt-3 bg-red-900 border border-red-700 text-red-200 rounded-lg p-3 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
