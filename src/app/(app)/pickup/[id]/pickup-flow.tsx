"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { getListing, getStore, saveDollars } from "@/lib/fake-data";
import { formatDollars } from "@/lib/format";

function Stars({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-16 text-sm">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-pressed={value >= n}
            className="text-2xl leading-none"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill={value >= n ? "var(--primary)" : "none"} stroke={value >= n ? "var(--primary)" : "currentColor"} strokeWidth="1.6" strokeLinejoin="round" className={value >= n ? "" : "text-muted"} aria-hidden>
              <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PickupFlow({ id }: { id: string }) {
  const router = useRouter();
  const { reservations, markPickedUp, isFavorite, toggleFavorite } = useAppStore();
  const reservation = reservations.find((r) => r.id === id);
  const listing = reservation ? getListing(reservation.listingId) : undefined;
  const store = listing ? getStore(listing.store_id) : undefined;

  const [step, setStep] = useState<"code" | "done" | "rate">("code");
  const [pickupStars, setPickupStars] = useState(5);
  const [qualityStars, setQualityStars] = useState(5);
  const [review, setReview] = useState("");
  const [addFav, setAddFav] = useState(true);

  if (!reservation || !listing) {
    return (
      <main className="flex flex-1 flex-col gap-4 px-4 py-10">
        <Link href="/my-pickups" className="text-sm text-muted hover:text-primary">← My pickups</Link>
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          This pickup isn&apos;t available.
        </p>
      </main>
    );
  }

  const free = listing.price_cents === 0;
  const total = listing.price_cents * reservation.quantity;
  const save = saveDollars(listing) * reservation.quantity;

  // P3 · Show code
  if (step === "code") {
    return (
      <main className="flex flex-1 flex-col gap-5 px-4 pb-28 pt-6">
        <Link href="/my-pickups" aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Show this at the counter</h1>

        <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-price-soft">
          {/* QR placeholder */}
          <svg width="160" height="160" viewBox="0 0 160 160" aria-label="QR code" className="text-foreground">
            <rect x="8" y="8" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="8" />
            <rect x="108" y="8" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="8" />
            <rect x="8" y="108" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="8" />
            <rect x="24" y="24" width="12" height="12" fill="currentColor" />
            <rect x="124" y="24" width="12" height="12" fill="currentColor" />
            <rect x="24" y="124" width="12" height="12" fill="currentColor" />
            <rect x="70" y="20" width="10" height="10" fill="currentColor" />
            <rect x="90" y="40" width="10" height="10" fill="currentColor" />
            <rect x="70" y="70" width="20" height="20" fill="currentColor" />
            <rect x="110" y="90" width="10" height="10" fill="currentColor" />
            <rect x="70" y="110" width="10" height="10" fill="currentColor" />
            <rect x="110" y="120" width="12" height="12" fill="currentColor" />
          </svg>
        </div>

        <p className="font-semibold">Code: {reservation.code}</p>
        <div className="text-sm">
          <p>{store?.name}</p>
          <p>{listing.title}</p>
        </div>
        <p className="text-sm text-muted">
          {free ? "Nothing to pay — it's free." : `Only pay ${formatDollars(total)} once you have your bag.`}
        </p>

        <button
          onClick={() => {
            markPickedUp(reservation.id);
            setStep("done");
          }}
          className="mt-auto min-h-[52px] rounded-full bg-primary px-5 font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          Done
        </button>
      </main>
    );
  }

  // P4 · Picked up
  if (step === "done") {
    return (
      <main className="flex flex-1 flex-col gap-5 px-4 pb-28 pt-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          Picked up
          <span className="text-primary">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
          </span>
        </h1>
        <p>
          {free ? "Free — nothing to pay." : `Paid ${formatDollars(total)} at the counter.`}{" "}
          You saved <strong>{formatDollars(save * 100)}</strong> today.
        </p>
        <hr className="border-border" />
        <button
          onClick={() => setStep("rate")}
          className="mt-auto min-h-[52px] rounded-full bg-primary px-5 font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          Rate this pickup
        </button>
      </main>
    );
  }

  // P5 · Rate
  return (
    <main className="flex flex-1 flex-col gap-5 px-4 pb-28 pt-6">
      <button onClick={() => setStep("done")} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <h1 className="text-2xl font-bold tracking-tight">How was it?</h1>
      <p className="text-sm text-muted">{store?.name}</p>

      <Stars label="Pickup" value={pickupStars} onChange={setPickupStars} />
      <Stars label="Quality" value={qualityStars} onChange={setQualityStars} />

      <label className="text-sm text-muted" htmlFor="review">Leave a review (optional)</label>
      <textarea
        id="review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Tell us how it went"
        rows={4}
        className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted"
      />

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <span className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${addFav ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface"}`}>
          {addFav && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>}
        </span>
        <input type="checkbox" checked={addFav} onChange={(e) => setAddFav(e.target.checked)} className="sr-only" />
        Add {store?.name} to favorites
      </label>

      <button
        onClick={() => {
          if (store && addFav && !isFavorite(store.id)) toggleFavorite(store.id);
          router.push("/my-pickups");
        }}
        className="mt-auto min-h-[52px] rounded-full bg-primary px-5 font-semibold text-primary-foreground transition hover:bg-primary-hover"
      >
        Submit
      </button>
    </main>
  );
}
