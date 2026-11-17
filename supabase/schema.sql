-- Plenty (Team 2) database schema. Matches docs/data-contract.md.
-- Run once in Supabase: Dashboard -> SQL Editor -> paste -> Run.
-- Safe to re-run: uses "if not exists" / "create or replace" / drop policy.

-- ───────────── Tables ─────────────

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  zip_code text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  title text not null,
  description text,
  photo_url text,
  category text not null check (category in ('produce','bakery','dairy','pantry')),
  dietary_tags text[] not null default '{}',
  price_cents integer not null check (price_cents >= 0),
  original_price_cents integer not null check (original_price_cents >= 0),
  quantity_left integer not null check (quantity_left >= 0),
  best_by date not null,
  pickup_start timestamptz not null,
  pickup_end timestamptz not null,
  created_at timestamptz not null default now(),
  check (price_cents <= original_price_cents),
  check (pickup_end > pickup_start)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  zip_code text,
  dietary_prefs text[] not null default '{}',
  is_adult boolean not null default false check (is_adult),
  accepted_terms_at timestamptz,
  verified boolean not null default false,
  proof_type text check (proof_type in ('benefitscal','ebtedge','propel','card_photo')),
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  quantity integer not null default 1 check (quantity >= 1),
  code text not null unique,
  status text not null default 'reserved' check (status in ('reserved','picked_up','no_show')),
  arrival_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists reservations_user_idx on public.reservations(user_id);
create index if not exists listings_store_idx on public.listings(store_id);

-- ───────────── Helpers ─────────────

-- Is the signed-in user verified? (security definer so listing rules can look
-- at profiles without running into profiles' own row-level rules.)
create or replace function public.is_verified()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select verified from public.profiles where id = auth.uid()), false);
$$;

-- "Expired" = after the end of the best_by day, Los Angeles time (data contract).
create or replace function public.is_expired(p_best_by date)
returns boolean
language sql stable set search_path = ''
as $$
  select now() >= ((p_best_by + 1)::timestamp at time zone 'America/Los_Angeles');
$$;

-- ───────────── Row Level Security ─────────────

alter table public.stores enable row level security;
alter table public.listings enable row level security;
alter table public.profiles enable row level security;
alter table public.reservations enable row level security;

-- Stores: any signed-in user can read.
drop policy if exists "stores readable" on public.stores;
create policy "stores readable" on public.stores
  for select to authenticated using (true);

-- Listings (the feed): not sold out, not expired, free ones only if verified.
-- A listing the user has reserved stays visible to them.
drop policy if exists "listings readable" on public.listings;
create policy "listings readable" on public.listings
  for select to authenticated using (
    (
      quantity_left > 0
      and not public.is_expired(best_by)
      and (price_cents > 0 or public.is_verified())
    )
    or exists (
      select 1 from public.reservations r
      where r.listing_id = listings.id and r.user_id = auth.uid()
    )
  );

-- Profiles: you see and edit only your own row, and never verified/proof_type.
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Column-level limits: users can write these columns only (not verified/proof_type).
revoke insert, update on public.profiles from authenticated, anon;
grant insert (id, first_name, zip_code, dietary_prefs, is_adult, accepted_terms_at)
  on public.profiles to authenticated;
grant update (first_name, zip_code, dietary_prefs, is_adult, accepted_terms_at)
  on public.profiles to authenticated;

-- Reservations: you can read your own. All writes go through reserve_listing().
drop policy if exists "own reservations read" on public.reservations;
create policy "own reservations read" on public.reservations
  for select to authenticated using (user_id = auth.uid());

revoke insert, update, delete on public.reservations from authenticated, anon;

-- ───────────── Backend functions ─────────────

-- Mock verification: marks the signed-in user as verified. No document is stored.
create or replace function public.complete_verification(p_proof_type text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if p_proof_type not in ('benefitscal','ebtedge','propel','card_photo') then
    raise exception 'Unknown proof type';
  end if;
  update public.profiles
     set verified = true, proof_type = p_proof_type
   where id = auth.uid();
  if not found then
    raise exception 'Create your profile first';
  end if;
end;
$$;

-- Reserve bags: checks everything, makes a unique code, and takes the stock in
-- one step so two people can't get the last bag. Returns the pickup code.
create or replace function public.reserve_listing(
  p_listing_id uuid,
  p_quantity integer,
  p_arrival_at timestamptz
)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_listing public.listings%rowtype;
  v_code text;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if not exists (select 1 from public.profiles where id = auth.uid()) then
    raise exception 'Create your profile first';
  end if;
  if p_quantity is null or p_quantity < 1 then
    raise exception 'Quantity must be at least 1';
  end if;

  -- Lock the row so two simultaneous reservations take turns.
  select * into v_listing from public.listings where id = p_listing_id for update;
  if not found then
    raise exception 'Listing not found';
  end if;
  if public.is_expired(v_listing.best_by) then
    raise exception 'This listing has expired';
  end if;
  if v_listing.quantity_left < p_quantity then
    raise exception 'Sold out';
  end if;
  if v_listing.price_cents = 0 and not public.is_verified() then
    raise exception 'Free bags are for verified members only';
  end if;
  if p_arrival_at < v_listing.pickup_start or p_arrival_at > v_listing.pickup_end then
    raise exception 'Arrival time is outside the pickup window';
  end if;

  -- Pickup code like PLNTY-7K3QZ9 (retries on the rare collision).
  loop
    v_code := 'PLNTY-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from public.reservations where code = v_code);
  end loop;

  insert into public.reservations (user_id, listing_id, quantity, code, arrival_at)
  values (auth.uid(), p_listing_id, p_quantity, v_code, p_arrival_at);

  update public.listings
     set quantity_left = quantity_left - p_quantity
   where id = p_listing_id;

  return v_code;
end;
$$;

-- Manual no-show (MVP): marks a reservation as no_show and puts the bags back
-- so someone else can reserve them. Not callable by app users; run it from the
-- Supabase SQL Editor (or later, a store/admin tool):
--   select public.mark_no_show('<reservation id>');
create or replace function public.mark_no_show(p_reservation_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_res public.reservations%rowtype;
begin
  select * into v_res from public.reservations where id = p_reservation_id for update;
  if not found then
    raise exception 'Reservation not found';
  end if;
  if v_res.status <> 'reserved' then
    raise exception 'Only a reserved order can become a no-show';
  end if;

  update public.reservations set status = 'no_show' where id = p_reservation_id;
  update public.listings
     set quantity_left = quantity_left + v_res.quantity
   where id = v_res.listing_id;
end;
$$;

revoke execute on function public.mark_no_show(uuid) from public, anon, authenticated;

revoke execute on function public.complete_verification(text) from public, anon;
revoke execute on function public.reserve_listing(uuid, integer, timestamptz) from public, anon;
grant execute on function public.complete_verification(text) to authenticated;
grant execute on function public.reserve_listing(uuid, integer, timestamptz) to authenticated;
