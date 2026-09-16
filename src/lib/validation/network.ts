import { z } from "zod";

export const networkProfileSchema = z.object({
  displayName: z.string().trim().min(1, "Name is required").max(120),
  category: z.enum(["influencer", "creator", "community"]),
  platforms: z.array(z.string()).default([]),
  audienceSize: z.coerce.number().int().nonnegative().optional(),
  bio: z.string().trim().max(400).optional().or(z.literal("")),
  contactUrl: z.string().trim().url().optional().or(z.literal("")),
  isVisible: z.boolean().optional(),
});
