"use client";

import * as React from "react";
import Script from "next/script";
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

  const initialize = React.useCallback(() => {
    if (!CLIENT_ID || !window.google || !buttonRef.current) return;
    window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredential });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 336,
      text: "continue_with",
    });
  }, [handleCredential]);

  // Not configured yet — hide rather than render a button that can only fail.
  // See env/dev.env's NEXT_PUBLIC_GOOGLE_CLIENT_ID for setup.
  if (!CLIENT_ID) return null;

  return (
    <div>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={initialize} />
      <div ref={buttonRef} className="flex w-full justify-center" />
      {error && (
        <p className="mt-2 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
