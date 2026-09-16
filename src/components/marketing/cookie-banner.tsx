"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CookieSettingsModal } from "./cookie-settings-modal";
import { getStoredConsent, storeConsent } from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  React.useEffect(() => {
    // Reading localStorage requires the browser, so this only ever runs
    // after mount — the banner starts hidden on both server and first
    // client render, then shows if no choice has been saved yet.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!getStoredConsent()) setVisible(true);
  }, []);

  function acceptAll() {
    storeConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
  }

  return (
    <>
      {visible && (
        <div className="fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-sm">
          <div className="rounded-xl border border-border bg-card p-5 shadow-[0_12px_32px_rgba(20,20,26,0.12)]">
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use essential cookies to keep the website secure and functioning properly, plus
              optional analytics and marketing cookies with your consent.{" "}
              <Link
                href="/privacy#cookies"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Learn more in our Privacy Policy.
              </Link>
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
                Cookie settings
              </Button>
              <Button size="sm" onClick={acceptAll}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      <CookieSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSaved={() => setVisible(false)}
      />
    </>
  );
}
