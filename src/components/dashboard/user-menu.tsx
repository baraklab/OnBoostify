"use client";

import { User, Settings, LogOut } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@/components/ui/dropdown";
import { logout } from "@/app/(auth)/actions";

export function UserMenu({ name, email }: { name: string; email: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "U";

  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
        >
          {initial}
        </button>
      </DropdownTrigger>
      <DropdownMenu align="end" className="w-56">
        <div className="px-2.5 py-2">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        <div className="my-1 h-px bg-border" />
        <DropdownItem href="/dashboard/settings">
          <User className="size-4" /> Profile
        </DropdownItem>
        <DropdownItem href="/dashboard/settings">
          <Settings className="size-4" /> Settings
        </DropdownItem>
        <div className="my-1 h-px bg-border" />
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-[calc(var(--radius-md)-2px)] px-2.5 py-1.5 text-left text-sm text-destructive hover:bg-destructive-soft"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </form>
      </DropdownMenu>
    </Dropdown>
  );
}
