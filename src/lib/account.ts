"use client";

import { useSyncExternalStore } from "react";

// The person's own account, saved on this device (localStorage) for the demo.
// Everything here comes from what they type — nothing is pre-filled. When
// Supabase is wired, swap this file's load/save for real queries; screens only
// use the hooks and functions exported below.
//
// Sign-up code: real SMS needs a paid provider and US carrier registration, so
// the demo generates the 6-digit code here and shows it on screen (see the
// README "Notes for judges"). verifyCode() really checks it.

export interface Profile {
  phone: string; // formatted, e.g. "(213) 555-0123"
  firstName: string;
  area: string;
  needs: string[];
  reason: string | null;
  timing: string | null;
  timingDate: string | null; // yyyy-mm-dd, optional
}

interface PendingCode {
  phone: string;
  code: string;
  sentAt: number; // ms since epoch
}

/** A time the person picked but hasn't booked yet (Pick a time → Confirm). */
export interface Draft {
  serviceId: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  /** Rescheduling: the booking this new time replaces. */
  replaces?: string;
}

export type BookingStatus = "booked" | "kept" | "cancelled";

/** A real booking the person made. Prices are copied in at booking time. */
export interface Booking {
  id: string;
  serviceId: string;
  businessId: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  ref: string; // "SPRT-4821" — shown on tickets
  pin: string; // 6 digits staff can type if the QR scan fails
  paid: number;
  regular: number;
  status: BookingStatus;
  /** Cancelled less than 2 hours before the start — counts as a miss. */
  lateCancel?: boolean;
  createdAt: string;
  keptAt?: string;
}

interface AccountState {
  profile: Profile | null; // null until the phone number is verified
  pending: PendingCode | null;
  draft: Draft | null;
  bookings: Booking[];
  /** Booking id being rescheduled (set by "Reschedule", used by Pick a time). */
  reschedule: string | null;
}

const KEY = "sparetime.account.v1";
const EMPTY: AccountState = { profile: null, pending: null, draft: null, bookings: [], reschedule: null };
const BLANK_PROFILE: Omit<Profile, "phone"> = {
  firstName: "",
  area: "",
  needs: [],
  reason: null,
  timing: null,
  timingDate: null,
};

export const RESEND_AFTER_SECONDS = 30;

let state: AccountState | null = null;
const listeners = new Set<() => void>();

function load(): AccountState {
  if (typeof window === "undefined") return EMPTY;
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    state = EMPTY;
  }
  return state!;
}

function save(next: AccountState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable (private mode): keep it in memory for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

// ---- Hooks ---------------------------------------------------------------

export function useAccount(): AccountState {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

export const useProfile = () => useAccount().profile;

/** False during the server render and hydration; true once on-device data is readable. */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** "Good morning" / "Good afternoon" / "Good evening" by the person's clock. */
export function useGreeting() {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const h = new Date().getHours();
      return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    },
    () => "Hello",
  );
}

/** Current time in whole seconds, ticking once a second (0 on the server). */
export function useNowSeconds() {
  return useSyncExternalStore(
    (onChange) => {
      const t = setInterval(onChange, 1000);
      return () => clearInterval(t);
    },
    () => Math.floor(Date.now() / 1000),
    () => 0,
  );
}

/** Current time in ms, rounded to the minute and refreshed every 30 s (0 on the server). */
export function useNowMinute() {
  return useSyncExternalStore(
    (onChange) => {
      const t = setInterval(onChange, 30_000);
      return () => clearInterval(t);
    },
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => 0,
  );
}

// ---- Reads outside React --------------------------------------------------

export const getAccount = () => load();
export const isSignedUp = (s: AccountState = load()) => !!s.profile?.firstName;

// ---- Sign-up --------------------------------------------------------------

function randomCode() {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return String(a[0] % 1_000_000).padStart(6, "0");
}

/** Creates a new 6-digit code for this phone number (replaces any earlier one). */
export function sendCode(phone: string) {
  save({ ...load(), pending: { phone, code: randomCode(), sentAt: Date.now() } });
}

/**
 * Checks the code. On success the phone is verified: the same number keeps its
 * existing profile (signing back in); a different number starts a fresh one.
 */
export function verifyCode(input: string): boolean {
  const s = load();
  if (!s.pending || input !== s.pending.code) return false;
  const samePerson = !!s.profile && s.profile.phone === s.pending.phone;
  const profile = samePerson ? s.profile! : { ...BLANK_PROFILE, phone: s.pending.phone };
  // A different phone number is a different person: start their history fresh.
  save({ ...s, profile, pending: null, bookings: samePerson ? s.bookings : [], draft: samePerson ? s.draft : null });
  return true;
}

export function updateProfile(patch: Partial<Profile>) {
  const s = load();
  const base = s.profile ?? { ...BLANK_PROFILE, phone: "" };
  save({ ...s, profile: { ...base, ...patch } });
}

/** Log out: forget everything saved on this device and start over. */
export function clearAccount() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("sparetime."))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
  save(EMPTY);
}

// ---- Bookings ---------------------------------------------------------------

const LATE_CANCEL_MS = 2 * 60 * 60_000;

export const useBookings = () => useAccount().bookings;
export const getBooking = (id: string) => load().bookings.find((b) => b.id === id);

/** A booking with no staff confirmation by the end of its slot counts as missed. */
export const isMissed = (b: Booking, nowMs: number) => b.status === "booked" && new Date(b.endsAt).getTime() < nowMs;
/** Booked and not over yet. */
export const isActive = (b: Booking, nowMs: number) => b.status === "booked" && new Date(b.endsAt).getTime() >= nowMs;

/** Trust-ladder counts from the person's real history. */
export function historyCounts(bookings: Booking[], nowMs: number) {
  return {
    keptCount: bookings.filter((b) => b.status === "kept").length,
    missCount: bookings.filter((b) => (b.status === "cancelled" && b.lateCancel) || isMissed(b, nowMs)).length,
  };
}

export function setDraft(draft: Draft) {
  save({ ...load(), draft });
}

export function setReschedule(id: string | null) {
  save({ ...load(), reschedule: id });
}

function randomDigits(n: number) {
  const a = new Uint32Array(n);
  crypto.getRandomValues(a);
  return Array.from(a, (x) => String(x % 10)).join("");
}

/** Turns the draft into a real booking. Limits are checked by the caller. */
export function createBooking(input: Omit<Booking, "id" | "ref" | "pin" | "status" | "createdAt">): Booking {
  const booking: Booking = {
    ...input,
    id: `bk${Date.now().toString(36)}${randomDigits(3)}`,
    ref: `SPRT-${randomDigits(4)}`,
    pin: randomDigits(6),
    status: "booked",
    createdAt: new Date().toISOString(),
  };
  const s = load();
  save({ ...s, draft: null, reschedule: null, bookings: [...s.bookings, booking] });
  return booking;
}

function patchBooking(id: string, patch: Partial<Booking>) {
  const s = load();
  save({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
}

/** Cancel; less than 2 hours before the start counts as a miss. */
export function cancelBooking(id: string) {
  const b = getBooking(id);
  if (!b) return;
  patchBooking(id, { status: "cancelled", lateCancel: new Date(b.startsAt).getTime() - Date.now() < LATE_CANCEL_MS });
}

/** Demo stand-in for "Business confirms": marks the visit as kept. */
export function markKept(id: string) {
  patchBooking(id, { status: "kept", keptAt: new Date().toISOString() });
}

export const isLateToCancel = (b: Booking, nowMs: number) => new Date(b.startsAt).getTime() - nowMs < LATE_CANCEL_MS;

// ---- Phone helpers ----------------------------------------------------------

/** Keeps up to 10 digits; drops a leading US country code "1". */
export function phoneDigits(value: string) {
  let d = value.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.slice(0, 10);
}

export function formatPhone(d: string) {
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** A valid US number: 10 digits, area code and exchange not starting with 0 or 1. */
export const isValidUsPhone = (d: string) => /^[2-9]\d{2}[2-9]\d{6}$/.test(d);

/** "(213) 555-0123" → "(213) ***-**23" */
export const maskPhone = (phone: string) => phone.replace(/\d{3}-\d{2}(\d{2})$/, "***-**$1");
