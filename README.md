# OnBoostify

Marketing muscle for your launches. Publish once, turn it into platform-native content, reach more people.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Auth, Postgres, Row Level Security) · Lucide React

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project, then copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Project Settings → API.
   - `SUPABASE_SERVICE_ROLE_KEY` — same page. Server-only, never expose to the client.
   - `ENCRYPTION_SECRET` — generate with `openssl rand -hex 32`. Used to encrypt OAuth tokens and BYOK AI keys at rest.
   - `X_CLIENT_ID` / `X_CLIENT_SECRET`, `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` — optional, only needed to enable connecting those platforms.

3. Run the database migrations in `supabase/migrations/` against your project, in order (via the SQL editor in the Supabase dashboard, or the Supabase CLI: `supabase db push`).

4. In the Supabase dashboard, enable the Google provider under Authentication → Providers if you want "Continue with Google" to work, and set the redirect URL to `<your-site-url>/auth/callback`.

5. Start the dev server:

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript, no emit
- `npm run format` — Prettier

## Architecture notes

- **Platform integrations** (`src/lib/platforms/`): one adapter per platform behind a shared `PlatformProvider` interface. X and LinkedIn use OAuth 2.0 and support publishing through their APIs. Medium uses a user-supplied integration token (Medium stopped issuing new ones after 2023, so this only works for accounts that already have one). Substack has no public API — connecting it just stores the newsletter URL for backlink attribution and export formatting. Capabilities that a platform's API doesn't support are marked `false` in its definition and surfaced in the UI rather than faked.
- **AI providers** (`src/lib/ai/`): BYOK via OpenAI, Anthropic, or OpenRouter behind a shared `AIProvider` interface. Keys are encrypted with AES-256-GCM (`src/lib/crypto.ts`) and only decrypted server-side.
- **Database** (`supabase/migrations/`): hand-written SQL migrations with Row Level Security on every table. `src/types/database.ts` is a hand-authored type matching the schema — regenerate it with the Supabase CLI (`supabase gen types typescript`) if you add the CLI to this project later.
- **Scheduling**: scheduling a post writes a `scheduled_posts` row and marks the post `scheduled`. There's no background worker in this codebase to actually fire those at their scheduled time yet — that needs a cron/queue (e.g. Supabase Cron, QStash, or a Vercel Cron Job calling a route handler that publishes anything due).

## What's stubbed vs. real

Everything in Accounts, Create, Workflows, Posts, and Settings talks to a real Supabase database and, where credentials are configured, real platform/AI provider APIs — there's no mocked data. The two things that need infrastructure beyond this codebase to be fully live:

- **X and LinkedIn OAuth** need an app registered with each platform (client ID/secret in `.env.local`) before "Connect" does anything.
- **Scheduled publishing** needs the worker described above; without it, scheduled posts sit in `scheduled_posts` until something publishes them.
