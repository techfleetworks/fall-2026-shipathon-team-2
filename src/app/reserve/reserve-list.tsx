"use client";

import Link from "next/link";
import { useState } from "react";
import {
  listings,
  getStore,
  isAvailable,
  type Category,
} from "@/lib/fake-data";
import { formatPrice, formatTimeRange } from "@/lib/format";

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

  const filtersActive = category !== "all" || price !== "all" || tags.length > 0;

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
              className={`min-h-[40px] rounded-lg border px-4 text-sm font-medium transition ${
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
              className={`rounded-lg border px-3 py-1.5 text-sm transition ${
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
              className={`rounded-lg border px-3 py-1.5 text-sm transition ${
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

      {/* Feed */}
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          No items match these filters. Try clearing some.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((item) => {
            const store = getStore(item.store_id);
            return (
              <li key={item.id}>
                <Link
                  href={`/reserve/${item.id}`}
                  className="flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[0_2px_8px_rgba(28,25,23,0.04)] transition-colors hover:border-primary"
                >
                  {/* Photo slot (placeholder until real 4:3 photos) */}
                  <div
                    className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-price-soft text-3xl"
                    aria-hidden
                  >
                    {item.emoji}
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5">
                    {/* 1. Pickup window + distance (terracotta) */}
                    <span className="inline-flex w-fit items-center gap-1 rounded-lg bg-pickup/10 px-2 py-0.5 font-mono text-sm font-medium text-pickup">
                      🕒 {formatTimeRange(item.pickup_start, item.pickup_end)} ·{" "}
                      {store?.distance_mi} mi
                    </span>

                    {/* 2. Title + store */}
                    <div className="flex flex-col">
                      <span className="font-display font-semibold leading-tight">
                        {item.title}
                      </span>
                      <span className="text-sm text-muted">{store?.name}</span>
                    </div>

                    {/* 3. Dietary tags + 4. Price */}
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {item.dietary_tags.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-background px-1.5 py-0.5 text-xs text-muted"
                          >
                            {label(t)}
                          </span>
                        ))}
                      </div>
                      {item.price_cents === 0 ? (
                        <span className="shrink-0 rounded-lg bg-accent-soft px-2 py-1 text-sm font-semibold text-accent">
                          Free
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-lg bg-price-soft px-2 py-1 font-mono text-sm font-semibold text-price">
                          {formatPrice(item.price_cents)}{" "}
                          <s className="font-normal text-muted">
                            {formatPrice(item.original_price_cents)}
                          </s>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
