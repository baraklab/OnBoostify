-- Replaces Supabase Auth (auth.users / GoTrue) with a hand-rolled auth system served by
-- Supabase Edge Functions (supabase/functions/auth-*), matching the pattern used in the
-- doculigent-website repo: bigint identity, bcrypt password hashes, HMAC JWTs signed by
-- our own JWT_SECRET, and refresh-token sessions in user_sessions. auth.uid() is never
-- populated for these tokens (they aren't Supabase session JWTs), so every table below
-- drops its old `auth.uid() = user_id` policies — access now goes exclusively through the
-- edge functions' service_role client, which bypasses RLS and checks ownership in code.
-- Assumes no real rows exist yet in the tables being rebuilt (pre-launch); this is
-- destructive to any existing auth.users-linked data.

-- =========================================================================
-- Drop the auth.users-triggered profile bootstrap — profiles are now created
-- explicitly by the auth-signup function.
-- =========================================================================
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- =========================================================================
-- Drop every table that references auth.users(id), in dependency order.
-- =========================================================================
drop table if exists analytics cascade;
drop table if exists backlinks cascade;
drop table if exists published_posts cascade;
drop table if exists scheduled_posts cascade;
drop table if exists generated_posts cascade;
drop table if exists source_posts cascade;
drop table if exists workflow_steps cascade;
drop table if exists workflows cascade;
drop table if exists ai_providers cascade;
drop table if exists content_profiles cascade;
drop table if exists connected_accounts cascade;
drop table if exists network_profiles cascade;
drop table if exists profiles cascade;

-- =========================================================================
-- users, user_sessions, password_reset_codes — same shape as doculigent-website's
-- supabase/functions/_shared/* tables. No RLS: these are only ever touched by edge
-- functions using the service_role client (see _shared/supabaseClient.ts).
-- =========================================================================
create table public.users (
    id bigint generated always as identity primary key,
    email_id varchar(100) unique not null,
    password_hash text,
    otp varchar(10),
    otp_expires_at timestamptz,
    otp_attempts integer not null default 0,
    verification_token_hash varchar(255),
    first_name varchar(100),
    last_name varchar(100),
    verified boolean default false,
    active boolean default true,
    created_at timestamptz default now()
);

create unique index users_verification_token_hash_idx
  on public.users (verification_token_hash)
  where verification_token_hash is not null;

create table public.user_sessions (
    id bigint generated always as identity primary key,
    user_id bigint not null references public.users(id) on delete cascade,
    refresh_token_hash varchar(255) not null,
    device_type varchar(30),
    platform varchar(20),
    app_version varchar(20),
    arch varchar(20),
    ip_address varchar(50),
    created_at timestamptz default now(),
    expires_at timestamptz not null,
    last_used_at timestamptz,
    revoked boolean default false
);

create unique index user_sessions_refresh_token_hash_idx on public.user_sessions (refresh_token_hash);
create index user_sessions_user_id_idx on public.user_sessions (user_id);

create table public.password_reset_codes (
    id bigint generated always as identity primary key,
    user_id bigint not null references public.users(id) on delete cascade,
    otp_hash varchar(255) not null,
    link_token_hash varchar(255) not null,
    expires_at timestamptz not null,
    attempts integer not null default 0,
    used boolean not null default false,
    created_at timestamptz not null default now()
);

create unique index password_reset_codes_link_token_hash_idx on public.password_reset_codes (link_token_hash);
create index password_reset_codes_user_id_idx on public.password_reset_codes (user_id);

grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;

-- =========================================================================
-- profiles — same columns as before (incl. 0004's notification_preferences),
-- now keyed off public.users instead of auth.users. RLS enabled, no policies:
-- default-deny for anon/authenticated, service_role bypasses.
-- =========================================================================
create table profiles (
  id bigint primary key references public.users(id) on delete cascade,
  full_name text,
  company_name text,
  website_url text,
  avatar_url text,
  onboarded_at timestamptz,
  notification_preferences jsonb not null default '{
    "scheduled_post_published": true,
    "workflow_failed": true,
    "weekly_summary": false
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;

-- =========================================================================
-- connected_accounts
-- =========================================================================
create table connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  platform text not null references platforms(id),
  account_type text not null check (account_type in ('profile', 'page', 'publication')),
  external_account_id text,
  display_name text not null,
  handle text,
  avatar_url text,
  encrypted_access_token text,
  encrypted_refresh_token text,
  token_expires_at timestamptz,
  status text not null default 'connected' check (status in ('connected', 'expired', 'revoked', 'error')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint connected_accounts_user_platform_external_unique unique (user_id, platform, external_account_id)
);

create index connected_accounts_user_id_idx on connected_accounts(user_id);
create index connected_accounts_platform_idx on connected_accounts(platform);

create trigger connected_accounts_set_updated_at
  before update on connected_accounts
  for each row execute function set_updated_at();

alter table connected_accounts enable row level security;

-- =========================================================================
-- content_profiles
-- =========================================================================
create table content_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  name text not null,
  tone text not null default 'founder',
  audience text not null default '',
  brand_voice text not null default '',
  length text not null default 'medium' check (length in ('short', 'medium', 'long')),
  formality text not null default 'neutral' check (formality in ('casual', 'neutral', 'formal')),
  cta_style text not null default '',
  topics_to_avoid text not null default '',
  words_to_avoid text not null default '',
  personal_context text not null default '',
  default_hashtags text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index content_profiles_user_id_idx on content_profiles(user_id);

create trigger content_profiles_set_updated_at
  before update on content_profiles
  for each row execute function set_updated_at();

alter table content_profiles enable row level security;

-- =========================================================================
-- ai_providers
-- =========================================================================
create table ai_providers (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  provider text not null check (provider in ('openai', 'anthropic', 'openrouter')),
  encrypted_api_key text not null,
  default_model text not null,
  is_default boolean not null default false,
  last_tested_at timestamptz,
  last_test_status text check (last_test_status in ('success', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create index ai_providers_user_id_idx on ai_providers(user_id);

create trigger ai_providers_set_updated_at
  before update on ai_providers
  for each row execute function set_updated_at();

alter table ai_providers enable row level security;

-- =========================================================================
-- workflows + workflow_steps
-- =========================================================================
create table workflows (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  name text not null,
  source_type text not null check (source_type in ('x_post', 'text', 'url', 'github_repo', 'product_hunt', 'blog_post')),
  source_account_id uuid references connected_accounts(id) on delete set null,
  content_profile_id uuid references content_profiles(id) on delete set null,
  approval_mode text not null default 'manual' check (approval_mode in ('manual', 'automatic')),
  publish_mode text not null default 'draft' check (publish_mode in ('immediate', 'schedule', 'draft')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workflows_user_id_idx on workflows(user_id);

create trigger workflows_set_updated_at
  before update on workflows
  for each row execute function set_updated_at();

alter table workflows enable row level security;

create table workflow_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references workflows(id) on delete cascade,
  position integer not null,
  step_type text not null check (step_type in ('generate', 'approval', 'publish')),
  target_platform text references platforms(id),
  target_account_id uuid references connected_accounts(id) on delete set null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workflow_id, position)
);

create index workflow_steps_workflow_id_idx on workflow_steps(workflow_id);

create trigger workflow_steps_set_updated_at
  before update on workflow_steps
  for each row execute function set_updated_at();

alter table workflow_steps enable row level security;

-- =========================================================================
-- source_posts
-- =========================================================================
create table source_posts (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  input_type text not null check (input_type in ('x_post', 'text', 'url', 'github_repo', 'product_hunt', 'blog_post')),
  source_account_id uuid references connected_accounts(id) on delete set null,
  title text,
  raw_content text not null,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index source_posts_user_id_idx on source_posts(user_id);

create trigger source_posts_set_updated_at
  before update on source_posts
  for each row execute function set_updated_at();

alter table source_posts enable row level security;

-- =========================================================================
-- generated_posts
-- =========================================================================
create table generated_posts (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  source_post_id uuid references source_posts(id) on delete set null,
  workflow_id uuid references workflows(id) on delete set null,
  platform text not null references platforms(id),
  account_id uuid references connected_accounts(id) on delete set null,
  content_profile_id uuid references content_profiles(id) on delete set null,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'pending_approval', 'approved', 'scheduled', 'published', 'failed')),
  ai_provider text,
  ai_model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index generated_posts_user_id_idx on generated_posts(user_id);
create index generated_posts_status_idx on generated_posts(status);

create trigger generated_posts_set_updated_at
  before update on generated_posts
  for each row execute function set_updated_at();

alter table generated_posts enable row level security;

-- =========================================================================
-- scheduled_posts
-- =========================================================================
create table scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  generated_post_id uuid not null references generated_posts(id) on delete cascade,
  account_id uuid not null references connected_accounts(id) on delete cascade,
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'canceled')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index scheduled_posts_user_id_idx on scheduled_posts(user_id);
create index scheduled_posts_scheduled_for_idx on scheduled_posts(scheduled_for);

create trigger scheduled_posts_set_updated_at
  before update on scheduled_posts
  for each row execute function set_updated_at();

alter table scheduled_posts enable row level security;

-- =========================================================================
-- published_posts
-- =========================================================================
create table published_posts (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  generated_post_id uuid not null references generated_posts(id) on delete cascade,
  account_id uuid not null references connected_accounts(id) on delete cascade,
  external_id text,
  external_url text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index published_posts_user_id_idx on published_posts(user_id);

alter table published_posts enable row level security;

-- =========================================================================
-- analytics
-- =========================================================================
create table analytics (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  published_post_id uuid not null references published_posts(id) on delete cascade,
  impressions integer not null default 0,
  engagements integer not null default 0,
  clicks integer not null default 0,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index analytics_user_id_idx on analytics(user_id);
create index analytics_published_post_id_idx on analytics(published_post_id);

alter table analytics enable row level security;

-- =========================================================================
-- backlinks
-- =========================================================================
create table backlinks (
  id uuid primary key default gen_random_uuid(),
  user_id bigint not null references public.users(id) on delete cascade,
  generated_post_id uuid references generated_posts(id) on delete set null,
  canonical_url text not null,
  destination_url text not null,
  anchor_text text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  cta_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index backlinks_user_id_idx on backlinks(user_id);

create trigger backlinks_set_updated_at
  before update on backlinks
  for each row execute function set_updated_at();

alter table backlinks enable row level security;

-- =========================================================================
-- network_profiles
-- =========================================================================
create table network_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id bigint references public.users(id) on delete cascade,
  display_name text not null,
  category text not null check (category in ('influencer', 'creator', 'community')),
  platforms text[] not null default '{}',
  audience_size integer,
  bio text,
  contact_url text,
  is_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint network_profiles_user_id_unique unique (user_id)
);

create index network_profiles_category_idx on network_profiles(category);

create trigger network_profiles_set_updated_at
  before update on network_profiles
  for each row execute function set_updated_at();

alter table network_profiles enable row level security;

-- network_profiles is still publicly browsable (visible listings) even without a Supabase
-- session — the network directory page reads it with the service_role client server-side
-- and filters is_visible = true in code, so no anon-readable policy is needed here.
