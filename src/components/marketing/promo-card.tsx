import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { frameGradient } from "@/lib/color";

export function PromoCard({
  href,
  color,
  icon: Icon,
  image,
  eyebrow,
  title,
  description,
  className,
}: {
  href: string;
  color: string;
  icon: LucideIcon;
  image?: string;
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md",
        className,
      )}
    >
      {image ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      ) : (
        <div
          className="flex aspect-video items-center justify-center"
          style={{ backgroundImage: frameGradient(color) }}
        >
          <Icon className="size-8 text-white/90" aria-hidden="true" />
        </div>
      )}
      <div className="p-4">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</p>
        )}
        <h3 className="mt-1 font-heading text-[15px] font-semibold text-foreground group-hover:underline">
          {title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
