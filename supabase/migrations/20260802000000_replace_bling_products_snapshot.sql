-- Atomic full-snapshot replacement for Bling product cache.
-- Upsert snapshot rows, then deactivate ids absent from the snapshot.
-- No pre-deactivation: a failed run leaves the previous catalog intact.

create or replace function public.replace_bling_products_snapshot(p_products jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_upserted integer := 0;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'not authorized';
  end if;

  if p_products is null or jsonb_typeof(p_products) is distinct from 'array' then
    raise exception 'p_products must be a JSON array';
  end if;

  if jsonb_array_length(p_products) = 0 then
    raise exception 'p_products must not be empty';
  end if;

  -- Serialize concurrent full snapshot replacements in this transaction.
  perform pg_advisory_xact_lock(hashtext('replace_bling_products_snapshot'));

  insert into public.bling_products as bp (
    id,
    sku,
    name,
    description,
    image_url,
    price_cents,
    stock,
    unit,
    min_quantity,
    active,
    category,
    raw,
    search_terms,
    synced_at
  )
  select
    (elem->>'id')::bigint,
    nullif(elem->>'sku', ''),
    coalesce(elem->>'name', ''),
    coalesce(elem->>'description', ''),
    nullif(elem->>'image_url', ''),
    case
      when elem ? 'price_cents' and elem->>'price_cents' is not null
        then (elem->>'price_cents')::integer
      else null
    end,
    case
      when elem ? 'stock' and elem->>'stock' is not null
        then (elem->>'stock')::numeric
      else null
    end,
    nullif(elem->>'unit', ''),
    coalesce((elem->>'min_quantity')::integer, 1),
    coalesce((elem->>'active')::boolean, true),
    nullif(elem->>'category', ''),
    coalesce(elem->'raw', '{}'::jsonb),
    coalesce(elem->>'search_terms', ''),
    coalesce((elem->>'synced_at')::timestamptz, now())
  from jsonb_array_elements(p_products) as elem
  on conflict (id) do update set
    sku = excluded.sku,
    name = excluded.name,
    description = excluded.description,
    image_url = excluded.image_url,
    price_cents = excluded.price_cents,
    stock = excluded.stock,
    unit = excluded.unit,
    min_quantity = excluded.min_quantity,
    active = excluded.active,
    category = excluded.category,
    raw = excluded.raw,
    search_terms = excluded.search_terms,
    synced_at = excluded.synced_at;

  get diagnostics v_upserted = row_count;

  update public.bling_products as bp
  set active = false
  where not exists (
    select 1
    from jsonb_array_elements(p_products) as elem
    where (elem->>'id')::bigint = bp.id
  )
  and bp.active is distinct from false;

  return v_upserted;
end;
$$;

revoke all on function public.replace_bling_products_snapshot(jsonb) from public;
revoke all on function public.replace_bling_products_snapshot(jsonb) from anon;
revoke all on function public.replace_bling_products_snapshot(jsonb) from authenticated;
grant execute on function public.replace_bling_products_snapshot(jsonb) to service_role;

comment on function public.replace_bling_products_snapshot(jsonb) is
  'Service-role only. Atomically upsert a full Bling product snapshot and deactivate missing ids.';
