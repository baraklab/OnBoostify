import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ImageIcon, ArrowRight } from "lucide-react";
import { frameGradient } from "@/lib/color";
import { cn } from "@/lib/utils";

/** Horizontal list card: text on the left, a colored thumbnail frame on the
 * right (real image when available, a placeholder glyph otherwise). Used by
 * both the blog and features list pages so they read as one system. */
export function SplitCard({
  href,
  color,
  image,
  eyebrow,
  title,
  description,
  meta,
  cta,
  className,
}: {
  href: string;
  color: string;
  image?: string;
  eyebrow?: string;
  title: string;
  description: string;
  meta?: ReactNode;
  cta?: string;
  className?: string;
}) {
  // A supplied `image` is a fully designed 1200x630 thumbnail — render it
  // edge-to-edge. Only the icon placeholder gets the padded gradient frame.
  const thumb = image ? (
    <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-auto sm:h-auto sm:w-2/5">
      <Image src={image} alt="" fill className="object-cover" />
    </div>
  ) : (
    <div
      className="flex w-full shrink-0 items-center justify-center p-4 sm:h-auto sm:w-2/5"
      style={{ backgroundImage: frameGradient(color) }}
    >
      <div className="flex aspect-[16/9] w-full max-w-sm items-center justify-center rounded-[10px] bg-white/10">
        <ImageIcon className="size-7 text-white/60" aria-hidden="true" />
      </div>
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
      {eyebrow && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p>}
      <h2 className="font-heading mt-1 line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {meta}
      {cta && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground">
          {cta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      )}
    </div>
  );

  const containerClass = cn(
    "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row",
    className,
  );

  return (
    <Link href={href} className={containerClass}>
      {body}
      {thumb}
    </Link>
  );
}
