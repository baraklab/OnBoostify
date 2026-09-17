import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, TrendingUp, Wand2, Code2, Megaphone, FileText } from "lucide-react";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/lib/blog/posts";
import { FEATURE_LIST } from "@/lib/features-data";
import { relatedByHash } from "@/lib/related";
import { BlogContent } from "@/components/marketing/blog-content";
import { PromoCard } from "@/components/marketing/promo-card";
import { PostSidebar } from "@/components/marketing/post-sidebar";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils";
import { frameGradient } from "@/lib/color";

const categoryIcons: Record<string, typeof FileText> = {
  Growth: TrendingUp,
  Product: Wand2,
  Engineering: Code2,
  Marketing: Megaphone,
};

const featureIcon = Wand2;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.thumbnail,
    eyebrow: post.category,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updatedAt ?? post.date,
    authors: [post.author],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post);
  const relatedFeatures = relatedByHash(FEATURE_LIST, post.slug, 2);
  const faqBlock = post.body.find((block) => block.type === "faq");
  const hasVisibleFaq = faqBlock?.type === "faq" && faqBlock.items.length > 0;

  return (
    <article className="border-b border-border">
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
            image:
              post.thumbnail ??
              `/api/og?title=${encodeURIComponent(post.title)}&eyebrow=${encodeURIComponent(post.category)}`,
            author: post.author,
            publishedTime: post.date,
            modifiedTime: post.updatedAt ?? post.date,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          ...(hasVisibleFaq && faqBlock?.type === "faq" ? [faqJsonLd(faqBlock.items)] : []),
        ]}
      />

      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to blog
          </Link>

          <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: post.color }}
            >
              {post.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>By {post.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updatedAt && post.updatedAt !== post.date && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 max-w-3xl">
            <div
              className="aspect-[16/7] w-full overflow-hidden rounded-lg p-[2px]"
              style={{ backgroundImage: frameGradient(post.color) }}
            >
              {post.thumbnail ? (
                <div className="relative size-full overflow-hidden rounded-lg">
                  <Image src={post.thumbnail} alt={post.title} fill priority className="object-cover" />
                </div>
              ) : (
                <div className="flex size-full items-center justify-center">
                  <FileText className="size-10 text-white/60" aria-hidden="true" />
                </div>
              )}
            </div>

            <p className="mt-6 text-lg font-medium leading-relaxed text-foreground">
              {post.description}
            </p>

            <div className="mt-6">
              <BlogContent blocks={post.body} />
            </div>

            {relatedPosts.length > 0 && (
              <div className="mt-16 border-t border-border pt-8">
                <div className="flex items-baseline justify-between">
                  <p className="text-eyebrow">Related posts</p>
                  <Link href="/blog" className="text-eyebrow hover:text-foreground">
                    View all posts
                  </Link>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((relatedPost) => (
                    <PromoCard
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      color={relatedPost.color}
                      icon={categoryIcons[relatedPost.category] ?? FileText}
                      image={relatedPost.thumbnail}
                      eyebrow={relatedPost.category}
                      title={relatedPost.title}
                      description={relatedPost.description}
                    />
                  ))}
                </div>
              </div>
            )}

            {relatedFeatures.length > 0 && (
              <div className="mt-12 border-t border-border pt-8">
                <div className="flex items-baseline justify-between">
                  <p className="text-eyebrow">Read our features</p>
                  <Link href="/features" className="text-eyebrow hover:text-foreground">
                    View all features
                  </Link>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedFeatures.map((feature) => (
                    <PromoCard
                      key={feature.slug}
                      href={`/features/${feature.slug}`}
                      color={feature.color}
                      icon={featureIcon}
                      eyebrow="Feature"
                      title={feature.title}
                      description={feature.description}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <PostSidebar videoId={post.videoId} />
        </div>
      </div>
    </article>
  );
}
