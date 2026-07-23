-- ============================================================================
-- ShedStock — Supabase schema
-- Run this once in the Supabase SQL Editor (or via `supabase db push`).
-- ============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles
-- One row per auth user. Created automatically on signup via trigger below.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique not null,
  full_name   text not null,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Everyone signed in can see every profile (needed to show "added by" names,
-- avatars, etc. across the household). Nobody can edit someone else's row.
create policy "profiles are readable by any authenticated user"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
-- full_name / username are passed in from the signup form via
-- supabase.auth.signUp({ options: { data: { full_name, username } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', 'New Member')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- items
-- The shared household inventory. Every signed-in member of the household
-- can see and edit every item — this mirrors the original app, which was a
-- single shared registry rather than per-user data.
-- ----------------------------------------------------------------------------
create table if not exists public.items (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null,
  quantity     integer not null default 1 check (quantity >= 1),
  location     text not null,
  status       text not null default 'Available'
               check (status in ('Available', 'In Use', 'Under Repair', 'Missing')),
  notes        text default '',
  added_by     uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists items_status_idx on public.items (status);
create index if not exists items_location_idx on public.items (location);
create index if not exists items_category_idx on public.items (category);

alter table public.items enable row level security;

create policy "authenticated users can read all items"
  on public.items for select
  to authenticated
  using (true);

create policy "authenticated users can insert items"
  on public.items for insert
  to authenticated
  with check (true);

create policy "authenticated users can update items"
  on public.items for update
  to authenticated
  using (true);

create policy "authenticated users can delete items"
  on public.items for delete
  to authenticated
  using (true);

-- Keep updated_at fresh on every change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at
  before update on public.items
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------------------
-- history
-- Append-only audit log of everything that happens to the registry.
-- ----------------------------------------------------------------------------
create table if not exists public.history (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid references public.items (id) on delete set null,
  item_name   text not null,
  action      text not null check (action in ('Added', 'Updated', 'Status changed', 'Removed')),
  details     text default '',
  by_user     uuid references public.profiles (id) on delete set null,
  by_name     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists history_created_at_idx on public.history (created_at desc);
create index if not exists history_item_name_idx on public.history (item_name);

alter table public.history enable row level security;

create policy "authenticated users can read all history"
  on public.history for select
  to authenticated
  using (true);

create policy "authenticated users can insert history"
  on public.history for insert
  to authenticated
  with check (true);

-- History is append-only: no update/delete policies are defined on purpose,
-- so entries can never be edited or removed once logged.
