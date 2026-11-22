import { Icon } from "./icon";
import { FavoriteHeart } from "./favorite-heart";
import { NavLink } from "@/components/ui/nav-link";

// Offer card for the Deals list: photo + discount badge, title, business · rating ·
// distance, price (paid / regular / save), availability. The whole card opens the
// offer (stretched link); the heart is a separate button that saves the place.
export interface Offer {
  id: string;
  businessId: string;
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
    <div className="relative flex items-stretch gap-3 rounded-lg border border-border-default bg-surface-card p-3 transition-colors hover:bg-surface-muted">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={offer.photo} alt="" className="h-full w-full object-cover" />
        <span className="absolute bottom-1 left-1 rounded-xs bg-accent-primary px-1.5 py-0.5 text-label-sm text-on-action">
          {pct}% off
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <NavLink
          href={`/offer/${offer.id}`}
          dir="forward"
          className="line-clamp-2 text-title-sm text-text-primary after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-focus-ring"
        >
          {offer.title}
        </NavLink>
        {/* Shop on its own line; rating and distance on the next, so on narrow
            phones nothing important is cut off. Title may use 2 lines. */}
        <p className="truncate text-body-sm text-text-secondary">{offer.business}</p>
        <p className="text-body-sm text-text-secondary">
          ★ {offer.rating} · {offer.distanceMi} mi
        </p>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-title-md text-text-primary">${offer.price}</span>
          <span className="text-body-sm text-text-secondary line-through">reg ${offer.regular}</span>
          <span className="text-label-md text-status-positive">Save ${save}</span>
        </div>
        <p className="text-body-sm text-text-secondary">{offer.availability}</p>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between">
        <FavoriteHeart businessId={offer.businessId} businessName={offer.business} variant="plain" className="-mt-2 -mr-2" />
        <Icon name="chevron-right" size={20} className="mb-2 text-text-secondary" />
      </div>
    </div>
  );
}
