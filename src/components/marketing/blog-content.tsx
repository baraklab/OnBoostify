import type { BlogBlock } from "@/lib/blog/posts";
import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { NewsletterSignup } from "@/app/(marketing)/blog/newsletter-signup";

export function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="font-heading mt-3 text-xl font-semibold tracking-tight text-foreground"
              >
                {renderInlineMarkdown(block.content)}
              </h2>
            );
          case "subheading":
            return (
              <h3 key={index} className="font-heading mt-1 text-base font-semibold text-foreground">
                {renderInlineMarkdown(block.content)}
              </h3>
            );
          case "list":
            return (
              <ul key={index} className="flex flex-col gap-2 pl-1">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2.5 text-[15px] text-muted-foreground">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                    <span>{renderInlineMarkdown(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-2 border-accent pl-4 text-[15px] italic text-foreground"
              >
                {renderInlineMarkdown(block.content)}
              </blockquote>
            );
          case "newsletter":
            return <NewsletterSignup key={index} />;
          default:
            return (
              <p key={index} className="text-[15px] leading-relaxed text-muted-foreground">
                {renderInlineMarkdown(block.content)}
              </p>
            );
        }
      })}
    </div>
  );
}
