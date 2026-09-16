"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" ref={ref}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function useDropdown() {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown components must be used within <Dropdown>");
  return ctx;
}

export function DropdownTrigger({ children }: { children: React.ReactElement }) {
  const { open, setOpen } = useDropdown();
  return React.cloneElement(children, {
    onClick: () => setOpen(!open),
    "aria-expanded": open,
  } as Record<string, unknown>);
}

export function DropdownMenu({
  align = "start",
  className,
  children,
}: {
  align?: "start" | "end";
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useDropdown();
  if (!open) return null;
  return (
    <div
      role="menu"
      className={cn(
        "absolute z-40 mt-1.5 min-w-[10rem] rounded-md border border-border bg-card p-1 shadow-md",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

const itemClassName =
  "flex w-full items-center gap-2 rounded-[calc(var(--radius-md)-2px)] px-2.5 py-1.5 text-left text-sm text-foreground hover:bg-muted";

export function DropdownItem({
  className,
  onSelect,
  href,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { onSelect?: () => void; href?: string }) {
  const { setOpen } = useDropdown();

  if (href) {
    return (
      <Link href={href} role="menuitem" onClick={() => setOpen(false)} className={cn(itemClassName, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={(event) => {
        onSelect?.();
        props.onClick?.(event);
        setOpen(false);
      }}
      className={cn(itemClassName, className)}
      {...props}
    >
      {children}
    </button>
  );
}
