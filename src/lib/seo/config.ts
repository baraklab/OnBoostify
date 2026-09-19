export const siteConfig = {
  name: "Oyeboost",
  tagline: "Marketing muscle for your products.",
  description:
    "Oyeboost turns one post into platform-native content for X, LinkedIn, Medium, and Substack, and generates backlinks for every launch.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://oyeboost.com",
  locale: "en_US",
  twitterHandle: "@baraklabs",
  keywords: [
    "Oyeboost",
    "product launch marketing",
    "cross-posting tool",
    "content repurposing",
    "social media automation",
    "Product Hunt launch",
    "backlink generation",
    "X to LinkedIn",
    "content distribution",
    "publish once, post everywhere",
    "AI content repurposing",
    "bring your own AI key",
  ],
  company: "Baraklabs",
  contactEmail: "info@oyeboost.com",
  links: {
    x: "https://x.com/baraklabs",
    linkedin: "https://www.linkedin.com/company/baraklabs",
    youtube: "https://www.youtube.com/@baraklabs",
  },
  stats: {
    users: "10,000+",
    influencers: "500+",
  },
} as const;

export type SiteConfig = typeof siteConfig;
