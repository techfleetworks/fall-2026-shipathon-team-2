"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getListing,
  getStore,
  saveDollars,
} from "@/lib/fake-data";
import { formatDollars } from "@/lib/format";
import FavoriteButton from "@/components/favorite-button";

function makeCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `PLNTY-${code}`;
}

export default function Listing({ id }: { id: string }) {
  const item = getListing(id);
  const store = item ? getStore(item.store_id) : undefined;
  const [qty, setQty] = useState(1);
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [soldOut, setSoldOut] = useState(false);

  if (!item) {
    return (
      <main className="flex flex-1 flex-col gap-4 px-4 py-10">
        <Link href="/deals" className="text-sm text-muted hover:text-primary">
          ← Back to deals
        </Link>
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          Sorry, this bag isn&apos;t available anymore.
        </p>
      </main>
    );
  }

  const free = item.price_cents === 0;
  const demoSellsOut = item.quantity_left === 1; // last-one demo
  const total = item.price_cents * qty;

  function reserve() {
    setSaving(true);
    setTimeout(() => {
      if (demoSellsOut) {
        setSoldOut(true);
        setSaving(false);
        return;
      }
      setCode(makeCode());
      setSaving(false);
    }, 600);
  }

  // Sold out while deciding
  if (soldOut) {
    return (
      <main className="flex flex-1 flex-col gap-4 px-4 py-10">
        <Link href="/deals" className="text-sm text-muted hover:text-primary">
          ← Back to deals
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Just missed it</h1>
        <p className="text-muted">
          Sorry — the <strong>{item.title}</strong> from {store?.name} was just
          claimed. Someone grabbed the last one.
        </p>
        <Link
          href="/deals"
          className="mt-2 rounded-full bg-primary px-5 py-3 text-center font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          Browse other bags
        </Link>
      </main>
    );
  }

  // Reserved confirmation
  if (code) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight">You&apos;re all set</h1>
        <p className="text-muted">
          Show this code at {store?.name} during your pickup window.
        </p>
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-8">
          <span className="text-xs uppercase tracking-wide text-muted">Pickup code</span>
          <span className="text-3xl font-bold tracking-widest text-primary">{code}</span>
          <span className="text-sm text-muted">Pick up {item.pickup_label}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-5 text-sm">
          <span className="font-semibold">
            {qty} × {item.title}
          </span>
          <span className="text-muted">{store?.name} · {store?.address}</span>
          <span className="text-muted">
            {free ? "Free — nothing to pay" : `Pay ${formatDollars(total)} at the store`}
          </span>
        </div>
        <Link
          href="/my-pickups"
          className="rounded-full bg-primary px-5 py-3 text-center font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          View my pickups
        </Link>
      </main>
    );
  }

  // Listing detail
  return (
    <main className="flex flex-1 flex-col gap-5 px-4 pb-28 pt-6">
      <Link
        href="/deals"
        aria-label="Back"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-primary"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m15 18-6-6 6-6" />
        </svg>
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>

      {/* Image placeholder */}
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-price-soft text-5xl" aria-hidden>
        {item.emoji}
      </div>

      {/* Store + favorite */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-muted">
          {store?.name} · {store?.distance_mi} mi
        </span>
        <FavoriteButton />
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-center gap-2">
        {free ? (
          <span className="text-3xl font-bold text-primary">Free</span>
        ) : (
          <>
            <span className="text-3xl font-bold">{formatDollars(item.price_cents)}</span>
            <span className="text-sm text-muted line-through">
              regularly {formatDollars(item.original_price_cents)}
            </span>
            <span className="rounded-full bg-primary-hover px-2.5 py-1 text-sm font-semibold text-primary-foreground">
              Save {formatDollars(saveDollars(item) * 100)}
            </span>
          </>
        )}
      </div>

      <span className="w-fit rounded-full border border-border px-3 py-1 text-sm">
        Only {item.quantity_left} bags left
      </span>

      <div className="flex flex-col gap-1 text-sm">
        <span><strong>Best by:</strong> {item.best_by_label}</span>
        <span><strong>Pick up:</strong> {item.pickup_label}</span>
        <span><strong>Includes:</strong> {item.includes.join(", ")}</span>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">How many bags?</p>
          <p className="text-sm text-muted">
            Total {free ? "Free" : formatDollars(total)}
            {!free && " · pay at the store"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Fewer bags"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg transition hover:border-primary disabled:opacity-40"
          >
            −
          </button>
          <span className="w-5 text-center text-lg font-semibold" aria-live="polite">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(item.quantity_left, q + 1))}
            disabled={qty >= item.quantity_left}
            aria-label="More bags"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg transition hover:border-primary disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Reserve CTA (fixed to bottom area) */}
      {free ? (
        <Link
          href="/welcome"
          className="min-h-[52px] rounded-full bg-primary px-5 py-3.5 text-center font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          Verify to reserve (free)
        </Link>
      ) : (
        <button
          onClick={reserve}
          disabled={saving}
          className="min-h-[52px] rounded-full bg-primary px-5 py-3.5 text-center font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? "Reserving…" : "Reserve your pickup"}
        </button>
      )}
      <p className="text-center text-xs text-muted">
        {free
          ? "Free bags are for verified members."
          : "Pay at the store on pickup. Free cancellation within 5 minutes."}
      </p>
    </main>
  );
}
