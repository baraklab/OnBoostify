import { cn } from "@/lib/utils";

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#000000" aria-hidden="true" className={cn("size-4", className)}>
      <path d="M18.9 2h3.2l-7 8 8.2 12h-6.4l-5-6.6L5 22H1.8l7.5-8.6L1.4 2h6.5l4.5 6zM17.7 20h1.8L7.4 3.8H5.5z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true" className={cn("size-4", className)}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
    </svg>
  );
}

export function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true" className={cn("size-4", className)}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
    </svg>
  );
}

export function DevToIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4", className)}>
      <rect width="24" height="24" rx="5" fill="#0A0A0A" />
      <path
        fill="#ffffff"
        d="M4.4 9.3h1.9c1.5 0 2.4.9 2.4 2.7 0 1.8-.9 2.7-2.4 2.7H4.4V9.3Zm1.2 1v3.4h.6c.8 0 1.2-.5 1.2-1.7s-.4-1.7-1.2-1.7h-.6ZM9.6 9.3h3.5v1h-2.3v1.1h2.1v1h-2.1v1.3h2.4v1H9.6V9.3ZM14 9.3h1.3l1.1 3.7 1.1-3.7h1.3l-1.8 5.4h-1.2L14 9.3Z"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E1306C"
      strokeWidth="1.8"
      aria-hidden="true"
      className={cn("size-4", className)}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="#E1306C" stroke="none" />
    </svg>
  );
}
