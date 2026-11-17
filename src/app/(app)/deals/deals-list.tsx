"use client";

import Link from "next/link";
import { useState } from "react";
import { listings, isAvailable, getStore } from "@/lib/fake-data";
import BagCard from "@/components/bag-card";

export default function DealsList() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"map" | "list">("list");

  const available = listings.filter(isAvailable);
  const q = query.trim().toLowerCase();
  const visible = available.filter((l) => {
    if (!q) return true;
    const store = getStore(l.store_id);
    return (
      l.title.toLowerCase().includes(q) ||
      (store?.name.toLowerCase().includes(q) ?? false)
    );
  });

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
                view === v
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted hover:text-foreground"
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
        <Link
          href="/deals/filters"
          aria-label="Filters"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
        </Link>
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

      {/* Map view placeholder / List */}
      {view === "map" ? (
        <div className="flex h-72 items-center justify-center rounded-2xl bg-primary-soft text-sm text-primary-hover">
          [ Map: deal pins + Metro stops ]
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          No deals match “{query}”. Try another search.
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
    </div>
  );
}
