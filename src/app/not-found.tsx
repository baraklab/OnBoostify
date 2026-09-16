import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Rocket, Sparkles, MapPinOff } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has moved.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            className="nf-blob pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
            <div className="relative flex h-40 w-40 items-center justify-center" aria-hidden="true">
              <Compass className="nf-spin-slow absolute h-40 w-40 text-border" strokeWidth={1} />
              <Rocket className="nf-float relative h-16 w-16 -rotate-45 text-accent" strokeWidth={1.5} />
              <Sparkles className="nf-star absolute -right-2 top-2 h-5 w-5 text-block-amber-fg" />
              <Sparkles
                className="nf-star absolute -left-3 bottom-4 h-4 w-4 text-block-sky-fg"
                style={{ animationDelay: "1s" }}
              />
              <MapPinOff className="nf-drift absolute -bottom-2 -right-4 h-6 w-6 text-block-rose-fg" />
            </div>

            <p className="text-eyebrow mt-8">Error 404</p>
            <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              This page got lost mid-launch
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              We couldn&apos;t find the page you were looking for. It may have been moved, renamed,
              or never existed in this timeline.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/">Back to home</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">Read the blog</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
