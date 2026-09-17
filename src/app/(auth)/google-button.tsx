"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "./actions";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

// The sign-in card renders two GoogleButton instances at once (one per flip-card face,
// see auth-card.tsx) plus this component can remount on client-side route transitions.
// next/script's onReady is unreliable across those remounts, so this loads the script
// manually with a module-level cached promise (fetched once, resolves for every mount —
// including ones after the first) instead.
let gsiScriptPromise: Promise<void> | null = null;
function loadGsiScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gsiScriptPromise) {
    gsiScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Failed to load Google Identity Services")));
        return;
      }
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
      document.head.appendChild(script);
    });
  }
  return gsiScriptPromise;
}

// google.accounts.id.initialize() resets the library's internal state on every call —
// calling it once per mounted GoogleButton instance (there are normally two at a time)
// clobbers whichever button initialized first. Every instance still calls renderButton()
// on its own DOM node; only the very first instance actually calls initialize().
let gsiInitialized = false;

export function GoogleButton() {
  const router = useRouter();
  const buttonRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string>();

  const handleCredential = React.useCallback(
    async (response: { credential: string }) => {
      setError(undefined);
      const result = await signInWithGoogle(response.credential);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.requiresVerification) {
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    },
    [router],
  );

  React.useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    loadGsiScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google) return;
        if (!gsiInitialized) {
          window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredential });
          gsiInitialized = true;
        }
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 336,
          text: "continue_with",
        });
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load Google sign-in. Please try again.");
      });

    return () => {
      cancelled = true;
    };
  }, [handleCredential]);

  // Not configured yet — hide rather than render a button that can only fail.
  // See env/dev.env's NEXT_PUBLIC_GOOGLE_CLIENT_ID for setup.
  if (!CLIENT_ID) return null;

  return (
    <div>
      <div ref={buttonRef} className="flex w-full justify-center" />
      {error && (
        <p className="mt-2 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
