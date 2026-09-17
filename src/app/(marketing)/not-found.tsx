import type { Metadata } from "next";
import { NotFoundContent } from "@/components/marketing/not-found-content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has moved.",
  path: "/404",
  noIndex: true,
});

export default function MarketingNotFound() {
  return <NotFoundContent />;
}
