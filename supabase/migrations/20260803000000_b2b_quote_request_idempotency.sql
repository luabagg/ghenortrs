-- Idempotent B2B quote persistence and delivery tracking.
-- request_key is client-generated per in-progress submission and unique per seller.

alter table public.b2b_quote_requests
  add column if not exists request_key uuid,
  add column if not exists notification_status text not null default 'pending',
  add column if not exists notification_attempts integer not null default 0,
  add column if not exists notified_at timestamptz;

update public.b2b_quote_requests
set request_key = id
where request_key is null;

alter table public.b2b_quote_requests
  alter column request_key set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'b2b_quote_requests_seller_request_key_key'
      and conrelid = 'public.b2b_quote_requests'::regclass
  ) then
    alter table public.b2b_quote_requests
      add constraint b2b_quote_requests_seller_request_key_key
      unique (seller_id, request_key);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'b2b_quote_requests_notification_status_check'
      and conrelid = 'public.b2b_quote_requests'::regclass
  ) then
    alter table public.b2b_quote_requests
      add constraint b2b_quote_requests_notification_status_check
      check (
        notification_status in ('pending', 'sent', 'failed', 'not_configured')
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'b2b_quote_requests_notification_attempts_check'
      and conrelid = 'public.b2b_quote_requests'::regclass
  ) then
    alter table public.b2b_quote_requests
      add constraint b2b_quote_requests_notification_attempts_check
      check (notification_attempts >= 0);
  end if;
end
$$;

comment on column public.b2b_quote_requests.request_key is
  'Client-generated UUID for one in-progress quote submission; unique with seller_id.';
comment on column public.b2b_quote_requests.notification_status is
  'Delivery state for the GHENO quote alert email.';
comment on column public.b2b_quote_requests.notification_attempts is
  'Number of Resend delivery attempts for this quote row.';
comment on column public.b2b_quote_requests.notified_at is
  'Timestamp of the successful quote alert delivery, if any.';
