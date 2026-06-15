-- ============================================================================
-- IGO Agri Mart — Supabase schema
-- Run this in your Supabase project:  SQL Editor → New query → paste → Run.
-- Project: https://elkylzsyrktltvrftjgt.supabase.co
--
-- Design: each table keeps the full app object in a `data` JSONB column, plus a
-- few indexed columns for fast lookups/filtering. This mirrors the app's
-- TypeScript shapes exactly, so nothing in the UI has to change.
-- ============================================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  uid         text primary key,
  email       text,
  phone       text,
  role        text default 'customer',
  data        jsonb not null,
  updated_at  timestamptz default now()
);

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id          text primary key,
  user_id     text not null,
  status      text default 'Placed',
  total       numeric default 0,
  phone       text,
  created_at  timestamptz default now(),
  data        jsonb not null
);
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_idx  on public.orders (created_at desc);

-- ---------- REVIEWS ----------
create table if not exists public.reviews (
  id          text primary key,
  product_id  text not null,
  user_id     text,
  data        jsonb not null,
  created_at  timestamptz default now()
);
create index if not exists reviews_product_idx on public.reviews (product_id);

-- ---------- SERVICE LEADS ----------
create table if not exists public.service_leads (
  id          text primary key,
  status      text default 'Pending',
  data        jsonb not null,
  created_at  timestamptz default now()
);

-- ---------- (Optional) PRODUCTS ----------
-- The app currently serves its large catalog from code. This table is here for
-- when you want admin-managed products in Supabase. Not required to run.
create table if not exists public.products (
  id          text primary key,
  slug        text,
  category    text,
  brand       text,
  price       numeric,
  data        jsonb not null,
  updated_at  timestamptz default now()
);
create index if not exists products_category_idx on public.products (category);

-- ============================================================================
-- ROW-LEVEL SECURITY
-- ============================================================================
alter table public.profiles      enable row level security;
alter table public.orders        enable row level security;
alter table public.reviews       enable row level security;
alter table public.service_leads enable row level security;
alter table public.products      enable row level security;

-- ⚠️ DEMO POLICIES — permissive so the website + admin work immediately with the
-- anon key (the app currently identifies users via Firebase, not Supabase Auth,
-- so RLS cannot scope rows to auth.uid() yet). This means anyone holding the
-- public anon key could read these tables via the API. Fine for testing; tighten
-- before real launch (see "Production hardening" at the bottom of this file).

drop policy if exists demo_all on public.profiles;
create policy demo_all on public.profiles      for all to anon using (true) with check (true);

drop policy if exists demo_all on public.orders;
create policy demo_all on public.orders        for all to anon using (true) with check (true);

drop policy if exists demo_all on public.reviews;
create policy demo_all on public.reviews       for all to anon using (true) with check (true);

drop policy if exists demo_all on public.service_leads;
create policy demo_all on public.service_leads for all to anon using (true) with check (true);

-- products: public read, no anon write (admin writes go through the app overlay)
drop policy if exists products_read on public.products;
create policy products_read on public.products for select to anon using (true);

-- ============================================================================
-- PRODUCTION HARDENING (do this when you add Supabase Auth)
-- ============================================================================
-- 1) Replace Firebase anonymous sign-in with supabase.auth.signInAnonymously()
--    (or real phone/email auth) so every request carries a Supabase JWT.
-- 2) Add a `user_id uuid default auth.uid()` column and replace the demo
--    policies with owner-scoped ones, e.g. on orders:
--
--    drop policy demo_all on public.orders;
--    create policy own_select on public.orders for select to authenticated
--      using (user_id = auth.uid());
--    create policy own_insert on public.orders for insert to authenticated
--      with check (user_id = auth.uid());
--
-- 3) For the admin panel, create an admin Supabase account and a policy like:
--    create policy admin_all on public.orders for all to authenticated
--      using ( (auth.jwt() ->> 'email') = 'youradmin@email.com' );
-- ============================================================================
