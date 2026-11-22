-- Sparetime database schema v2 (off-peak service model).
-- Matches docs/data-contract-v2.md (agreed Nov 20, 2026).
--
-- WARNING: this REPLACES the v1 grocery tables (stores, listings, reservations)
-- and rebuilds profiles, so existing demo rows are deleted (including the two
-- test profiles chloe@tmail.com and chloe1@tmail.com). Only run it after the
-- team agrees. Sign-in accounts in Authentication are NOT touched.
-- Run supabase/seed.sql afterward (the v2 seed is still to be written).

-- ───────────── 1. Remove v1 ─────────────
-- Tables first: their policies depend on the v1 helper functions below.
drop table if exists public.reservations cascade;
drop table if exists public.listings cascade;
drop table if exists public.stores cascade;
drop table if exists public.profiles cascade;
drop function if exists public.reserve_listing(uuid, integer, timestamptz);
drop function if exists public.complete_verification(text);
drop function if exists public.mark_no_show(uuid);
drop function if exists public.is_verified();
drop function if exists public.is_expired(date);

-- ───────────── 2. Tables ─────────────

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('hair', 'nails', 'laundry', 'dry_cleaning')),
  address text not null,
  zip_code text not null,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  name text not null,
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  regular_price_cents integer not null check (regular_price_cents >= 0),
  created_at timestamptz not null default now()
);

create table public.slots (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  price_cents integer not null check (price_cents >= 0),
  seats_total integer not null check (seats_total >= 1),
  seats_left integer not null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (seats_left >= 0 and seats_left <= seats_total)
);

-- A slot price can't be above the service's regular price (needs a second table, so a trigger).
create or replace function public.check_slot_price()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.price_cents > (select regular_price_cents from public.services where id = new.service_id) then
    raise exception 'Slot price cannot be above the regular price';
  end if;
  return new;
end;
$$;

create trigger slots_price_check
  before insert or update of price_cents, service_id on public.slots
  for each row execute function public.check_slot_price();

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  zip_code text,
  is_adult boolean not null default false check (is_adult),
  accepted_terms_at timestamptz,
  policy_version text,
  created_at timestamptz not null default now()
);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  policy_version text not null,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slot_id uuid not null references public.slots(id) on delete restrict,
  seats integer not null default 1 check (seats >= 1),
  code text not null unique,
  status text not null default 'booked'
    check (status in ('booked', 'checked_in', 'no_show', 'cancelled')),
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

-- One active booking per person per slot. Cancelled ones don't block rebooking.
create unique index bookings_one_active_per_slot
  on public.bookings (user_id, slot_id) where status = 'booked';

create index services_business_idx on public.services (business_id);
create index slots_service_idx on public.slots (service_id);
create index bookings_user_idx on public.bookings (user_id);

-- ───────────── 3. Trust ladder (counted from bookings, not stored) ─────────────
-- shows  = bookings the business confirmed (checked_in)
-- misses = no-shows, plus late cancels (less than 2 hours before the start)
-- limit  = how many active bookings the person may hold

create or replace function public.booking_limit(p_shows integer, p_misses integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case
    when p_misses >= 2 then 1
    when p_shows >= 4 then 1000
    when p_shows >= 2 then 2
    else 1
  end;
$$;

-- What the signed-in user sees about their own ladder.
create or replace function public.my_trust_status()
returns table (shows_count integer, misses_count integer, active_count integer, booking_limit integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_shows integer;
  v_misses integer;
  v_active integer;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  select
    count(*) filter (where b.status = 'checked_in'),
    count(*) filter (where b.status = 'no_show'
      or (b.status = 'cancelled' and b.cancelled_at > s.starts_at - interval '2 hours')),
    count(*) filter (where b.status = 'booked')
  into v_shows, v_misses, v_active
  from public.bookings b
  join public.slots s on s.id = b.slot_id
  where b.user_id = auth.uid();

  return query select v_shows, v_misses, v_active, public.booking_limit(v_shows, v_misses);
end;
$$;

-- ───────────── 4. Row Level Security ─────────────

alter table public.businesses enable row level security;
alter table public.services enable row level security;
alter table public.slots enable row level security;
alter table public.profiles enable row level security;
alter table public.consents enable row level security;
alter table public.bookings enable row level security;

-- Businesses and services: any signed-in user can read. Nobody writes directly.
create policy "businesses readable" on public.businesses
  for select to authenticated using (true);
create policy "services readable" on public.services
  for select to authenticated using (true);

-- Slots: future slots with seats left, plus any slot the user has booked
-- (so their booking code still shows on the day).
create policy "open slots readable" on public.slots
  for select to authenticated using (
    (starts_at > now() and seats_left > 0)
    or exists (
      select 1 from public.bookings b
      where b.slot_id = slots.id and b.user_id = auth.uid()
    )
  );

-- Profiles: read and edit only your own row. Terms fields are set by accept_terms().
create policy "own profile read" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "own profile insert" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Consents and bookings: read your own. All writes go through functions.
create policy "own consents read" on public.consents
  for select to authenticated using (user_id = auth.uid());
create policy "own bookings read" on public.bookings
  for select to authenticated using (user_id = auth.uid());

-- Column-level limits: users can write only these profile columns.
revoke insert, update on public.profiles from authenticated, anon;
grant insert (id, first_name, zip_code, is_adult) on public.profiles to authenticated;
grant update (first_name, zip_code, is_adult) on public.profiles to authenticated;

revoke insert, update, delete on public.businesses, public.services, public.slots,
  public.consents, public.bookings from authenticated, anon;

-- ───────────── 5. Functions ─────────────

-- Records that the user accepted a policy version (profile + consent record).
create or replace function public.accept_terms(p_policy_version text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if not exists (select 1 from public.profiles where id = auth.uid()) then
    raise exception 'Create your profile first';
  end if;
  update public.profiles
     set accepted_terms_at = now(), policy_version = p_policy_version
   where id = auth.uid();
  insert into public.consents (user_id, policy_version) values (auth.uid(), p_policy_version);
end;
$$;

-- Books seats in a slot. Checks: signed in, 18+, slot not started, seats left,
-- not already booked, and under the trust-ladder limit. Returns the code.
create or replace function public.book_slot(p_slot_id uuid, p_seats integer)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slot public.slots%rowtype;
  v_shows integer;
  v_misses integer;
  v_active integer;
  v_code text;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and is_adult) then
    raise exception 'Create your profile first, and confirm you are 18 or older';
  end if;
  if p_seats is null or p_seats < 1 then
    raise exception 'Seats must be at least 1';
  end if;

  -- Lock the slot so two people can't take the same last seat.
  select * into v_slot from public.slots where id = p_slot_id for update;
  if not found then
    raise exception 'Slot not found';
  end if;
  if v_slot.starts_at <= now() then
    raise exception 'This slot has already started';
  end if;
  if v_slot.seats_left < p_seats then
    raise exception 'Slot already taken';
  end if;
  if exists (select 1 from public.bookings
             where user_id = auth.uid() and slot_id = p_slot_id and status = 'booked') then
    raise exception 'You already have a booking for this slot';
  end if;

  select
    count(*) filter (where b.status = 'checked_in'),
    count(*) filter (where b.status = 'no_show'
      or (b.status = 'cancelled' and b.cancelled_at > s.starts_at - interval '2 hours')),
    count(*) filter (where b.status = 'booked')
  into v_shows, v_misses, v_active
  from public.bookings b
  join public.slots s on s.id = b.slot_id
  where b.user_id = auth.uid();

  if v_active >= public.booking_limit(v_shows, v_misses) then
    raise exception 'Booking limit reached';
  end if;

  loop
    v_code := 'SPRT-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from public.bookings where code = v_code);
  end loop;

  insert into public.bookings (user_id, slot_id, seats, code)
  values (auth.uid(), p_slot_id, p_seats, v_code);

  update public.slots set seats_left = seats_left - p_seats where id = p_slot_id;

  return v_code;
end;
$$;

-- The user cancels their own booking. Seats come back only if it's 2+ hours
-- before the start. A later cancel is kept as a miss and the seats stay taken.
-- Returns 'cancelled' (on time) or 'late' (counts as a miss).
create or replace function public.cancel_booking(p_booking_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking public.bookings%rowtype;
  v_starts timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;

  select * into v_booking from public.bookings
   where id = p_booking_id and user_id = auth.uid() for update;
  if not found then
    raise exception 'Booking not found';
  end if;
  if v_booking.status <> 'booked' then
    raise exception 'Only an active booking can be cancelled';
  end if;

  select starts_at into v_starts from public.slots where id = v_booking.slot_id;

  update public.bookings set status = 'cancelled', cancelled_at = now() where id = p_booking_id;

  if now() <= v_starts - interval '2 hours' then
    update public.slots set seats_left = seats_left + v_booking.seats where id = v_booking.slot_id;
    return 'cancelled';
  end if;
  return 'late';
end;
$$;

-- Backend-only (SQL Editor or a service role, never the app). The business
-- confirms the visit: counts as a show.
create or replace function public.confirm_show_up(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.bookings set status = 'checked_in'
   where id = p_booking_id and status = 'booked';
  if not found then
    raise exception 'Only an active booking can be confirmed';
  end if;
end;
$$;

-- Backend-only. A no-show counts as a miss, and the seats are returned.
create or replace function public.mark_no_show(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking public.bookings%rowtype;
begin
  select * into v_booking from public.bookings where id = p_booking_id for update;
  if not found then
    raise exception 'Booking not found';
  end if;
  if v_booking.status <> 'booked' then
    raise exception 'Only an active booking can be marked as a no-show';
  end if;

  update public.bookings set status = 'no_show' where id = p_booking_id;
  update public.slots set seats_left = seats_left + v_booking.seats where id = v_booking.slot_id;
end;
$$;

-- Who may run what.
revoke execute on function public.accept_terms(text) from public, anon;
revoke execute on function public.book_slot(uuid, integer) from public, anon;
revoke execute on function public.cancel_booking(uuid) from public, anon;
revoke execute on function public.my_trust_status() from public, anon;
revoke execute on function public.confirm_show_up(uuid) from public, anon, authenticated;
revoke execute on function public.mark_no_show(uuid) from public, anon, authenticated;
grant execute on function public.accept_terms(text) to authenticated;
grant execute on function public.book_slot(uuid, integer) to authenticated;
grant execute on function public.cancel_booking(uuid) to authenticated;
grant execute on function public.my_trust_status() to authenticated;
