import * as React from "react";

/**
 * Minimal Slot primitive: merges props/className/ref onto its single child
 * instead of rendering a wrapper element. Used for Button's `asChild`.
 */
type SlotProps = React.HTMLAttributes<HTMLElement> & { disabled?: boolean };

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) return null;

    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = (child.props ?? {}) as Record<string, unknown>;

    return React.cloneElement(child as React.ReactElement<Record<string, unknown> & { ref?: unknown }>, {
      ...props,
      ...childProps,
      className: cn(props.className as string, childProps.className as string),
      ref,
    });
  },
);
Slot.displayName = "Slot";

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
