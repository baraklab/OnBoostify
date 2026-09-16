export interface FeatureItem {
  slug: string;
  title: string;
  description: string;
  color: string;
  body: string[];
}

export const FEATURE_LIST: FeatureItem[] = [
  {
    slug: "content-transformation-engine",
    title: "Content transformation engine",
    description:
      "Write once. OnBoostify rewrites it into a platform-native version for each destination — a LinkedIn post, a Medium article with headings, or a Substack newsletter — without just copy-pasting the same text.",
    color: "#4f46e5",
    body: [
      "Every platform rewards a different shape of writing. X wants a tight hook. LinkedIn wants context and a personal angle. Medium wants structure and depth. Substack wants a conversational newsletter voice. Posting the same paragraph everywhere ignores all of that, and readers can tell.",
      "The transformation engine takes your source post and generates a version tailored to each destination's format and length, while keeping the source as the single source of truth — it doesn't invent facts, numbers, or quotes that weren't in the original.",
      "Every generated version shows up in the composer as an editable draft. Nothing publishes until you've reviewed it, and any manual edits you make are saved back before the post goes out.",
    ],
  },
  {
    slug: "content-profiles",
    title: "Content profiles",
    description:
      "Set your tone, audience, brand voice, formality, and words to avoid once. Save it as a reusable profile so every generated post sounds like you, not a generic AI voice.",
    color: "#0284c7",
    body: [
      "A content profile is a saved configuration — tone, audience, brand voice, formality, preferred CTA style, and specific words or topics to avoid — that gets applied automatically whenever OnBoostify generates a post on your behalf.",
      "Instead of re-explaining your voice to the AI every time you write, you set it up once in Settings → Content Preferences and pick which profile to use per post or per workflow. You can save more than one profile if you write in different voices for different accounts.",
      "This is also where the words-to-avoid and topics-to-avoid lists live, so generated content stays on-brand without you having to catch it in every review.",
    ],
  },
  {
    slug: "bring-your-own-ai-key",
    title: "Bring your own AI key",
    description:
      "Connect OpenAI, Anthropic, or OpenRouter with your own API key. Keys are encrypted at rest and never touch the browser. Pick a default provider and model per profile.",
    color: "#d97706",
    body: [
      "OnBoostify doesn't resell AI tokens. You connect your own OpenAI, Anthropic, or OpenRouter API key under Settings → AI Providers, choose a default model, and every generation in the product runs on that key directly.",
      "Keys are encrypted with AES-256-GCM before they're stored, and are only decrypted server-side at the moment a request needs to be made — the raw key is never sent back to your browser. Settings only ever shows a masked version.",
      "You can test a connection before saving it, switch providers or models at any time, and mark one provider as the default that new workflows pick up automatically.",
    ],
  },
  {
    slug: "multiple-accounts-per-platform",
    title: "Multiple accounts per platform",
    description:
      "Connect several X accounts, a personal LinkedIn profile alongside a company page, or more than one Medium publication — and choose the exact source and destination account per workflow.",
    color: "#059669",
    body: [
      "Most people running a launch aren't posting from a single account. You might have a personal X account and a product account, a personal LinkedIn profile and a company page, or more than one Medium publication.",
      "OnBoostify's account model is built around this from the ground up: connect as many accounts per platform as you need, and pick the exact source and destination account when you create a post or set up a workflow — nothing assumes you only have one.",
      "Each connected account shows its own connection status, last sync time, and a reconnect flow if a token expires, so you always know which accounts are actually ready to publish to.",
    ],
  },
  {
    slug: "auto-generated-backlinks",
    title: "Auto-generated backlinks",
    description:
      "Generated posts can link back to your website, launch page, or GitHub repo, with anchor text, canonical/destination URLs, and UTM parameters you control.",
    color: "#db2777",
    body: [
      "Turning one launch into a Medium article, a Substack post, and a LinkedIn post that all link back to your product is genuinely useful — as long as the link doesn't turn the post into keyword-stuffed junk.",
      "When you add a backlink to a post, you set the canonical URL and destination URL explicitly, write your own anchor text, and optionally add UTM parameters — nothing is auto-guessed or generated for you.",
      "Every generated post is written to stand on its own as something worth reading first. The link is secondary to that — if a post wouldn't hold up without the link in it, that's a failure of the generation, not an acceptable trade-off.",
    ],
  },
  {
    slug: "workflows",
    title: "Workflows",
    description:
      "Chain a source, AI refinement, an approval step, and one or more destinations into a reusable workflow — manual approval or automatic, immediate or scheduled.",
    color: "#9333ea",
    body: [
      "A workflow is a saved pipeline: pick a source (an account or input type), one or more destination platforms and accounts, a content profile for the AI rewrite, and an approval mode — manual or automatic.",
      "Once it's set up, running the workflow again doesn't require reconfiguring anything. New source content flows through the same destinations with the same tone and the same approval step every time.",
      "You choose whether each workflow publishes immediately, on a schedule, or only ever creates drafts for you to publish by hand — the workflow doesn't decide that for you.",
    ],
  },
  {
    slug: "manual-approval",
    title: "You approve everything",
    description:
      "Nothing publishes without your review unless you explicitly turn on automatic approval. Every generated draft is fully editable first.",
    color: "#4f46e5",
    body: [
      "AI-generated content is a draft, not a finished post. By default, every workflow requires manual approval — nothing goes out to a connected account until you've reviewed and, if needed, edited it.",
      "Automatic approval is available for workflows where you've already built enough trust in the output, but it's an explicit opt-in per workflow, not a default behavior.",
      "This applies everywhere content is generated in the product, not just workflows — the composer, quick edits, and refinements all produce editable drafts first.",
    ],
  },
  {
    slug: "quick-edits",
    title: "Quick edits, not full rewrites",
    description:
      "Shorten, expand, improve the hook, add or remove a CTA, or shift tone with one click — instead of regenerating the whole post from scratch.",
    color: "#0284c7",
    body: [
      "Most of the time, a generated draft doesn't need a full regeneration — it needs one specific change. Maybe the hook is weak, maybe it's too long, maybe it needs a call to action it doesn't have yet.",
      "The composer's quick-edit actions — shorten, expand, improve the hook, add or remove a CTA, make it more technical or more conversational, shift the tone — make a single targeted change and leave the rest of the post alone.",
      "Each edit is applied on top of your current draft, including any manual changes you've already made, so you never lose work by asking for one more adjustment.",
    ],
  },
];

export function getFeature(slug: string): FeatureItem | undefined {
  return FEATURE_LIST.find((f) => f.slug === slug);
}
