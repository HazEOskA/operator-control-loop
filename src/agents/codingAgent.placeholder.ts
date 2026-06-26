import type { AgentResult } from "@/types/task";

// Coding agent is a placeholder in v0.2.
// No code generation, execution, or file modification occurs.
export function runCodingAgent(_input: string): AgentResult {
  const output = `
[PLACEHOLDER — Coding Agent — Not Active in v0.2]

⚠ The Coding Agent is a placeholder in this release.
⚠ No code has been generated, executed, or modified.

Planned capabilities for a future release:
• Code generation assistance (TypeScript, Python, etc.)
• Debug analysis and fix suggestions
• Component scaffolding
• Build status checks (read-only)

Current status: PLACEHOLDER — awaiting v0.3 implementation.
`.trim();

  return {
    agent: "codingAgent",
    output,
    isDemo: true,
  };
}
