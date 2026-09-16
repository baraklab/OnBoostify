-- Public contact form submissions. Anyone can insert; nobody can read
-- back through the anon/public API — messages are reviewed via the
-- Supabase dashboard or a service-role admin tool.
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "contact_messages_insert_anyone" on contact_messages for insert with check (true);
