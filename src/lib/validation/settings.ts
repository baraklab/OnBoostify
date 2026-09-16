import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(120),
  companyName: z.string().trim().max(120).optional().or(z.literal("")),
  websiteUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
});

export const contentProfileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  tone: z.string().trim().min(1).max(60),
  audience: z.string().trim().max(200).optional().or(z.literal("")),
  brandVoice: z.string().trim().max(300).optional().or(z.literal("")),
  length: z.enum(["short", "medium", "long"]),
  formality: z.enum(["casual", "neutral", "formal"]),
  ctaStyle: z.string().trim().max(200).optional().or(z.literal("")),
  topicsToAvoid: z.string().trim().max(400).optional().or(z.literal("")),
  wordsToAvoid: z.string().trim().max(400).optional().or(z.literal("")),
  personalContext: z.string().trim().max(600).optional().or(z.literal("")),
  defaultHashtags: z.string().trim().max(200).optional().or(z.literal("")),
  isDefault: z.boolean().optional(),
});

export const aiProviderSchema = z.object({
  provider: z.enum(["openai", "anthropic", "openrouter"]),
  apiKey: z.string().trim().min(10, "Enter a valid API key"),
  defaultModel: z.string().trim().min(1),
  isDefault: z.boolean().optional(),
});
