"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getListing, getStore } from "@/lib/fake-data";
import { formatDollars } from "@/lib/format";

export default function MyPickups() {
  const { reservations, savedThisMonth, pickupCount } = useAppStore();
  const upcoming = reservations.filter((r) => r.status === "upcoming");
  const past = reservations.filter((r) => r.status === "picked_up");

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight">My pickups</h1>

      {reservations.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          No pickups yet. Reserve a bag from the Deals tab.
        </p>
      )}

      {upcoming.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Upcoming</h2>
          {upcoming.map((r) => {
            const l = getListing(r.listingId);
            const store = l ? getStore(l.store_id) : undefined;
            if (!l) return null;
            return (
              <Link
                key={r.id}
                href={`/pickup/${r.id}`}
                className="rounded-2xl border-2 border-primary bg-surface px-4 py-3 transition-colors hover:bg-primary-soft/40"
              >
                <p className="font-semibold">{store?.name}</p>
                <p className="text-sm text-muted">Pick up {l.pickup_label}</p>
                <p className="text-sm text-muted">
                  {l.title} · {l.price_cents === 0 ? "Free" : formatDollars(l.price_cents * r.qty)}
                </p>
              </Link>
            );
          })}
        </section>
      )}

      {past.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Past</h2>
          {past.map((r) => {
            const l = getListing(r.listingId);
            const store = l ? getStore(l.store_id) : undefined;
            if (!l) return null;
            return (
              <div key={r.id} className="rounded-2xl border border-border bg-surface px-4 py-3">
                <p className="font-semibold">{store?.name}</p>
                <p className="text-sm text-muted">{l.title} · picked up</p>
              </div>
            );
          })}
        </section>
      )}

      {pickupCount > 0 && (
        <p className="text-sm text-muted">
          {formatDollars(savedThisMonth * 100)} saved this month · {pickupCount}{" "}
          {pickupCount === 1 ? "pickup" : "pickups"}
        </p>
      )}
    </div>
  );
}
