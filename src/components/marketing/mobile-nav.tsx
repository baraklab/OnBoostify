"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { marketingNav } from "@/lib/nav";
import { logout } from "@/app/(auth)/actions";

export function MobileNav({ userName }: { userName: string | null }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-md text-foreground hover:bg-muted"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-40 border-b border-border bg-background px-6 py-6 shadow-sm">
          <nav className="flex flex-col gap-4">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground"
              >
                {item.label}
              </Link>
            ))}
            {userName && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground"
              >
                Dashboard
              </Link>
            )}
          </nav>
          <div className="mt-6 flex flex-col gap-2">
            {userName ? (
              <>
                <p className="px-1 text-sm font-medium text-foreground">{userName}</p>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive-soft"
                  >
                    <LogOut className="size-4" /> Log out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-md bg-block-sky-bg px-4 py-2.5 text-center text-sm font-semibold text-block-sky-fg"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
