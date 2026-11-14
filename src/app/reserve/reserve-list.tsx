"use client";

import Link from "next/link";
import { useState } from "react";
import {
  listings,
  getStore,
  isAvailable,
  type Category,
} from "@/lib/fake-data";
import { formatPrice, formatPickupWindow, formatBestBy } from "@/lib/format";

const CATEGORIES: Array<"all" | Category> = [
  "all",
  "produce",
  "bakery",
  "dairy",
  "pantry",
];
const PRICE_FILTERS = ["all", "free", "discounted"] as const;
const DIETARY_TAGS = ["vegetarian", "vegan", "gluten_free"] as const;

function label(s: string): string {
  // "gluten_free" -> "Gluten free", "all" -> "All"
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}

export default function ReserveList() {
  const [category, setCategory] = useState<"all" | Category>("all");
  const [price, setPrice] = useState<(typeof PRICE_FILTERS)[number]>("all");
  const [tags, setTags] = useState<string[]>([]);
  // Mock verification state. Real verified status comes from the user's profile
  // later (Flow 2 / backend). For now a demo toggle stands in.
  const [verified, setVerified] = useState(false);

  function toggleTag(tag: string) {
    setTags((cur) =>
      cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag],
    );
  }

  function clearFilters() {
    setCategory("all");
    setPrice("all");
    setTags([]);
  }

  const filtersActive =
    category !== "all" || price !== "all" || tags.length > 0;

  // Only available items, then apply the filters (they combine).
  const visible = listings
    .filter(isAvailable)
    .filter((l) => category === "all" || l.category === category)
    .filter((l) =>
      price === "all"
        ? true
        : price === "free"
          ? l.price_cents === 0
          : l.price_cents > 0,
    )
    .filter((l) => tags.every((t) => l.dietary_tags.includes(t)))
    // Unverified members don't see free items (they need to verify first).
    .filter((l) => verified || l.price_cents > 0);

  return (
    <>
      {/* Verification status (mock for now) */}
      {verified ? (
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-accent bg-accent-soft px-4 py-3 text-sm">
          <span className="font-semibold text-accent">
            ✓ You&apos;re verified — free items unlocked
          </span>
          <button
            onClick={() => setVerified(false)}
            className="text-muted underline"
          >
            Reset (demo)
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm">
          <span className="text-muted">
            🔒 Free items are reserved for verified members.
          </span>
          <span className="flex items-center gap-4">
            <Link href="/verify" className="font-semibold text-primary underline">
              Verify eligibility →
            </Link>
            <button
              onClick={() => setVerified(true)}
              className="text-muted underline"
            >
              Skip (demo)
            </button>
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted hover:border-primary"
              }`}
            >
              {label(c)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRICE_FILTERS.map((p) => (
            <button
              key={p}
              onClick={() => setPrice(p)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                price === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted hover:border-primary"
              }`}
            >
              {label(p)}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden />
          {DIETARY_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                tags.includes(t)
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted hover:border-primary"
              }`}
            >
              {label(t)}
            </button>
          ))}
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm font-medium text-primary underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* No-match message */}
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          No items match these filters. Try clearing some.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((item) => {
            const store = getStore(item.store_id);
            return (
              <li key={item.id}>
                <Link
                  href={`/reserve/${item.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary"
                >
                  <span className="text-3xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{item.title}</span>
                      {item.price_cents === 0 ? (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                          Free
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm">
                          <span className="font-semibold text-price">
                            {formatPrice(item.price_cents)}
                          </span>
                          <span className="text-muted line-through">
                            {formatPrice(item.original_price_cents)}
                          </span>
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted">{store?.name}</span>
                    <span className="text-xs text-muted">
                      {formatPickupWindow(item.pickup_start, item.pickup_end)} ·{" "}
                      {item.quantity_left} left · {formatBestBy(item.best_by)}
                    </span>
                  </div>
                  <span className="shrink-0 text-muted" aria-hidden>
                    ›
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
