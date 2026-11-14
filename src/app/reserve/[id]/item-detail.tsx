"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getListing, getStore } from "@/lib/fake-data";
import {
  formatPrice,
  formatPickupWindow,
  formatTimeRange,
  formatBestBy,
} from "@/lib/format";

type Slot = { start: string; end: string };

// Split the item's pickup window into 30-minute slots the user can choose from.
function makeSlots(startIso: string, endIso: string): Slot[] {
  const slots: Slot[] = [];
  const half = 30 * 60 * 1000;
  let t = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  while (t + half <= end) {
    slots.push({ start: new Date(t).toISOString(), end: new Date(t + half).toISOString() });
    t += half;
  }
  if (slots.length === 0) slots.push({ start: startIso, end: endIso });
  return slots;
}

function makeCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `PLNTY-${code}`;
}

export default function ItemDetail({ id }: { id: string }) {
  const item = getListing(id);
  const store = item ? getStore(item.store_id) : undefined;

  const slots = useMemo(
    () => (item ? makeSlots(item.pickup_start, item.pickup_end) : []),
    [item],
  );

  const [slotIndex, setSlotIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  // Item not found
  if (!item) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-16">
        <Link href="/reserve" className="text-sm text-muted hover:text-primary">
          ← Back to browse
        </Link>
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          Sorry, this item isn&apos;t available anymore.
        </p>
      </main>
    );
  }

  const isFree = item.price_cents === 0;

  function reserve() {
    setSaving(true);
    // Mock save. Real reserving (via Supabase) is the J3 integration task later.
    setTimeout(() => {
      setCode(makeCode());
      setSaving(false);
    }, 600);
  }

  // --- Confirmation screen (after reserving) ---
  if (code) {
    const slot = slots[slotIndex ?? 0];
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          You&apos;re all set 🎉
        </h1>
        <p className="text-muted">
          Show this code at {store?.name} during your pickup window.
        </p>

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8">
          <span className="text-sm uppercase tracking-wide text-muted">
            Pickup code
          </span>
          <span className="font-display text-3xl font-semibold tracking-widest text-primary">
            {code}
          </span>
          <span className="text-sm text-muted">
            {formatPickupWindow(slot.start, slot.end)}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-5 text-sm">
          <span className="font-medium">{item.title}</span>
          <span className="text-muted">
            {store?.name} · {store?.address}
          </span>
          <span className="text-muted">
            {isFree
              ? "Free — nothing to pay"
              : `Pay ${formatPrice(item.price_cents)} at the store`}
          </span>
        </div>

        <Link
          href="/reserve"
          className="rounded-full border border-border px-5 py-3 text-center font-semibold transition hover:border-primary"
        >
          Browse more items
        </Link>
      </main>
    );
  }

  // --- Detail + pickup picker + reserve ---
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link href="/reserve" className="text-sm text-muted hover:text-primary">
        ← Back to browse
      </Link>

      <header className="flex items-start gap-4">
        <span className="text-5xl" aria-hidden>
          {item.emoji}
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {item.title}
          </h1>
          <p className="text-muted">{item.description}</p>
        </div>
      </header>

      {/* Price */}
      <div className="flex items-center gap-2">
        {isFree ? (
          <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
            Free
          </span>
        ) : (
          <>
            <span className="text-2xl font-semibold text-price">
              {formatPrice(item.price_cents)}
            </span>
            <span className="text-muted line-through">
              {formatPrice(item.original_price_cents)}
            </span>
          </>
        )}
      </div>

      {/* Store + details */}
      <div className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-5 text-sm">
        <span className="font-medium">{store?.name}</span>
        <span className="text-muted">{store?.address}</span>
        <span className="text-muted">
          {item.quantity_left} left · {formatBestBy(item.best_by)}
        </span>
        <span className="text-muted">
          Pickup window: {formatPickupWindow(item.pickup_start, item.pickup_end)}
        </span>
      </div>

      {/* Pickup time picker */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">Pick a pickup time</h2>
        <div className="flex flex-wrap gap-2">
          {slots.map((slot, i) => (
            <button
              key={slot.start}
              onClick={() => setSlotIndex(i)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                slotIndex === i
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted hover:border-primary"
              }`}
            >
              {formatTimeRange(slot.start, slot.end)}
            </button>
          ))}
        </div>
      </div>

      {/* Reserve */}
      <button
        onClick={reserve}
        disabled={slotIndex === null || saving}
        className="rounded-full bg-primary px-5 py-3 text-center font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
          ? "Reserving…"
          : slotIndex === null
            ? "Pick a time to reserve"
            : isFree
              ? "Reserve (Free)"
              : `Reserve for ${formatPrice(item.price_cents)}`}
      </button>
      {!isFree && (
        <p className="text-center text-sm text-muted">
          You&apos;ll pay at the store when you pick up.
        </p>
      )}
    </main>
  );
}
