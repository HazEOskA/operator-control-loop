"use client";

import { useState, useRef } from "react";
import AlfredStatus from "@/components/AlfredStatus";
import AgentPanel from "@/components/AgentPanel";
import TaskTimeline from "@/components/TaskTimeline";
import ApprovalGate from "@/components/ApprovalGate";
import SystemLogPanel from "@/components/SystemLogPanel";
import type { AlfredState, Task } from "@/types/task";

export default function Home() {
  const [alfredState, setAlfredState] = useState<AlfredState>("Idle");
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const taskPanelRef = useRef<HTMLDivElement>(null);

  const handleAlfredOrbClick = () => {
    taskPanelRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTaskSubmitted = (task: Task) => {
    setCurrentTask(task);
  };

  const handleApprovalDecision = (task: Task) => {
    setCurrentTask(task);
  };

  const isAwaitingApproval = currentTask?.status === "waiting_for_approval";
  const isProcessing = alfredState === "Thinking" || alfredState === "Working";

  return (
    <div className="min-h-screen bg-[#0f1117] text-zinc-100">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              O
            </div>
            <div>
              <div className="font-bold text-white leading-tight">Operator Loop</div>
              <div className="text-xs text-gray-500">v0.2 — Operator Control Loop</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="bg-amber-900/40 text-amber-400 border border-amber-800 px-2 py-0.5 rounded text-xs font-semibold">
              DEMO MODE
            </span>
            <span>No real external actions in v0.2</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <AlfredStatus state={alfredState} onClickOrb={handleAlfredOrbClick} />
        </div>

        <div ref={taskPanelRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <AgentPanel
              onTaskSubmitted={handleTaskSubmitted}
              onAlfredStateChange={setAlfredState}
              disabled={isProcessing || isAwaitingApproval}
            />

            <ApprovalGate
              task={currentTask}
              onDecision={handleApprovalDecision}
              onAlfredStateChange={setAlfredState}
            />
          </div>

          <div className="flex flex-col gap-6">
            <TaskTimeline task={currentTask} />
            <SystemLogPanel currentTask={currentTask} />
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-gray-600 border-t border-gray-800 pt-4">
          <p>
            Operator Loop v0.2 — Operator Control Loop &nbsp;|&nbsp; All integrations are{" "}
            <span className="text-amber-500">demo/read-only</span> in this release &nbsp;|&nbsp;
            No emails, calendar writes, or destructive actions occur
          </p>
        </footer>
      </main>
    </div>
  );
}
