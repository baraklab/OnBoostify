import Link from "next/link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { marketingNav } from "@/lib/nav";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  // The header (and its sign-in/get-started buttons) must always render, even if
  // Supabase isn't reachable or configured yet — treat any failure as "signed out"
  // rather than letting it take the whole nav down.
  let user = null;
  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
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
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
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

        <MobileNav isAuthenticated={Boolean(user)} />
      </div>
    </header>
  );
}
