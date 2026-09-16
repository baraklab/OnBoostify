"use client";

import { openCookieSettings } from "@/lib/cookie-consent";

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      Cookie Settings
    </button>
  );
}
