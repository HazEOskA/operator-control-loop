"use client";

import Image from "next/image";
import { useState } from "react";
import type { AlfredState } from "@/types/task";

interface AlfredStatusProps {
  state: AlfredState;
  onClickOrb?: () => void;
}

const STATE_CONFIG: Record<
  AlfredState,
  { color: string; pulse: boolean; label: string; icon: string; image: string }
> = {
  Idle: {
    color: "bg-indigo-500",
    pulse: false,
    label: "Alfred is idle and ready.",
    icon: "●",
    image: "/alfred/alfred-idle.png",
  },
  Thinking: {
    color: "bg-amber-500",
    pulse: true,
    label: "Alfred is thinking...",
    icon: "◐",
    image: "/alfred/alfred-thinking.png",
  },
  Working: {
    color: "bg-emerald-500",
    pulse: true,
    label: "Alfred is working...",
    icon: "◑",
    image: "/alfred/alfred-working.png",
  },
  Waiting: {
    color: "bg-blue-500",
    pulse: true,
    label: "Alfred is waiting for your approval.",
    icon: "◒",
    image: "/alfred/alfred-waiting.png",
  },
  Error: {
    color: "bg-red-500",
    pulse: false,
    label: "Alfred encountered an error.",
    icon: "✕",
    image: "/alfred/alfred-error.png",
  },
};

function AlfredPortrait({
  state,
  config,
  onClickOrb,
}: {
  state: AlfredState;
  config: (typeof STATE_CONFIG)[AlfredState];
  onClickOrb?: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  if (!imageError) {
    return (
      <button
        onClick={onClickOrb}
        title="Click to focus task panel"
        className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all hover:opacity-80 cursor-pointer ${
          config.pulse ? "animate-pulse" : ""
        } ${
          state === "Idle"
            ? "border-indigo-500"
            : state === "Thinking"
            ? "border-amber-500"
            : state === "Working"
            ? "border-emerald-500"
            : state === "Waiting"
            ? "border-blue-500"
            : "border-red-500"
        }`}
        aria-label={`Alfred status: ${state.toLowerCase()}`}
      >
        <Image
          src={config.image}
          alt={`Alfred status: ${state.toLowerCase()}`}
          width={96}
          height={96}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          priority
        />
      </button>
    );
  }

  // Fallback orb when image is missing
  return (
    <button
      onClick={onClickOrb}
      title="Click to focus task panel"
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all ${config.color} ${
        config.pulse ? "animate-pulse" : ""
      } hover:opacity-80 cursor-pointer shadow-lg`}
      aria-label={`Alfred status: ${state.toLowerCase()}`}
    >
      {config.icon}
    </button>
  );
}

export default function AlfredStatus({ state, onClickOrb }: AlfredStatusProps) {
  const config = STATE_CONFIG[state];

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
      <AlfredPortrait state={state} config={config} onClickOrb={onClickOrb} />
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
