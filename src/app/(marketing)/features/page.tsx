import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { WorkflowMap } from "@/components/marketing/workflow-map";
import { SplitCard } from "@/components/marketing/split-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { FEATURE_LIST } from "@/lib/features-data";

export const metadata: Metadata = pageMetadata({
  title: "Features",
  description:
    "Multi-account platform connections, an AI content transformation engine, BYOK, visual workflows, and auto-generated backlinks — how OnBoostify turns one post into a full launch push.",
  path: "/features",
});

const CTA_VARIANTS = [
  { label: "Read more", color: "#4f46e5" },
  { label: "Know more", color: "#0284c7" },
  { label: "Explore the feature", color: "#059669" },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <p className="text-eyebrow">Features</p>
          <h1 className="font-heading mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything a launch needs, without the manual rewriting.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            OnBoostify is built around one idea: you write it once, and the platform adapts it —
            it doesn&apos;t duplicate it.
          </p>
        </div>
      </section>

      <section id="integrations" className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div className="flex flex-col gap-6">
            {FEATURE_LIST.map((feature, index) => {
              const variant = CTA_VARIANTS[index % CTA_VARIANTS.length];
              return (
                <SplitCard
                  key={feature.slug}
                  href={`/features/${feature.slug}`}
                  color={feature.color}
                  title={feature.title}
                  description={feature.description}
                  cta={variant}
                  wholeCardLink={false}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <SectionHeading
            eyebrow="How it flows"
            title="Pick a source. Pick destinations. Review, then publish."
            description="A workflow is just a source account, one or more destination platforms, and an approval step in between."
          />
          <div className="mt-10">
            <WorkflowMap />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            See it work on your next launch.
          </h2>
          <Button size="lg" className="mt-7" asChild>
            <Link href="/login?mode=signup">
              Get started for free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
