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
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag key={index} className="flex flex-col gap-2 pl-1">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2.5 text-[15px] text-muted-foreground">
                    {block.ordered ? (
                      <span className="mt-0.5 shrink-0 text-[13px] font-semibold text-accent">
                        {itemIndex + 1}.
                      </span>
                    ) : (
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                    )}
                    <span>{renderInlineMarkdown(item)}</span>
                  </li>
                ))}
              </ListTag>
            );
          }
          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-2 border-accent pl-4 text-[15px] italic text-foreground"
              >
                {renderInlineMarkdown(block.content)}
              </blockquote>
            );
          case "table":
            return (
              <figure key={index} className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-border">
                      {block.headers.map((header, headerIndex) => (
                        <th
                          key={headerIndex}
                          scope="col"
                          className="py-2 pr-4 font-semibold text-foreground"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-border/60">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="py-2 pr-4 align-top text-muted-foreground">
                            {renderInlineMarkdown(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {block.caption && (
                  <figcaption className="mt-2 text-xs text-muted-foreground">{block.caption}</figcaption>
                )}
              </figure>
            );
          case "faq":
            return (
              <div key={index} className="flex flex-col divide-y divide-border">
                {block.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="py-4 first:pt-0">
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {item.question}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                      {renderInlineMarkdown(item.answer)}
                    </p>
                  </div>
                ))}
              </div>
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
