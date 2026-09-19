import { blogPosts } from "@/lib/blog/posts";
import { faqs } from "@/lib/faq";
import { FEATURE_LIST } from "@/lib/features-data";
import { siteConfig } from "@/lib/seo/config";

/**
 * llms-full.txt: the same site map as llms.txt, but with the substantive
 * copy (features, FAQs, blog summaries) inlined so an answer engine can
 * quote accurate, current facts without crawling every page.
 */
export async function GET() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const lines = [
    `# ${siteConfig.name} — ${siteConfig.tagline}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `Website: ${siteConfig.url}`,
    `Built by: ${siteConfig.company} (${siteConfig.contactEmail})`,
    "",
    "## Features",
    "",
    ...FEATURE_LIST.flatMap((feature) => [
      `### ${feature.title}`,
      `URL: ${siteConfig.url}/features/${feature.slug}`,
      "",
      feature.description,
      "",
      ...(feature.faq ?? []).flatMap((item) => [`Q: ${item.question}`, `A: ${item.answer}`, ""]),
    ]),
    "## Frequently asked questions",
    "",
    ...faqs.flatMap((item) => [`Q: ${item.question}`, `A: ${item.answer}`, ""]),
    "## Blog",
    "",
    ...sortedPosts.flatMap((post) => [
      `### ${post.title}`,
      `URL: ${siteConfig.url}/blog/${post.slug}`,
      `Published: ${post.date}`,
      "",
      post.description,
      "",
    ]),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
