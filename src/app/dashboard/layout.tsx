import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { ToastProvider } from "@/components/ui/toast";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserId } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const supabase = createAdminClient();
  const { data: user } = await supabase.from("users").select("email_id, first_name").eq("id", userId).single();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  const displayName = profile?.full_name || user?.first_name || user?.email_id?.split("@")[0] || "There";

  return (
    <ToastProvider>
      <div className="flex h-dvh overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
            <MobileSidebar />
            <div className="hidden md:block" />
            <UserMenu name={displayName} email={user?.email_id ?? ""} />
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
