-- Applied to project umibjaxitgewbbtvuwmb as portfolio_contact_inbox_auth.
-- Visitors can submit contact messages. Only the portfolio owner's authenticated
-- Supabase Auth identity can read them.
create table if not exists public.portfolio_contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null check (char_length(btrim(email)) between 3 and 254),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.portfolio_contact_messages enable row level security;
revoke all on table public.portfolio_contact_messages from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant insert on table public.portfolio_contact_messages to anon;
grant select on table public.portfolio_contact_messages to authenticated;

drop policy if exists "Anyone can send a portfolio contact message"
  on public.portfolio_contact_messages;
create policy "Anyone can send a portfolio contact message"
  on public.portfolio_contact_messages
  for insert to anon
  with check (
    char_length(btrim(name)) between 1 and 120
    and char_length(btrim(email)) between 3 and 254
    and char_length(btrim(message)) between 1 and 5000
  );

drop policy if exists "Only portfolio owner can read contact messages"
  on public.portfolio_contact_messages;
create policy "Only portfolio owner can read contact messages"
  on public.portfolio_contact_messages
  for select to authenticated
  using ((select auth.jwt() ->> 'email') = 'diifodiifo@gmail.com');

