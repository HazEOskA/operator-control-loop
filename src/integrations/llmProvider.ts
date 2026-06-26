import Anthropic from "@anthropic-ai/sdk";

export interface LlmResult {
  output: string;
  source: "real_api" | "demo_fallback";
  provider: string;
}

const MODEL = "claude-opus-4-8";

export async function callLlm(prompt: string): Promise<LlmResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return { output: "", source: "demo_fallback", provider: "none" };
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const output = textBlock && textBlock.type === "text" ? textBlock.text : "";

    return { output, source: "real_api", provider: `anthropic/${MODEL}` };
  } catch {
    return { output: "", source: "demo_fallback", provider: "none" };
  }
}
