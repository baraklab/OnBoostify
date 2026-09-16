import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Reset password",
  description: "Choose a new password for your OnBoostify account.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <ResetPasswordForm />
    </div>
  );
}
