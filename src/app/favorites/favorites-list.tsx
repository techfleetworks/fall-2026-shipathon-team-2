"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LoadingRow } from "@/components/ui/spinner";
import { FavoriteHeart } from "@/components/ui/favorite-heart";
import { InfoBox } from "@/components/ui/info-box";
import { getBusiness, servicesAt } from "@/lib/mock-data";
import { placeOfferStatus } from "@/lib/slots";
import { useFavorites, useHydrated, useNowMinute } from "@/lib/account";

// H4 · the person's saved places (on this device), newest first, each with its
// live offer status. Empty until they tap a heart.
export function FavoritesList() {
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const favorites = useFavorites();

  if (!hydrated || nowMs === 0) return <div className="mt-4"><LoadingRow label="Loading your favorites…" /></div>;

  if (favorites.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center rounded-lg border border-border-default px-5 py-5 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle text-on-tint-primary">
          <Icon name="heart" size={22} />
        </span>
        <p className="mt-3 text-title-sm text-text-primary">No saved places yet</p>
        <p className="mt-1 text-body-md text-text-secondary">Tap the heart on any offer to save it here.</p>
        <ButtonLink href="/deals" fullWidth className="mt-4">
          Find offers near you
        </ButtonLink>
      </div>
    );
  }

  const now = new Date(nowMs);
  return (
    <>
    <ul className="mt-4 flex flex-col gap-3">
      {favorites.map((id) => {
        const b = getBusiness(id);
        if (!b) return null;
        const offers = servicesAt(b.id);
        const status = placeOfferStatus(b, offers, now);
        return (
          <li
            key={b.id}
            className="relative flex items-center gap-3 rounded-lg border border-border-default p-4 transition-colors hover:bg-surface-muted"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.photo} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/offer/${offers[0].id}`}
                className="text-title-sm text-text-primary after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-focus-ring"
              >
                {b.name}
              </Link>
              <p className="text-body-sm text-text-secondary">
                {b.blurb} · {b.distanceMi} mi
              </p>
              <p className="text-body-sm text-text-secondary">{b.address}</p>
              <div className="mt-1">
                <StatusBadge tone={status.open ? "positive" : "neutral"}>{status.text}</StatusBadge>
              </div>
            </div>
            <FavoriteHeart businessId={b.id} businessName={b.name} variant="plain" className="relative z-10" />
          </li>
        );
      })}
    </ul>
    <InfoBox className="mt-4">
      Tap the heart on any offer to save a place. Turn on alerts for favorites in Settings.
    </InfoBox>
    </>
  );
}
