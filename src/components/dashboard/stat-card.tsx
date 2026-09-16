import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlockColor } from "@/lib/block-colors";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  colorIndex,
  className,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  colorIndex?: number;
  className?: string;
}) {
  const color = colorIndex !== undefined ? getBlockColor(colorIndex) : null;

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-eyebrow">{label}</span>
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-md",
            color ? color.bg : "bg-muted",
          )}
        >
          <Icon className={cn("size-3.5", color ? color.fg : "text-muted-foreground")} />
        </span>
      </div>
      <p className="font-heading mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
