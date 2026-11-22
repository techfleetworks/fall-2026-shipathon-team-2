"use client";

import { useSyncExternalStore } from "react";
import { CATEGORY_LABEL, NEED_TO_CATEGORY, getBusiness, services, type Business, type Category, type Service } from "./mock-data";
import { slotsFor, upcomingDays, type OpenSlot } from "./slots";

// Shared browse state for Deals (list) and Deals → Map: the search text, the
// category tab and the Filters sheet (Figma R3). Kept in memory for this visit so
// switching between list and map keeps your choices; a reload starts fresh.

export type DayFilter = "soon" | "week" | "weekend";
export type TimeFilter = "any" | "morning" | "afternoon" | "evening";
export type TransitFilter = "any" | "metro" | "bus" | "walk";
export type PriceFilter = "any" | "under10" | "10to20";
export type Tab = "foryou" | "all" | Category;

export interface Filters {
  day: DayFilter;
  time: TimeFilter;
  /** Max distance in miles; DISTANCE_ANY means no limit. */
  distance: number;
  transit: TransitFilter;
  price: PriceFilter;
}

export const DISTANCE_ANY = 3;
export const WALKING_MILES = 0.75;
export const DEFAULT_FILTERS: Filters = { day: "soon", time: "any", distance: DISTANCE_ANY, transit: "any", price: "any" };

interface BrowseState {
  query: string;
  tab: Tab;
  filters: Filters;
}

let state: BrowseState = { query: "", tab: "foryou", filters: DEFAULT_FILTERS };
const listeners = new Set<() => void>();
const set = (patch: Partial<BrowseState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export function useBrowse() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

export const setQuery = (query: string) => set({ query });
export const setTab = (tab: Tab) => set({ tab });
export const setFilters = (patch: Partial<Filters>) => set({ filters: { ...state.filters, ...patch } });
export const clearFilters = () => set({ filters: DEFAULT_FILTERS });
export const clearAll = () => set({ filters: DEFAULT_FILTERS, query: "" });

/** How many filter rows differ from the defaults (the badge on the Filters button). */
export const activeFilterCount = (f: Filters) =>
  (Object.keys(DEFAULT_FILTERS) as (keyof Filters)[]).filter((k) => f[k] !== DEFAULT_FILTERS[k]).length;

// ---- Building and filtering offers ---------------------------------------------

export interface BrowseOffer {
  service: Service;
  business: Business;
  /** Free slots in the chosen day window that match the time-of-day filter. */
  matching: OpenSlot[];
  /** Soonest matching free slot start (ms), or Infinity. */
  soonest: number;
}

const DAY_COUNT: Record<DayFilter, number> = { soon: 3, week: 7, weekend: 7 };

function timeMatches(t: TimeFilter, d: Date) {
  const h = d.getHours();
  if (t === "morning") return h < 12;
  if (t === "afternoon") return h >= 12 && h < 17;
  if (t === "evening") return h >= 17;
  return true;
}

function priceMatches(p: PriceFilter, price: number) {
  if (p === "under10") return price < 10;
  if (p === "10to20") return price >= 10 && price <= 20;
  return true;
}

function transitMatches(t: TransitFilter, b: Business) {
  if (t === "walk") return b.distanceMi <= WALKING_MILES;
  if (t === "metro" || t === "bus") return b.transitModes.includes(t);
  return true;
}

function searchMatches(q: string, s: Service, b: Business) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = `${s.name} ${b.name} ${b.area} ${b.blurb} ${CATEGORY_LABEL[b.category]} ${s.includes}`.toLowerCase();
  return words.every((w) => hay.includes(w));
}

/**
 * Offers after search, tab and filters, soonest first. With default filters every
 * offer stays in the feed (showing "No open times soon" if it has none); once a
 * day or time filter is set, only offers with a matching free slot remain.
 */
export function browseOffers(st: BrowseState, needs: string[], nowMs: number): BrowseOffer[] {
  const now = new Date(nowMs);
  const f = st.filters;
  const days = nowMs ? upcomingDays(now, DAY_COUNT[f.day]).filter((d) => f.day !== "weekend" || d.getDay() === 0 || d.getDay() === 6) : [];
  const strictTime = f.day !== DEFAULT_FILTERS.day || f.time !== DEFAULT_FILTERS.time;
  const mine = needs.map((n) => NEED_TO_CATEGORY[n]).filter(Boolean);

  return services
    .map((service) => {
      const business = getBusiness(service.businessId)!;
      const matching = days.flatMap((d) => slotsFor(service, business, d, now).filter((x) => !x.taken && timeMatches(f.time, x.start)));
      return { service, business, matching, soonest: matching.length ? matching[0].start.getTime() : Infinity };
    })
    .filter(({ service, business, matching }) => {
      if (st.tab === "foryou" && mine.length && !mine.includes(business.category)) return false;
      if (st.tab !== "foryou" && st.tab !== "all" && business.category !== st.tab) return false;
      if (!searchMatches(st.query, service, business)) return false;
      if (f.distance < DISTANCE_ANY && business.distanceMi > f.distance) return false;
      if (!transitMatches(f.transit, business)) return false;
      if (!priceMatches(f.price, service.offPeakPrice)) return false;
      if (strictTime && nowMs && matching.length === 0) return false;
      return true;
    })
    .sort((a, b) => a.soonest - b.soonest);
}
