import * as React from "react";
import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: LucideIcon;
  label: string;
  showTooltip?: boolean;
  href?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, label, showTooltip = true, href, className, variant = "ghost", size = "icon", ...props }, ref) => {
    const button = href ? (
      <Button ref={ref} variant={variant} size={size} aria-label={label} className={cn(className)} asChild>
        <Link href={href}>
          <Icon className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    ) : (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label={label}
        className={cn(className)}
        {...props}
      >
        <Icon className="size-4" aria-hidden="true" />
      </Button>
    );

    if (!showTooltip) return button;
    return <Tooltip label={label}>{button}</Tooltip>;
  },
);
IconButton.displayName = "IconButton";
