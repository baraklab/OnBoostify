import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog/posts";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { SplitCard } from "@/components/marketing/split-card";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Notes on cross-posting, AI-assisted content, backlinks, growth, and building OnBoostify.",
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-eyebrow text-center">Blog</p>
          <h1 className="font-heading mx-auto mt-3 max-w-xl text-center text-3xl font-semibold tracking-tight text-foreground">
            Notes on launches, growth, and building OnBoostify.
          </h1>

          <div className="mt-12 flex flex-col gap-6">
            {blogPosts.map((post) => (
              <SplitCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                color={post.color}
                image={post.thumbnail}
                eyebrow={post.category}
                title={post.title}
                description={post.description}
                className="sm:h-56"
                meta={
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
