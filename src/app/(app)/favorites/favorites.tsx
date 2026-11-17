"use client";

import Link from "next/link";
import { useAppStore, bestListingForStore } from "@/lib/store";
import { getStore, saveDollars } from "@/lib/fake-data";
import { formatDollars } from "@/lib/format";
import FavoriteButton from "@/components/favorite-button";

export default function Favorites() {
  const { favorites } = useAppStore();

  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>

      {favorites.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          Tap the heart on a store or bag to save it here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {favorites.map((storeId) => {
            const store = getStore(storeId);
            const best = bestListingForStore(storeId);
            if (!store) return null;
            return (
              <li
                key={storeId}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">
                    {store.name} · {store.distance_mi} mi
                  </span>
                  <FavoriteButton storeId={storeId} size={32} />
                </div>
                {best ? (
                  <Link href={`/deals/${best.id}`} className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-price-soft text-2xl" aria-hidden>
                      {best.emoji}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted">Today&apos;s deal</span>
                      <span className="text-sm">{best.title}</span>
                      <span className="text-sm">
                        <strong>{formatDollars(best.price_cents)}</strong>{" "}
                        <span className="text-muted line-through">reg {formatDollars(best.original_price_cents)}</span>{" "}
                        <span className="font-semibold text-savings">Save {formatDollars(saveDollars(best) * 100)}</span>
                      </span>
                    </div>
                  </Link>
                ) : (
                  <p className="text-sm text-muted">
                    No deals right now. We&apos;ll alert you when they post.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
