import Link from "next/link";
import Image from "next/image";
import {
  type Listing,
  getStore,
  saveDollars,
  discountPct,
} from "@/lib/fake-data";
import { formatDollars } from "@/lib/format";
import FavoriteButton from "@/components/favorite-button";

function MetroChip() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[9px] font-semibold">
        M
      </span>
      Near Metro
    </span>
  );
}

export default function BagCard({ listing }: { listing: Listing }) {
  const store = getStore(listing.store_id);
  const free = listing.price_cents === 0;
  const pct = discountPct(listing);
  const save = saveDollars(listing);

  return (
    <Link
      href={`/deals/${listing.id}`}
      className="flex gap-3 rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-card,0_2px_8px_rgba(0,0,0,0.05))] transition-colors hover:border-primary"
    >
      {/* Thumbnail */}
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-price-soft">
        {listing.image_key ? (
          <Image src={`/bags/${listing.image_key}`} alt="" width={80} height={80} className="h-full w-full object-contain p-1.5" />
        ) : (
          <span className="text-3xl" aria-hidden>{listing.emoji}</span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Store · distance + favorite */}
        <div className="flex items-start justify-between gap-2">
          <span className="truncate font-semibold leading-tight">
            {store?.name} · {store?.distance_mi} mi
          </span>
          <FavoriteButton storeId={listing.store_id} size={28} />
        </div>

        {/* Bag title */}
        <span className="text-sm text-muted">{listing.title}</span>

        {/* Price */}
        <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {free ? (
            <span className="text-xl font-bold text-primary">Free</span>
          ) : (
            <>
              <span className="text-xl font-bold text-price">
                {formatDollars(listing.price_cents)}
              </span>
              <span className="text-sm text-muted line-through">
                reg {formatDollars(listing.original_price_cents)}
              </span>
              <span className="text-sm font-semibold text-savings">
                Save {formatDollars(save * 100)}
              </span>
            </>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {free ? (
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-hover">
              Members only
            </span>
          ) : (
            <span className="rounded-full bg-primary-hover px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              {pct}% off
            </span>
          )}
          {listing.near_metro && <MetroChip />}
          {listing.quantity_left <= 3 && (
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
              {listing.quantity_left} left
            </span>
          )}
        </div>

        {/* Pickup */}
        <span className="text-xs text-muted">Pick up {listing.pickup_label}</span>
      </div>
    </Link>
  );
}
