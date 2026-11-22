"use client";

import Link from "next/link";
import { useState } from "react";
import { useFavorites, useHydrated, useNowMinute, useProfile } from "@/lib/account";
import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { InfoBox } from "@/components/ui/info-box";
import { OfferCard } from "@/components/ui/offer-card";
import { BrowseHeader } from "@/components/browse/browse-header";
import { NoResults } from "@/components/browse/no-results";
import { ReminderBanner } from "@/components/booking/reminder-banner";
import { activeFilterCount, browseOffers, useBrowse, type BrowseOffer } from "@/lib/browse";
import { getBusiness, plural, servicesAt } from "@/lib/mock-data";

// How many offers to show before "See all" (the rest are one tap away).
const PREVIEW_COUNT = 4;
import { formatTime, placeOfferStatus, relativeDay, sameDay } from "@/lib/slots";

// H1 · Deals. The main browse screen. Offers are the sample shops' services with
// live availability; search, the category tabs and the Filters sheet narrow them
// (shared with Deals → Map). "For you" shows the services picked at sign-up.

function availabilityText(o: BrowseOffer, nowMs: number) {
  if (!nowMs) return "Checking open times…";
  if (!o.matching.length) return "No open times soon";
  const now = new Date(nowMs);
  const first = o.matching[0].start;
  const sameDayCount = o.matching.filter((s) => sameDay(s.start, first)).length;
  return `${relativeDay(first, now)} · from ${formatTime(first, true)} · ${sameDayCount} left`;
}

export default function DealsPage() {
  const profile = useProfile();
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const favorites = useFavorites();
  const browse = useBrowse();

  const clock = hydrated ? nowMs : 0;
  const shown = browseOffers(browse, profile?.needs ?? [], clock);

  // Show a short list first; "See all" reveals the rest in place. Changing the
  // tab, search or filters collapses it back to the preview (reset during render).
  const [expanded, setExpanded] = useState(false);
  const browseKey = `${browse.tab}|${browse.query}|${JSON.stringify(browse.filters)}`;
  const [lastKey, setLastKey] = useState(browseKey);
  if (browseKey !== lastKey) {
    setLastKey(browseKey);
    setExpanded(false);
  }
  const visible = expanded ? shown : shown.slice(0, PREVIEW_COUNT);

  const heading =
    browse.query.trim() || activeFilterCount(browse.filters) > 0
      ? "Matching offers"
      : browse.tab === "foryou"
        ? "For you, next few days"
        : "All offers";

  return (
    <Screen>
      <ScreenBody className="px-0 py-0">
        <BrowseHeader mode="list" resultCount={shown.length} />
        <ReminderBanner />

        {shown.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div className="mt-4 flex items-center justify-between px-5">
              <h2 className="text-title-sm text-text-heading">{heading}</h2>
              <span className="text-body-sm text-text-secondary" aria-live="polite">
                {plural(shown.length, "offer")}
              </span>
            </div>
            <p className="mt-1 px-5 text-body-sm text-text-secondary">
              Full-length appointments, just at quieter hours. Rated by people who booked.
            </p>

            <div className="mt-3 flex flex-col gap-3 px-5">
              {visible.map((o) => (
                <OfferCard
                  key={o.service.id}
                  offer={{
                    id: o.service.id,
                    businessId: o.business.id,
                    title: o.service.name,
                    business: o.business.name,
                    rating: o.business.rating,
                    distanceMi: o.business.distanceMi,
                    price: o.service.offPeakPrice,
                    regular: o.service.regularPrice,
                    availability: availabilityText(o, clock),
                    photo: o.business.photo,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {shown.length > PREVIEW_COUNT && (
          <div className="px-5 pt-4">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="min-h-[48px] w-full rounded-full border border-border-control py-3 text-label-lg text-text-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              {expanded ? "Show fewer" : `See all ${shown.length} offers →`}
            </button>
          </div>
        )}

        {hydrated && favorites.length > 0 && (
          <>
            <div className="mt-5 flex items-center justify-between px-5">
              <h2 className="text-title-sm text-text-heading">From your favorites</h2>
              <Link
                href="/favorites"
                className="-mr-3 inline-flex min-h-[48px] items-center rounded-full px-3 text-body-sm text-action-primary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                See all<span className="sr-only"> favorites</span>
              </Link>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-1">
              {favorites.map((id) => {
                const b = getBusiness(id);
                if (!b) return null;
                const offers = servicesAt(b.id);
                const cheapest = Math.min(...offers.map((o) => o.offPeakPrice));
                const status = clock ? placeOfferStatus(b, offers, new Date(clock)).text : "";
                return (
                  <Link
                    key={b.id}
                    href={`/offer/${offers[0].id}`}
                    className="w-56 shrink-0 overflow-hidden rounded-lg border border-border-default hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.photo} alt="" className="h-28 w-full object-cover" />
                    <div className="p-3">
                      <p className="truncate text-title-sm text-text-primary">{b.name}</p>
                      <p className="text-body-sm text-text-secondary">{status}</p>
                      <p className="mt-1 text-label-md text-status-positive">
                        {offers.length > 1 ? `From $${cheapest}` : `$${cheapest} · Save $${offers[0].regularPrice - cheapest}`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div className="px-5 py-5">
          <InfoBox tone="subtle">
            <span className="font-bold text-on-tint-primary">Own a local shop?</span> Business sign-up for listing your slow
            hours is coming soon. The shops shown here are samples.
          </InfoBox>
        </div>
      </ScreenBody>

      <NavBar active="deals" />
    </Screen>
  );
}
