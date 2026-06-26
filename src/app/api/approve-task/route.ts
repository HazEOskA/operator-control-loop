import { NextRequest, NextResponse } from "next/server";
import { getTaskById, executePreview, writeTaskToLog } from "@/core/executor";
import { appendLog } from "@/core/logger";
import type { ApproveTaskRequest, ApproveTaskResponse } from "@/types/task";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ApproveTaskRequest;
    const { taskId, action } = body;

    if (!taskId || !action) {
      return NextResponse.json(
        { error: "taskId and action are required." },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "action must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    const task = getTaskById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    if (task.status !== "waiting_for_approval") {
      return NextResponse.json(
        { error: `Task is not awaiting approval (current status: ${task.status}).` },
        { status: 409 }
      );
    }

    if (action === "reject") {
      const rejectedTask = appendLog(
        task,
        "rejected",
        "User rejected the task. No action taken."
      );
      const finalTask = {
        ...rejectedTask,
        completedAt: new Date().toISOString(),
      };
      writeTaskToLog(finalTask);
      return NextResponse.json({ task: finalTask } as ApproveTaskResponse);
    }

    // approve
    const approvedTask = appendLog(task, "approved", "User approved the task.");
    const finalTask = executePreview(approvedTask);
    return NextResponse.json({ task: finalTask } as ApproveTaskResponse);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
