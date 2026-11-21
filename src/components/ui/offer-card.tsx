import Link from "next/link";
import { Icon } from "./icon";

// Offer card for the Deals list: placeholder photo + discount badge, title,
// business · rating · distance, price (paid / regular / save), availability.
export interface Offer {
  id: string;
  title: string;
  business: string;
  rating: number;
  distanceMi: number;
  price: number;
  regular: number;
  availability: string;
  photo: string;
}

export function OfferCard({ offer }: { offer: Offer }) {
  const save = offer.regular - offer.price;
  const pct = Math.round((save / offer.regular) * 100);
  return (
    <Link
      href={`/offer/${offer.id}`}
      className="flex items-stretch gap-3 rounded-lg border border-border-default bg-surface-card p-3 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={offer.photo} alt="" className="h-full w-full object-cover" />
        <span className="absolute bottom-1 left-1 rounded-xs bg-accent-primary px-1.5 py-0.5 text-label-sm text-on-action">
          {pct}% off
        </span>
        <span className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface-default/90 text-text-secondary">
          <Icon name="heart" size={16} />
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <p className="truncate text-title-sm text-text-primary">{offer.title}</p>
        <p className="truncate text-body-sm text-text-secondary">
          {offer.business} · ★ {offer.rating} · {offer.distanceMi} mi
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-title-md text-text-primary">${offer.price}</span>
          <span className="text-body-sm text-text-secondary line-through">reg ${offer.regular}</span>
          <span className="text-label-md text-status-positive">Save ${save}</span>
        </div>
        <p className="text-body-sm text-text-secondary">{offer.availability}</p>
      </div>

      <Icon name="chevron-right" size={20} className="self-center text-text-secondary" />
    </Link>
  );
}
