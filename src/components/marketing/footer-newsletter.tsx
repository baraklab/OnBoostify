"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { idleActionState } from "@/lib/types/action-state";
import { subscribeToNewsletter } from "@/app/(marketing)/blog/newsletter-actions";

export function FooterNewsletter() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, idleActionState);

  return (
    <div className="bg-muted/50">
      <div className="mx-auto max-w-6xl px-6 py-14 text-center">
        <h3 className="font-heading text-xl font-semibold text-foreground">
          Subscribe to our Newsletter
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Notes on launches, growth, and building OnBoostify — sent straight to your inbox.
        </p>

        {state.status === "success" ? (
          <div className="mx-auto mt-5 flex w-fit items-center gap-2 text-sm font-medium text-success">
            <CheckCircle2 className="size-4" />
            You&apos;re subscribed.
          </div>
        ) : (
          <form
            action={formAction}
            className="mx-auto mt-5 flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              className="h-11 sm:flex-1"
            />
            <Button type="submit" loading={isPending} size="lg" className="shrink-0">
              Subscribe
              <Send className="size-4" />
            </Button>
          </form>
        )}
        {state.status === "error" && (
          <p className="mt-2 text-sm text-destructive">{state.error}</p>
        )}
      </div>
    </div>
  );
}
