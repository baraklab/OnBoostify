import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Minimal inline markdown for blog body text: **bold**, _italic_, `code`,
 * and [text](url) links. Not a full markdown parser — just enough for the
 * formatting our posts actually use, without pulling in a markdown dependency.
 */
export function renderInlineMarkdown(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("_") && part.endsWith("_") && part.length > 1) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="font-mono-tech rounded bg-muted px-1 py-0.5 text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isExternal = /^https?:\/\//.test(href);
      if (isExternal) {
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2 hover:text-accent"
          >
            {label}
          </a>
        );
      }
      return (
        <Link
          key={index}
          href={href}
          className="font-medium text-foreground underline underline-offset-2 hover:text-accent"
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}
