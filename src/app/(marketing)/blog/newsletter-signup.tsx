"use client";

import { useActionState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { idleActionState } from "@/lib/types/action-state";
import { subscribeToNewsletter } from "./newsletter-actions";

export function NewsletterSignup() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, idleActionState);

  if (state.status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-success-soft p-5">
        <CheckCircle2 className="size-5 shrink-0 text-success" />
        <p className="text-sm text-foreground">You&apos;re subscribed. Watch for the next one.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-5">
      <div className="flex items-center gap-2">
        <Mail className="size-4 text-accent" />
        <p className="text-sm font-semibold text-foreground">Get the next post</p>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Tactics like this one, sent when we publish — no spam, unsubscribe anytime.
      </p>
      <form action={formAction} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          className="sm:flex-1"
        />
        <Button type="submit" loading={isPending}>
          Subscribe
        </Button>
      </form>
      {state.status === "error" && <p className="mt-2 text-sm text-destructive">{state.error}</p>}
    </div>
  );
}
