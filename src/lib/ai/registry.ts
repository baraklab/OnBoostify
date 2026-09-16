import type { AIProvider, AIProviderId } from "./types";
import { openaiProvider } from "./providers/openai";
import { anthropicProvider } from "./providers/anthropic";
import { openrouterProvider } from "./providers/openrouter";

export const aiProviderRegistry: Record<AIProviderId, AIProvider> = {
  openai: openaiProvider,
  anthropic: anthropicProvider,
  openrouter: openrouterProvider,
};

export const aiProviderList = Object.values(aiProviderRegistry);

export function getAIProvider(id: AIProviderId): AIProvider {
  const provider = aiProviderRegistry[id];
  if (!provider) throw new Error(`Unknown AI provider: ${id}`);
  return provider;
}
