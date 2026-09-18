export interface FeatureFaqItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  slug: string;
  title: string;
  description: string;
  color: string;
  body: string[];
  faq?: FeatureFaqItem[];
  thumbnail?: string;
}

export const FEATURE_LIST: FeatureItem[] = [
  {
    slug: "content-transformation-engine",
    title: "Content transformation engine",
    description:
      "Write once. OnBoostify rewrites it into a platform-native version for each destination — a LinkedIn post, a Medium article with headings, or a Substack newsletter — without just copy-pasting the same text.",
    color: "#4f46e5",
    thumbnail: "/images/features/content-transformation-engine/one-idea-many-platforms-og.png",
    body: [
      "Every platform rewards a different shape of writing. X wants a tight hook. LinkedIn wants context and a personal angle. Medium wants structure and depth. Substack wants a conversational newsletter voice. Posting the same paragraph everywhere ignores all of that, and readers can tell — see [how to automatically post from X and LinkedIn to multiple platforms](/blog/how-to-automatically-post-from-x-linkedin-to-multiple-platforms) for a step-by-step walkthrough.",
      "The transformation engine takes your source post and generates a version tailored to each destination's format and length, while keeping the source as the single source of truth — it doesn't invent facts, numbers, or quotes that weren't in the original.",
      "Every generated version shows up in the composer as an editable draft. Nothing publishes until you've reviewed it, and any manual edits you make are saved back before the post goes out.",
    ],
    faq: [
      {
        question: "How do I turn one blog post into different social media posts automatically?",
        answer:
          "Add the blog post as your source and generate a version for each destination — the engine restructures it into a shorter, platform-shaped post instead of you manually excerpting it by hand.",
      },
      {
        question: "Does AI content repurposing end up sounding generic or robotic?",
        answer:
          "It shouldn't, if it's using your saved content profile (tone, audience, brand voice) on every generation. Without that context, yes — generic prompts produce generic output, which is why the profile step matters.",
      },
      {
        question: "Will the rewritten version add facts or numbers I didn't write?",
        answer:
          "No — the source post stays the single source of truth. The engine restructures length, tone, and format, but it isn't supposed to invent facts, numbers, or quotes that weren't in the original.",
      },
      {
        question: "Can I edit the AI-generated version before it goes out?",
        answer:
          "Yes. Every generated version lands in the composer as an editable draft — nothing publishes until you've reviewed and, if needed, changed it.",
      },
    ],
  },
  {
    slug: "content-profiles",
    title: "Content profiles",
    description:
      "Set your tone, audience, brand voice, formality, and words to avoid once. Save it as a reusable profile so every generated post sounds like you, not a generic AI voice.",
    color: "#0284c7",
    thumbnail: "/images/features/content-profiles/a-profile-your-voice-everywhere-og.png",
    body: [
      "A content profile is a saved configuration — tone, audience, brand voice, formality, preferred CTA style, and specific words or topics to avoid — that gets applied automatically whenever OnBoostify generates a post on your behalf.",
      "Instead of re-explaining your voice to the AI every time you write, you set it up once in Settings → Content Preferences and pick which profile to use per post or per workflow. You can save more than one profile if you write in different voices for different accounts.",
      "This is also where the words-to-avoid and topics-to-avoid lists live, so generated content stays on-brand without you having to catch it in every review.",
    ],
    faq: [
      {
        question: "How do I make AI-generated posts sound like me instead of generic AI?",
        answer:
          "Set your tone, audience, brand voice, and formality once as a content profile, then apply it to every generation. That saved context is what stops output from reading like generic AI copy.",
      },
      {
        question: "Can I use different tones for different accounts or platforms?",
        answer:
          "Yes — you can save more than one profile and pick which one to use per post or per workflow, so a company account and a personal account can sound different on purpose.",
      },
      {
        question: "How do I stop AI from using certain words or phrases in my posts?",
        answer:
          "Add them to the words-to-avoid or topics-to-avoid list on your content profile. It's applied automatically on every generation instead of you catching it manually in review.",
      },
      {
        question: "Do I have to re-explain my brand voice every time I generate a post?",
        answer:
          "No. Set it up once in Settings → Content Preferences and every generation that uses that profile applies it automatically.",
      },
    ],
  },
  {
    slug: "bring-your-own-ai-key",
    title: "Bring your own AI key",
    description:
      "Connect OpenAI, Anthropic, or OpenRouter with your own API key. Keys are encrypted at rest and never touch the browser. Pick a default provider and model per profile.",
    color: "#d97706",
    thumbnail: "/images/features/bring-your-own-ai-key/use-your-own-ai-key-og.png",
    body: [
      "OnBoostify doesn't resell AI tokens. You connect your own OpenAI, Anthropic, or OpenRouter API key under Settings → AI Providers, choose a default model, and every generation in the product runs on that key directly.",
      "Keys are encrypted with AES-256-GCM before they're stored, and are only decrypted server-side at the moment a request needs to be made — the raw key is never sent back to your browser. Settings only ever shows a masked version.",
      "You can test a connection before saving it, switch providers or models at any time, and mark one provider as the default that new workflows pick up automatically.",
    ],
    faq: [
      {
        question: "Is it cheaper to use my own OpenAI API key instead of a SaaS AI subscription?",
        answer:
          "Usually yes for regular use, since you pay your provider directly at their rates instead of a marked-up token bundle. It also means your cost scales with your own usage, not a fixed tier.",
      },
      {
        question: "Is it safe to give a third-party app my OpenAI or Anthropic API key?",
        answer:
          "It's safe when the key is encrypted at rest and only decrypted server-side at the moment a request is made — that's how it's handled here. The raw key is never sent back to your browser, and settings only ever show a masked version.",
      },
      {
        question: "Can I use Claude or Anthropic instead of OpenAI?",
        answer:
          "Yes — OpenAI, Anthropic, and OpenRouter are all supported. You pick a default provider and model, and can switch at any time.",
      },
      {
        question: "What happens if I switch AI providers later?",
        answer:
          "Nothing breaks — you can add a new key, test the connection, and mark it as the default. New generations pick up the new provider; nothing about your existing content changes.",
      },
    ],
  },
  {
    slug: "multiple-accounts-per-platform",
    title: "Multiple accounts per platform",
    description:
      "Connect several X accounts, a personal LinkedIn profile alongside a company page, or more than one Medium publication — and choose the exact source and destination account per workflow.",
    color: "#059669",
    thumbnail: "/images/features/multiple-accounts-per-platform/manage-multiple-accounts-og.png",
    body: [
      "Most people running a launch aren't posting from a single account. You might have a personal X account and a product account, a personal LinkedIn profile and a company page, or more than one Medium publication.",
      "OnBoostify's account model is built around this from the ground up: connect as many accounts per platform as you need, and pick the exact source and destination account when you create a post or set up a workflow — nothing assumes you only have one.",
      "Each connected account shows its own connection status, last sync time, and a reconnect flow if a token expires, so you always know which accounts are actually ready to publish to.",
    ],
    faq: [
      {
        question: "Can I connect two LinkedIn accounts to the same tool?",
        answer:
          "Yes — you can connect as many accounts per platform as you need, including more than one LinkedIn profile or page.",
      },
      {
        question: "How do I post from my personal account and my company page separately?",
        answer:
          "Connect both, then pick the exact source and destination account per post or workflow — nothing assumes you only have one account per platform.",
      },
      {
        question: "Can I manage multiple X or Medium accounts from one dashboard?",
        answer:
          "Yes, for both. Multiple X accounts and more than one Medium publication are supported the same way as multiple LinkedIn accounts.",
      },
      {
        question: "What happens if one of my connected accounts' tokens expires?",
        answer:
          "Each connected account shows its own connection status and last sync time, with a reconnect flow you can run whenever a token expires — the other connected accounts keep working normally.",
      },
    ],
  },
  {
    slug: "auto-generated-backlinks",
    title: "Auto-generated backlinks",
    description:
      "Generated posts can link back to your website, launch page, or GitHub repo, with anchor text, canonical/destination URLs, and UTM parameters you control.",
    color: "#db2777",
    thumbnail: "/images/features/auto-generated-backlinks/turn-content-into-real-reach-og.png",
    body: [
      "Turning one launch into a Medium article, a Substack post, and a LinkedIn post that all link back to your product is genuinely useful — as long as the link doesn't turn the post into keyword-stuffed junk.",
      "When you add a backlink to a post, you set the canonical URL and destination URL explicitly, write your own anchor text, and optionally add UTM parameters — nothing is auto-guessed or generated for you. Read more on how we approach this in [Backlinks without being spammy](/blog/backlinks-without-being-spammy).",
      "Every generated post is written to stand on its own as something worth reading first. The link is secondary to that — if a post wouldn't hold up without the link in it, that's a failure of the generation, not an acceptable trade-off.",
    ],
    faq: [
      {
        question: "Do backlinks from social posts actually help SEO?",
        answer:
          "A backlink from a Medium article or Substack post can help the way any external link does, provided the surrounding content is genuinely worth reading — the link itself doesn't do the work if the post around it is thin.",
      },
      {
        question: "Can I choose exactly where a generated post links to?",
        answer:
          "Yes. You set the canonical URL and destination URL explicitly, and write your own anchor text — nothing is auto-guessed.",
      },
      {
        question: "Is it spammy to add a backlink to every generated post?",
        answer:
          "It's spammy when the link is the only reason the post exists. It isn't when every generated post is a full, readable piece of writing first, with the link as a secondary, natural reference.",
      },
      {
        question: "Do UTM parameters on a backlink affect its SEO value?",
        answer:
          "No — UTMs are optional and scoped per post purely for your own click tracking. They don't change the canonical link or its SEO value.",
      },
    ],
  },
  {
    slug: "workflows",
    title: "Workflows",
    description:
      "Chain a source, AI refinement, an approval step, and one or more destinations into a reusable workflow — manual approval or automatic, immediate or scheduled.",
    color: "#9333ea",
    thumbnail: "/images/features/workflows/build-once-post-on-autopilot-og.png",
    body: [
      "A workflow is a saved pipeline: pick a source (an account or input type), one or more destination platforms and accounts, a content profile for the AI rewrite, and an approval mode — manual or automatic.",
      "Once it's set up, running the workflow again doesn't require reconfiguring anything. New source content flows through the same destinations with the same tone and the same approval step every time.",
      "You choose whether each workflow publishes immediately, on a schedule, or only ever creates drafts for you to publish by hand — the workflow doesn't decide that for you. See [pricing](/pricing) for plan limits on active workflows.",
    ],
    faq: [
      {
        question: "What's the difference between a workflow and just scheduling a post?",
        answer:
          "Scheduling a post sets a time for one piece of content. A workflow saves the whole pipeline — source, destinations, content profile, and approval mode — so the next update runs through the same setup without you rebuilding it.",
      },
      {
        question: "Can I reuse the same posting setup every week without rebuilding it?",
        answer:
          "Yes — that's what a saved workflow is for. New source content flows through the same destinations, tone, and approval step every time you run it.",
      },
      {
        question: "Can a workflow auto-publish without me approving each post?",
        answer:
          "Only if you explicitly turn on automatic approval for that workflow. By default, workflows require manual approval before anything goes out.",
      },
      {
        question: "Can I schedule posts for later instead of publishing immediately?",
        answer:
          "Yes — each workflow can publish immediately, on a schedule, or only create drafts for you to publish by hand; you decide per workflow.",
      },
    ],
  },
  {
    slug: "manual-approval",
    title: "You approve everything",
    description:
      "Nothing publishes without your review unless you explicitly turn on automatic approval. Every generated draft is fully editable first.",
    color: "#4f46e5",
    thumbnail: "/images/features/manual-approval/you-approve-everything-og.png",
    body: [
      "AI-generated content is a draft, not a finished post. By default, every workflow requires manual approval — nothing goes out to a connected account until you've reviewed and, if needed, edited it.",
      "Automatic approval is available for workflows where you've already built enough trust in the output, but it's an explicit opt-in per workflow, not a default behavior.",
      "This applies everywhere content is generated in the product, not just workflows — the composer, quick edits, and refinements all produce editable drafts first.",
    ],
    faq: [
      {
        question: "Will AI publish posts to my accounts without me checking them first?",
        answer:
          "No, not by default. Every workflow requires manual approval unless you explicitly turn on automatic approval — nothing goes out until you've reviewed it.",
      },
      {
        question: "Can I turn off manual approval if I trust the AI output?",
        answer:
          "Yes — automatic approval is available per workflow once you've built enough trust in the output, but it's an explicit opt-in, never a default.",
      },
      {
        question: "What if I want to edit a draft before it goes live?",
        answer:
          "That's the normal flow — every generated draft is fully editable in the composer before it publishes, whether it came from a workflow, a quick edit, or a manual refinement.",
      },
    ],
  },
  {
    slug: "quick-edits",
    title: "Quick edits, not full rewrites",
    description:
      "Shorten, expand, improve the hook, add or remove a CTA, or shift tone with one click — instead of regenerating the whole post from scratch.",
    color: "#0284c7",
    thumbnail: "/images/features/quick-edits/small-changes-big-impact-og.png",
    body: [
      "Most of the time, a generated draft doesn't need a full regeneration — it needs one specific change. Maybe the hook is weak, maybe it's too long, maybe it needs a call to action it doesn't have yet.",
      "The composer's quick-edit actions — shorten, expand, improve the hook, add or remove a CTA, make it more technical or more conversational, shift the tone — make a single targeted change and leave the rest of the post alone.",
      "Each edit is applied on top of your current draft, including any manual changes you've already made, so you never lose work by asking for one more adjustment.",
    ],
    faq: [
      {
        question: "How do I make a generated post shorter without rewriting it from scratch?",
        answer:
          "Use the shorten quick edit — it trims the current draft in place instead of regenerating the whole post.",
      },
      {
        question: "Can I add a call-to-action to an existing draft with one click?",
        answer:
          "Yes — add or remove a CTA is one of the quick-edit actions, applied on top of your current draft.",
      },
      {
        question: "Will a quick edit undo my manual changes to a draft?",
        answer:
          "No. Quick edits apply on top of your current draft, including any manual changes you've already made, so you don't lose work by asking for one more adjustment.",
      },
    ],
  },
];

export function getFeature(slug: string): FeatureItem | undefined {
  return FEATURE_LIST.find((f) => f.slug === slug);
}
