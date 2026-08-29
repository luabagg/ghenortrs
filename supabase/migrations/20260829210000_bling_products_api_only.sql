-- Catalog is served only via the server (service role / DATABASE_URL).
-- Drop the authenticated SELECT that leaked visible_b2b=false rows and all
-- three tier price columns to any approved seller.

drop policy if exists "bling_products_select_approved" on public.bling_products;
-- no new authenticated select policy: catalog is served only via server (service role / DATABASE_URL)
