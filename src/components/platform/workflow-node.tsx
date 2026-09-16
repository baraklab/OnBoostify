import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkflowNode({
  icon: Icon,
  label,
  sublabel,
  variant = "default",
  className,
}: {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  variant?: "default" | "accent";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border border-border bg-card px-3.5 py-2.5",
        variant === "accent" && "border-accent/40 bg-accent-soft",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted",
          variant === "accent" && "bg-accent text-accent-foreground",
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        {sublabel && <p className="truncate text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}
