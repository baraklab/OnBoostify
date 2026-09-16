-- Blog newsletter signups. Anyone can insert; nobody can read back
-- through the anon/public API.
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "newsletter_subscribers_insert_anyone" on newsletter_subscribers for insert with check (true);
