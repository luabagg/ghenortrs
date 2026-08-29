-- B2B tier prices + visibility override (sync-safe columns)
-- Apply in Supabase SQL editor or via supabase db push.

alter table public.sellers
  add column if not exists volume integer not null default 0;

alter table public.bling_products
  add column if not exists visible_b2b boolean not null default true,
  add column if not exists price_start_cents integer,
  add column if not exists price_pro_cents integer,
  add column if not exists price_max_cents integer;
