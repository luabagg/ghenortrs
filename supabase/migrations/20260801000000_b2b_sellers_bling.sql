-- GHENO B2B sellers and Bling catalog cache
-- Apply in Supabase SQL editor or via supabase db push.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Seller profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create type public.seller_status as enum (
  'pending',
  'approved',
  'rejected',
  'suspended'
);

create table if not exists public.sellers (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  company_name text not null,
  cnpj text not null,
  phone text not null,
  message text not null default '',
  status public.seller_status not null default 'pending',
  approved_at timestamptz,
  approved_by text,
  rejected_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sellers_cnpj_digits check (cnpj ~ '^\d{14}$')
);

create index if not exists sellers_status_idx on public.sellers (status);
create index if not exists sellers_email_idx on public.sellers (email);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sellers_set_updated_at on public.sellers;
create trigger sellers_set_updated_at
before update on public.sellers
for each row execute function public.set_updated_at();

alter table public.sellers enable row level security;

-- Sellers can read only their own row.
create policy "sellers_select_own"
  on public.sellers
  for select
  to authenticated
  using (auth.uid() = id);

-- Inserts and updates use service-role edge functions only.
-- No insert/update/delete policies for authenticated or anon.

-- ---------------------------------------------------------------------------
-- Bling OAuth token store (service role only)
-- ---------------------------------------------------------------------------
create table if not exists public.bling_oauth_tokens (
  id int primary key default 1 check (id = 1),
  access_token text not null,
  refresh_token text not null,
  token_type text not null default 'Bearer',
  expires_at timestamptz not null,
  scope text,
  raw jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.bling_oauth_tokens enable row level security;
-- No policies. Only service role can touch this table.

-- ---------------------------------------------------------------------------
-- Cached Bling products for B2B catalog and search
-- ---------------------------------------------------------------------------
create table if not exists public.bling_products (
  id bigint primary key,
  sku text,
  name text not null,
  description text not null default '',
  image_url text,
  price_cents integer,
  stock numeric,
  unit text,
  min_quantity integer not null default 1,
  active boolean not null default true,
  category text,
  raw jsonb not null default '{}'::jsonb,
  search_terms text not null default '',
  synced_at timestamptz not null default now()
);

create index if not exists bling_products_active_idx
  on public.bling_products (active);
create index if not exists bling_products_name_idx
  on public.bling_products using gin (to_tsvector('portuguese', name || ' ' || search_terms));

alter table public.bling_products enable row level security;

-- Approved sellers may read active products.
create policy "bling_products_select_approved"
  on public.bling_products
  for select
  to authenticated
  using (
    active = true
    and exists (
      select 1
      from public.sellers s
      where s.id = auth.uid()
        and s.status = 'approved'
    )
  );

-- ---------------------------------------------------------------------------
-- Quote requests (selection to human follow-up; no checkout)
-- ---------------------------------------------------------------------------
create table if not exists public.b2b_quote_requests (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers (id) on delete cascade,
  items jsonb not null,
  notes text not null default '',
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

create index if not exists b2b_quote_requests_seller_idx
  on public.b2b_quote_requests (seller_id);

alter table public.b2b_quote_requests enable row level security;

create policy "quote_select_own"
  on public.b2b_quote_requests
  for select
  to authenticated
  using (seller_id = auth.uid());

-- Insert via service role after validation.
