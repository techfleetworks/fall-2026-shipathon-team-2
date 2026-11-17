"use client";

import Link from "next/link";
import { useState } from "react";
import { listings, isAvailable, getStore } from "@/lib/fake-data";
import BagCard from "@/components/bag-card";

const DIETARY = [
  { key: "vegetarian", label: "Vegetarian" },
  { key: "halal", label: "Halal" },
  { key: "dairy_free", label: "Dairy-free" },
  { key: "gluten_free", label: "Gluten-free" },
  { key: "vegan", label: "Vegan" },
  { key: "nut_free", label: "Nut-free" },
] as const;

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface"
        }`}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

export default function DealsList() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"map" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [metroOnly, setMetroOnly] = useState(false);
  const [dietary, setDietary] = useState<string[]>([]);

  function toggleDietary(key: string) {
    setDietary((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));
  }

  const available = listings.filter(isAvailable);
  const q = query.trim().toLowerCase();
  const visible = available.filter((l) => {
    const store = getStore(l.store_id);
    if (q && !(l.title.toLowerCase().includes(q) || (store?.name.toLowerCase().includes(q) ?? false)))
      return false;
    if (metroOnly && !l.near_metro) return false;
    if (dietary.length > 0 && !dietary.every((d) => l.dietary_tags.includes(d))) return false;
    return true;
  });

  const filterCount = (metroOnly ? 1 : 0) + dietary.length;

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      {/* Header + Map/List toggle */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Deals near you</h1>
        <div className="flex items-center gap-4 text-sm font-medium">
          {(["map", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`pb-0.5 capitalize transition-colors ${
                view === v ? "border-b-2 border-primary text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-muted" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals or stores"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            aria-label="Search deals or stores"
          />
        </div>
        <button
          onClick={() => setShowFilters(true)}
          aria-label="Filters"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          {filterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {filterCount}
            </span>
          )}
        </button>
      </div>

      {/* Your pickup today */}
      <Link
        href="/my-pickups"
        className="rounded-2xl border-2 border-primary bg-surface px-4 py-3 transition-colors hover:bg-primary-soft/40"
      >
        <p className="text-sm font-semibold">Your pickup today</p>
        <p className="text-sm text-muted">Sunrise Bakery · arriving by 4:00 pm</p>
      </Link>

      {/* Count */}
      <p className="text-sm text-muted">
        {visible.length} {visible.length === 1 ? "deal" : "deals"} today
      </p>

      {/* Map view / List */}
      {view === "map" ? (
        <div className="flex h-72 items-center justify-center rounded-2xl bg-primary-soft text-sm text-primary-hover">
          [ Map: deal pins + Metro stops ]
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          No deals match your search or filters. Try clearing some.
        </p>
      ) : (
        <ul className="flex flex-col gap-3 pb-4">
          {visible.map((l) => (
            <li key={l.id}>
              <BagCard listing={l} />
            </li>
          ))}
        </ul>
      )}

      {/* Filters sheet (R3) */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-4 pt-6">
            <button
              onClick={() => setShowFilters(false)}
              aria-label="Close filters"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <h2 className="mt-4 text-2xl font-bold tracking-tight">Filters</h2>

            {/* Area */}
            <p className="mt-5 text-sm font-semibold">Area</p>
            <select
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
              defaultValue="Palms"
              aria-label="Area"
            >
              <option>Palms</option>
              <option>Mar Vista</option>
              <option>Culver City</option>
            </select>

            {/* Near transit */}
            <p className="mt-5 text-sm font-semibold">Near public transit</p>
            <div className="mt-2 flex gap-6">
              <Checkbox checked={metroOnly} onChange={() => setMetroOnly((v) => !v)} label="Metro" />
              <Checkbox checked={false} onChange={() => {}} label="Bus" />
              <Checkbox checked={false} onChange={() => {}} label="Train" />
            </div>

            {/* Dietary */}
            <p className="mt-5 text-sm font-semibold">Dietary</p>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3">
              {DIETARY.map((d) => (
                <Checkbox
                  key={d.key}
                  checked={dietary.includes(d.key)}
                  onChange={() => toggleDietary(d.key)}
                  label={d.label}
                />
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-2 py-6">
              {filterCount > 0 && (
                <button
                  onClick={() => {
                    setMetroOnly(false);
                    setDietary([]);
                  }}
                  className="text-center text-sm font-medium text-primary underline"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="min-h-[52px] rounded-full bg-primary px-5 font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                Show {visible.length} {visible.length === 1 ? "result" : "results"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
