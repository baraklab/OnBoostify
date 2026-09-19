import { statSync } from "node:fs";
import path from "node:path";
import { blogPosts } from "@/lib/blog/posts";
import { siteConfig } from "@/lib/seo/config";

function fileSize(publicPath: string): number {
  try {
    return statSync(path.join(process.cwd(), "public", publicPath)).size;
  } catch {
    return 0;
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const items = sortedPosts
    .map((post) => {
      const url = `${siteConfig.url}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const image = post.thumbnail ? `${siteConfig.url}${post.thumbnail}` : null;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <dc:creator>${escapeXml(post.author)}</dc:creator>
      <category>${escapeXml(post.category)}</category>${post.tags.map((tag) => `
      <category>${escapeXml(tag)}</category>`).join("")}${image ? `
      <enclosure url="${escapeXml(image)}" type="image/png" length="${fileSize(post.thumbnail ?? "")}" />` : ""}
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.name)} Blog</title>
    <link>${siteConfig.url}/blog</link>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date(sortedPosts[0]?.updatedAt ?? sortedPosts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
