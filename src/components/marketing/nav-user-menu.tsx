"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu } from "@/components/ui/dropdown";
import { logout } from "@/app/(auth)/actions";

export function NavUserMenu({ name }: { name: string }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md py-2 pl-1 pr-2 text-[15px] font-medium text-foreground hover:bg-muted"
        >
          {name}
          <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
        </button>
      </DropdownTrigger>
      <DropdownMenu align="end" className="w-48">
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
