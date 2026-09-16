import type { Metadata } from "next";
import { ProfileForm } from "./profile-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Profile settings" };
export const dynamic = "force-dynamic";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company_name, website_url")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h2 className="font-heading text-base font-semibold text-foreground">Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This is how you appear across OnBoostify.
      </p>
      <div className="mt-6">
        <ProfileForm
          fullName={profile?.full_name ?? ""}
          companyName={profile?.company_name ?? ""}
          websiteUrl={profile?.website_url ?? ""}
          email={user!.email ?? ""}
        />
      </div>
    </div>
  );
}
