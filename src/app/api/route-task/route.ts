import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { routeTask } from "@/core/router";
import { runRedTeam } from "@/core/redTeam";
import { simulate } from "@/core/simulator";
import { appendLog, createLogEntry } from "@/core/logger";
import { writeTaskToLog } from "@/core/executor";
import { runResearchAgent } from "@/agents/researchAgent";
import { runCalendarAgent } from "@/agents/calendarAgent";
import { runGmailAgent } from "@/agents/gmailAgent";
import { runCodingAgent } from "@/agents/codingAgent.placeholder";
import type { Task, RouteTaskRequest, RouteTaskResponse, AgentResult } from "@/types/task";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RouteTaskRequest;
    const { input } = body;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Input is required." },
        { status: 400 }
      );
    }

    const trimmedInput = input.trim();
    const taskId = randomUUID();
    const now = new Date().toISOString();

    let task: Task = {
      id: taskId,
      input: trimmedInput,
      createdAt: now,
      status: "input_received",
      logs: [createLogEntry("input_received", `User submitted: "${trimmedInput}"`)],
    };

    // Route
    const routerResult = routeTask(trimmedInput);
    task = appendLog(
      { ...task, routerResult },
      "routed",
      `Routed to ${routerResult.agent}: ${routerResult.reason}`
    );

    // Run agent
    task = appendLog(task, "agent_started", `Starting ${routerResult.agent}`);

    let agentResult: AgentResult;
    try {
      switch (routerResult.agent) {
        case "researchAgent":
          agentResult = runResearchAgent(trimmedInput);
          break;
        case "calendarAgent":
          agentResult = runCalendarAgent(trimmedInput);
          break;
        case "gmailAgent":
          agentResult = runGmailAgent(trimmedInput);
          break;
        case "codingAgent":
          agentResult = runCodingAgent(trimmedInput);
          break;
        default:
          agentResult = {
            agent: "unknown",
            output: "[UNKNOWN INTENT] No agent matched this input. Please refine your request.",
            isDemo: true,
          };
      }
    } catch (agentErr) {
      const errMsg = agentErr instanceof Error ? agentErr.message : "Agent error";
      task = appendLog(task, "error", errMsg);
      writeTaskToLog(task);
      return NextResponse.json({ task } as RouteTaskResponse);
    }

    task = appendLog(
      { ...task, agentResult },
      "agent_completed",
      `${routerResult.agent} completed (isDemo=${agentResult.isDemo})`
    );

    // Red team check
    const redTeamResult = runRedTeam(trimmedInput, agentResult);
    task = appendLog(
      { ...task, redTeamResult },
      "red_team_checked",
      `Risk Gate status: ${redTeamResult.status}. Flags: [${redTeamResult.flags.join(", ") || "none"}]`
    );

    if (redTeamResult.status === "blocked") {
      task = appendLog(task, "error", `Blocked by Risk Gate: ${redTeamResult.reason}`);
      writeTaskToLog(task);
      return NextResponse.json({ task } as RouteTaskResponse);
    }

    // Simulate
    const simulatorPreview = simulate(routerResult, agentResult);
    task = appendLog(
      { ...task, simulatorPreview },
      "simulated",
      `Preview: ${simulatorPreview.action}`
    );

    // Wait for approval
    task = appendLog(task, "waiting_for_approval", "Awaiting user approval to proceed.");

    writeTaskToLog(task);
    return NextResponse.json({ task } as RouteTaskResponse);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
