export type AIProviderId = "openai" | "anthropic" | "openrouter";

export interface AIProviderDefinition {
  id: AIProviderId;
  name: string;
  docsUrl: string;
  defaultModel: string;
  models: string[];
  apiKeyPlaceholder: string;
}

export interface CompletionRequest {
  apiKey: string;
  model: string;
  system: string;
  prompt: string;
  maxTokens?: number;
}

export interface CompletionResult {
  text: string;
}

export interface AIProvider {
  definition: AIProviderDefinition;
  testConnection(apiKey: string, model: string): Promise<{ ok: boolean; error?: string }>;
  complete(request: CompletionRequest): Promise<CompletionResult>;
}
