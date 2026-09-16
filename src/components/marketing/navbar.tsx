import Link from "next/link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavUserMenu } from "./nav-user-menu";
import { marketingNav } from "@/lib/nav";
import { getCurrentUserId } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function Navbar() {
  // The header (and its sign-in/get-started buttons) must always render, even if
  // the session cookie is unreadable — treat any failure as "signed out" rather
  // than letting it take the whole nav down.
  let userId: string | null = null;
  try {
    userId = await getCurrentUserId();
  } catch {
    userId = null;
  }

  let displayName: string | null = null;
  if (userId) {
    try {
      const supabase = createAdminClient();
      const { data: user } = await supabase.from("users").select("email_id, first_name").eq("id", userId).single();
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", userId).single();
      displayName = profile?.full_name || user?.first_name || user?.email_id?.split("@")[0] || "Account";
    } catch {
      displayName = "Account";
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo size="lg" />

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-7">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            {displayName && (
              <Link
                href="/dashboard"
                className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {displayName ? (
              <NavUserMenu name={displayName} />
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-block-sky-bg px-4 py-2 text-sm font-semibold text-block-sky-fg transition-colors hover:bg-block-sky-fg hover:text-white"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <MobileNav userName={displayName} />
      </div>
    </header>
  );
}
