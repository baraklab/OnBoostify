-- Oyeboost initial schema
-- Conventions: uuid primary keys, created_at/updated_at on every table,
-- RLS enabled everywhere, users can only read/write rows they own.

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================================================
-- profiles
-- =========================================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  website_url text,
  avatar_url text,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =========================================================================
-- platforms — lookup table so new integrations can be added with an
-- insert rather than a schema migration or code enum change.
-- =========================================================================
create table platforms (
  id text primary key,
  name text not null,
  auth_type text not null check (auth_type in ('oauth2', 'api_token', 'manual')),
  color text not null default '#14141A',
  capabilities jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger platforms_set_updated_at
  before update on platforms
  for each row execute function set_updated_at();

alter table platforms enable row level security;
create policy "platforms_select_all" on platforms for select using (true);

insert into platforms (id, name, auth_type, color, capabilities) values
  ('x', 'X', 'oauth2', '#000000', '{"connect":true,"refreshToken":true,"publish":true,"schedule":false,"analytics":true}'),
  ('linkedin', 'LinkedIn', 'oauth2', '#0A66C2', '{"connect":true,"refreshToken":false,"publish":true,"schedule":false,"analytics":false}'),
  ('medium', 'Medium', 'api_token', '#000000', '{"connect":true,"refreshToken":false,"publish":true,"schedule":false,"analytics":false}'),
  ('substack', 'Substack', 'manual', '#FF6719', '{"connect":true,"refreshToken":false,"publish":false,"schedule":false,"analytics":false}');

-- =========================================================================
-- connected_accounts — a user can connect many accounts per platform.
-- =========================================================================
create table connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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
  updated_at timestamptz not null default now()
);

create index connected_accounts_user_id_idx on connected_accounts(user_id);
create index connected_accounts_platform_idx on connected_accounts(platform);

create trigger connected_accounts_set_updated_at
  before update on connected_accounts
  for each row execute function set_updated_at();

alter table connected_accounts enable row level security;

create policy "connected_accounts_select_own" on connected_accounts for select using (auth.uid() = user_id);
create policy "connected_accounts_insert_own" on connected_accounts for insert with check (auth.uid() = user_id);
create policy "connected_accounts_update_own" on connected_accounts for update using (auth.uid() = user_id);
create policy "connected_accounts_delete_own" on connected_accounts for delete using (auth.uid() = user_id);

-- =========================================================================
-- content_profiles — reusable AI writing configuration ("brand voice").
-- =========================================================================
create table content_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

create policy "content_profiles_select_own" on content_profiles for select using (auth.uid() = user_id);
create policy "content_profiles_insert_own" on content_profiles for insert with check (auth.uid() = user_id);
create policy "content_profiles_update_own" on content_profiles for update using (auth.uid() = user_id);
create policy "content_profiles_delete_own" on content_profiles for delete using (auth.uid() = user_id);

-- =========================================================================
-- ai_providers — BYOK: a user's configured AI provider credentials.
-- =========================================================================
create table ai_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

create policy "ai_providers_select_own" on ai_providers for select using (auth.uid() = user_id);
create policy "ai_providers_insert_own" on ai_providers for insert with check (auth.uid() = user_id);
create policy "ai_providers_update_own" on ai_providers for update using (auth.uid() = user_id);
create policy "ai_providers_delete_own" on ai_providers for delete using (auth.uid() = user_id);

-- =========================================================================
-- workflows + workflow_steps
-- =========================================================================
create table workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

create policy "workflows_select_own" on workflows for select using (auth.uid() = user_id);
create policy "workflows_insert_own" on workflows for insert with check (auth.uid() = user_id);
create policy "workflows_update_own" on workflows for update using (auth.uid() = user_id);
create policy "workflows_delete_own" on workflows for delete using (auth.uid() = user_id);

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

create policy "workflow_steps_select_own" on workflow_steps for select using (
  exists (select 1 from workflows w where w.id = workflow_id and w.user_id = auth.uid())
);
create policy "workflow_steps_insert_own" on workflow_steps for insert with check (
  exists (select 1 from workflows w where w.id = workflow_id and w.user_id = auth.uid())
);
create policy "workflow_steps_update_own" on workflow_steps for update using (
  exists (select 1 from workflows w where w.id = workflow_id and w.user_id = auth.uid())
);
create policy "workflow_steps_delete_own" on workflow_steps for delete using (
  exists (select 1 from workflows w where w.id = workflow_id and w.user_id = auth.uid())
);

-- =========================================================================
-- source_posts — the original input a user brought into Oyeboost.
-- =========================================================================
create table source_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

create policy "source_posts_select_own" on source_posts for select using (auth.uid() = user_id);
create policy "source_posts_insert_own" on source_posts for insert with check (auth.uid() = user_id);
create policy "source_posts_update_own" on source_posts for update using (auth.uid() = user_id);
create policy "source_posts_delete_own" on source_posts for delete using (auth.uid() = user_id);

-- =========================================================================
-- generated_posts — the platform-native output for one destination.
-- =========================================================================
create table generated_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

create policy "generated_posts_select_own" on generated_posts for select using (auth.uid() = user_id);
create policy "generated_posts_insert_own" on generated_posts for insert with check (auth.uid() = user_id);
create policy "generated_posts_update_own" on generated_posts for update using (auth.uid() = user_id);
create policy "generated_posts_delete_own" on generated_posts for delete using (auth.uid() = user_id);

-- =========================================================================
-- scheduled_posts
-- =========================================================================
create table scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

create policy "scheduled_posts_select_own" on scheduled_posts for select using (auth.uid() = user_id);
create policy "scheduled_posts_insert_own" on scheduled_posts for insert with check (auth.uid() = user_id);
create policy "scheduled_posts_update_own" on scheduled_posts for update using (auth.uid() = user_id);
create policy "scheduled_posts_delete_own" on scheduled_posts for delete using (auth.uid() = user_id);

-- =========================================================================
-- published_posts
-- =========================================================================
create table published_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  generated_post_id uuid not null references generated_posts(id) on delete cascade,
  account_id uuid not null references connected_accounts(id) on delete cascade,
  external_id text,
  external_url text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index published_posts_user_id_idx on published_posts(user_id);

alter table published_posts enable row level security;

create policy "published_posts_select_own" on published_posts for select using (auth.uid() = user_id);
create policy "published_posts_insert_own" on published_posts for insert with check (auth.uid() = user_id);
create policy "published_posts_delete_own" on published_posts for delete using (auth.uid() = user_id);

-- =========================================================================
-- analytics — point-in-time snapshots pulled from platforms that expose it.
-- =========================================================================
create table analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

create policy "analytics_select_own" on analytics for select using (auth.uid() = user_id);
create policy "analytics_insert_own" on analytics for insert with check (auth.uid() = user_id);

-- =========================================================================
-- backlinks
-- =========================================================================
create table backlinks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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

create policy "backlinks_select_own" on backlinks for select using (auth.uid() = user_id);
create policy "backlinks_insert_own" on backlinks for insert with check (auth.uid() = user_id);
create policy "backlinks_update_own" on backlinks for update using (auth.uid() = user_id);
create policy "backlinks_delete_own" on backlinks for delete using (auth.uid() = user_id);

-- =========================================================================
-- network_profiles — discoverable creators/communities in the network
-- directory. Publicly readable when visible; only the owner can edit.
-- =========================================================================
create table network_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  display_name text not null,
  category text not null check (category in ('influencer', 'creator', 'community')),
  platforms text[] not null default '{}',
  audience_size integer,
  bio text,
  contact_url text,
  is_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index network_profiles_category_idx on network_profiles(category);

create trigger network_profiles_set_updated_at
  before update on network_profiles
  for each row execute function set_updated_at();

alter table network_profiles enable row level security;

create policy "network_profiles_select_visible" on network_profiles for select using (is_visible = true or auth.uid() = user_id);
create policy "network_profiles_insert_own" on network_profiles for insert with check (auth.uid() = user_id);
create policy "network_profiles_update_own" on network_profiles for update using (auth.uid() = user_id);
create policy "network_profiles_delete_own" on network_profiles for delete using (auth.uid() = user_id);
