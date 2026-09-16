import type { AIProvider, CompletionRequest } from "../types";

const API_BASE = "https://api.openai.com/v1";

export const openaiProvider: AIProvider = {
  definition: {
    id: "openai",
    name: "OpenAI",
    docsUrl: "https://platform.openai.com/docs",
    defaultModel: "gpt-4.1-mini",
    models: ["gpt-4.1", "gpt-4.1-mini", "gpt-4o", "gpt-4o-mini", "o4-mini"],
    apiKeyPlaceholder: "sk-...",
  },

  async testConnection(apiKey, model) {
    try {
      const response = await fetch(`${API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "Reply with the single word: ok" }],
          max_tokens: 5,
        }),
      });
      if (!response.ok) {
        const body = await response.text();
        return { ok: false, error: `OpenAI responded ${response.status}: ${body.slice(0, 200)}` };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  },

  async complete({ apiKey, model, system, prompt, maxTokens = 1200 }: CompletionRequest) {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI error (${response.status}): ${body.slice(0, 300)}`);
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    return { text: data.choices[0]?.message.content ?? "" };
  },
};
