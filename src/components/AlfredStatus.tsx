"use client";

import type { AlfredState } from "@/types/task";

interface AlfredStatusProps {
  state: AlfredState;
  onClickOrb?: () => void;
}

const STATE_CONFIG: Record<
  AlfredState,
  { color: string; pulse: boolean; label: string; icon: string }
> = {
  Idle: {
    color: "bg-indigo-500",
    pulse: false,
    label: "Alfred is idle and ready.",
    icon: "●",
  },
  Thinking: {
    color: "bg-amber-500",
    pulse: true,
    label: "Alfred is thinking...",
    icon: "◐",
  },
  Working: {
    color: "bg-emerald-500",
    pulse: true,
    label: "Alfred is working...",
    icon: "◑",
  },
  Waiting: {
    color: "bg-blue-500",
    pulse: true,
    label: "Alfred is waiting for your approval.",
    icon: "◒",
  },
  Error: {
    color: "bg-red-500",
    pulse: false,
    label: "Alfred encountered an error.",
    icon: "✕",
  },
};

export default function AlfredStatus({ state, onClickOrb }: AlfredStatusProps) {
  const config = STATE_CONFIG[state];

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
      <button
        onClick={onClickOrb}
        title="Click to focus task panel"
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all ${config.color} ${
          config.pulse ? "animate-pulse" : ""
        } hover:opacity-80 cursor-pointer shadow-lg`}
        aria-label={`Alfred status: ${state}`}
      >
        {config.icon}
      </button>
      <div>
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
          Alfred
        </div>
        <div className="text-white font-medium">{state}</div>
        <div className="text-xs text-gray-400 mt-0.5">{config.label}</div>
      </div>
    </div>
  );
}
