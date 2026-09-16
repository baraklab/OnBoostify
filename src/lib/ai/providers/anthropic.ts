import type { AIProvider, CompletionRequest } from "../types";

const API_BASE = "https://api.anthropic.com/v1";
const API_VERSION = "2023-06-01";

export const anthropicProvider: AIProvider = {
  definition: {
    id: "anthropic",
    name: "Anthropic",
    docsUrl: "https://docs.anthropic.com",
    defaultModel: "claude-sonnet-5",
    models: ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5-20251001"],
    apiKeyPlaceholder: "sk-ant-...",
  },

  async testConnection(apiKey, model) {
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": API_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 5,
          messages: [{ role: "user", content: "Reply with the single word: ok" }],
        }),
      });
      if (!response.ok) {
        const body = await response.text();
        return {
          ok: false,
          error: `Anthropic responded ${response.status}: ${body.slice(0, 200)}`,
        };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  },

  async complete({ apiKey, model, system, prompt, maxTokens = 1200 }: CompletionRequest) {
    const response = await fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        system,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Anthropic error (${response.status}): ${body.slice(0, 300)}`);
    }

    const data = (await response.json()) as { content: { type: string; text?: string }[] };
    const text = data.content.find((block) => block.type === "text")?.text ?? "";
    return { text };
  },
};
