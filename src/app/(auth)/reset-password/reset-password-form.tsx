"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "../actions";
import { changePasswordSchema } from "@/lib/validation/security";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = changePasswordSchema.safeParse({ newPassword, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    if (!token) {
      setError("This reset link is missing its token. Request a new one from the log in page.");
      return;
    }

    setSubmitting(true);
    setError(undefined);
    const result = await resetPassword({ token, password: parsed.data.newPassword });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-lg border border-border bg-card p-7 text-center shadow-sm">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="size-5 text-success" />
        </div>
        <h1 className="font-heading mt-4 text-lg font-semibold text-foreground">Password updated</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You can now log in with your new password.
        </p>
        <Button className="mt-6 w-full" onClick={() => router.push("/login")}>
          Back to log in
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-7 shadow-sm">
      <h1 className="font-heading text-center text-xl font-semibold text-foreground">
        Choose a new password
      </h1>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" loading={submitting}>
          Update password
        </Button>
      </form>
    </div>
  );
}
