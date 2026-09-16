import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PlatformId } from "@/lib/platforms/types";

interface PlatformIconProps {
  platform: PlatformId;
  className?: string;
}

const glyphs: Record<PlatformId, ReactNode> = {
  x: (
    <path d="M18.9 2h3.2l-7 8 8.2 12h-6.4l-5-6.6L5 22H1.8l7.5-8.6L1.4 2h6.5l4.5 6zM17.7 20h1.8L7.4 3.8H5.5z" />
  ),
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
  ),
  medium: (
    <path d="M4 6.5a1 1 0 0 0-.33.06L2 7.2v.24l1.6.9c.16.1.24.24.24.5v9.4c0 .27-.08.4-.24.5l-1.5.9v.24h6.3v-.24l-1.5-.9c-.17-.1-.25-.23-.25-.5v-8.9l4.7 10.68h.55l4.1-10.68v8.5c0 .23 0 .3-.15.44l-1.16.98v.24h5.9v-.24l-1.12-.98c-.14-.1-.2-.24-.2-.44V7.9c0-.2.06-.32.2-.44l1.15-.98v-.24h-4.2l-3.4 8.4-3.9-8.4z" />
  ),
  substack: (
    <path d="M4 3h16v3H4zM4 8h16v2.5H4zM4 13h16v2.5L12 21l-8-5.5z" />
  ),
};

export function PlatformIcon({ platform, className }: PlatformIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
    >
      {glyphs[platform]}
    </svg>
  );
}
