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
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
