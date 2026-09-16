import type { Metadata } from "next";
import { siteConfig } from "./config";

interface PageMetadataInput {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

/**
 * Builds consistent metadata (title, description, canonical, OG, Twitter)
 * for a page. Every public route should call this rather than hand-rolling
 * a Metadata object, so titles/OG/canonicals stay consistent site-wide.
 */
export function pageMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const ogImage = image
    ? new URL(image, siteConfig.url).toString()
    : new URL(`/api/og?title=${encodeURIComponent(title)}`, siteConfig.url).toString();
  const fullTitle = path === "/" ? title : `${title} · ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_US",
      type,
      publishedTime,
      modifiedTime,
      authors,
    } as Metadata["openGraph"],
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      site: siteConfig.twitterHandle,
    },
  };
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}
