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
  {
    color: string;
    pulse: boolean;
    label: string;
    icon: string;
    image: string;
    fallbackImage?: string;
    borderColor: string;
  }
> = {
  Idle: {
    color: "bg-indigo-500",
    pulse: false,
    label: "Alfred is idle and ready.",
    icon: "●",
    image: "/alfred/alfred-idle.png",
    borderColor: "border-indigo-500",
  },
  Thinking: {
    color: "bg-amber-500",
    pulse: true,
    label: "Alfred is thinking...",
    icon: "◐",
    image: "/alfred/alfred-thinking.png",
    borderColor: "border-amber-500",
  },
  Working: {
    color: "bg-emerald-500",
    pulse: true,
    label: "Alfred is working...",
    icon: "◑",
    image: "/alfred/alfred-working.png",
    borderColor: "border-emerald-500",
  },
  Waiting: {
    color: "bg-blue-500",
    pulse: true,
    label: "Alfred is waiting for your approval.",
    icon: "◒",
    image: "/alfred/alfred-waiting.png",
    borderColor: "border-blue-500",
  },
  Blocked: {
    color: "bg-orange-500",
    pulse: false,
    label: "Alfred blocked a risky task.",
    icon: "⊘",
    image: "/alfred/alfred-blocked.png",
    fallbackImage: "/alfred/alfred-error.png",
    borderColor: "border-orange-500",
  },
  Error: {
    color: "bg-red-500",
    pulse: false,
    label: "Alfred encountered an error.",
    icon: "✕",
    image: "/alfred/alfred-error.png",
    borderColor: "border-red-500",
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
  const [imageSrc, setImageSrc] = useState(config.image);
  const [showOrb, setShowOrb] = useState(false);

  const handleImageError = () => {
    if (imageSrc === config.image && config.fallbackImage) {
      setImageSrc(config.fallbackImage);
    } else {
      setShowOrb(true);
    }
  };

  if (showOrb) {
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

  return (
    <button
      onClick={onClickOrb}
      title="Click to focus task panel"
      className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all hover:opacity-80 cursor-pointer ${
        config.pulse ? "animate-pulse" : ""
      } ${config.borderColor}`}
      aria-label={`Alfred status: ${state.toLowerCase()}`}
    >
      <Image
        src={imageSrc}
        alt={`Alfred status: ${state.toLowerCase()}`}
        width={96}
        height={96}
        className="w-full h-full object-cover"
        onError={handleImageError}
        priority
      />
    </button>
  );
}

export default function AlfredStatus({ state, onClickOrb }: AlfredStatusProps) {
  const config = STATE_CONFIG[state];

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
      <AlfredPortrait key={state} state={state} config={config} onClickOrb={onClickOrb} />
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
