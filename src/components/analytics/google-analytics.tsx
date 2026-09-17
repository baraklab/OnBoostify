"use client";

import Script from "next/script";
import * as React from "react";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { onConsentChange } from "@/lib/cookie-consent";

/** Loads GA4 behind Google's Consent Mode (default set in the root layout's
 * beforeInteractive script, so no analytics cookies are set until the user
 * opts in) and flips consent live if it's changed later in the settings modal. */
export function GoogleAnalytics() {
  React.useEffect(
    () =>
      onConsentChange((consent) => {
        window.gtag?.("consent", "update", {
          analytics_storage: consent.analytics ? "granted" : "denied",
        });
      }),
    [],
  );

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.gtag('js', new Date());
          window.gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
