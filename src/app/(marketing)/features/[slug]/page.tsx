import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, TrendingUp, Wand2, Code2, Megaphone, FileText } from "lucide-react";
import { FEATURE_LIST, getFeature } from "@/lib/features-data";
import { blogPosts } from "@/lib/blog/posts";
import { circularRelated, relatedByHash } from "@/lib/related";
import { PromoCard } from "@/components/marketing/promo-card";
import { PostSidebar } from "@/components/marketing/post-sidebar";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { frameGradient } from "@/lib/color";
import { renderInlineMarkdown } from "@/lib/inline-markdown";

const blogCategoryIcons: Record<string, typeof FileText> = {
  Growth: TrendingUp,
  Product: Wand2,
  Engineering: Code2,
  Marketing: Megaphone,
};

const featureIcon = Wand2;

export function generateStaticParams() {
  return FEATURE_LIST.map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return {};

  return pageMetadata({
    title: feature.title,
    description: feature.description,
    path: `/features/${feature.slug}`,
    eyebrow: "Feature",
  });
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const currentIndex = FEATURE_LIST.findIndex((f) => f.slug === feature.slug);
  const relatedFeatures = circularRelated(FEATURE_LIST, currentIndex, 2);
  const relatedPosts = relatedByHash(blogPosts, feature.slug, 2);

  return (
    <article className="border-b border-border">
      <JsonLd
        data={[
          webPageJsonLd({
            title: feature.title,
            description: feature.description,
            path: `/features/${feature.slug}`,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Features", path: "/features" },
            { name: feature.title, path: `/features/${feature.slug}` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <Link
            href="/features"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to features
          </Link>

          <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {feature.title}
          </h1>
        </div>

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 max-w-3xl">
            <div
              className="flex aspect-[16/7] w-full items-center justify-center overflow-hidden rounded-lg"
              style={{ backgroundImage: frameGradient(feature.color) }}
            >
              <Wand2 className="size-10 text-white/60" aria-hidden="true" />
            </div>

            <p className="mt-6 text-lg font-medium leading-relaxed text-foreground">
              {feature.description}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {feature.body.map((paragraph, index) => (
                <p key={index} className="text-[15px] leading-relaxed text-muted-foreground">
                  {renderInlineMarkdown(paragraph)}
                </p>
              ))}
            </div>

            {relatedFeatures.length > 0 && (
              <div className="mt-16 border-t border-border pt-8">
                <div className="flex items-baseline justify-between">
                  <p className="text-eyebrow">Related features</p>
                  <Link href="/features" className="text-eyebrow hover:text-foreground">
                    View all features
                  </Link>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedFeatures.map((relatedFeature) => (
                    <PromoCard
                      key={relatedFeature.slug}
                      href={`/features/${relatedFeature.slug}`}
                      color={relatedFeature.color}
                      icon={featureIcon}
                      eyebrow="Feature"
                      title={relatedFeature.title}
                      description={relatedFeature.description}
                    />
                  ))}
                </div>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className="mt-12 border-t border-border pt-8">
                <div className="flex items-baseline justify-between">
                  <p className="text-eyebrow">Read our blogs</p>
                  <Link href="/blog" className="text-eyebrow hover:text-foreground">
                    View all posts
                  </Link>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((post) => (
                    <PromoCard
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      color={post.color}
                      icon={blogCategoryIcons[post.category] ?? FileText}
                      image={post.thumbnail}
                      eyebrow={post.category}
                      title={post.title}
                      description={post.description}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <PostSidebar />
        </div>
      </div>
    </article>
  );
}
