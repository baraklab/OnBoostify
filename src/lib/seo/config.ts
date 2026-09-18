export const siteConfig = {
  name: "OnBoostify",
  tagline: "Marketing muscle for your products.",
  description:
    "OnBoostify turns one post into platform-native content for X, LinkedIn, Medium, and Substack, and generates backlinks for every launch.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://onboostify.com",
  ogImage: "/og/home.png",
  twitterHandle: "@baraklabs",
  keywords: [
    "product launch marketing",
    "cross-posting tool",
    "content repurposing",
    "social media automation",
    "Product Hunt launch",
    "backlink generation",
    "X to LinkedIn",
    "content distribution",
  ],
  company: "Baraklabs",
  contactEmail: "info@baraklabs.com",
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
