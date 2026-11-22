"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { ButtonLink } from "@/components/ui/button";
import { FavoriteHeart } from "@/components/ui/favorite-heart";
import { BrowseHeader } from "@/components/browse/browse-header";
import { NoResults } from "@/components/browse/no-results";
import { DrawnMap, type MapPin } from "@/components/browse/drawn-map";
import { MapSheet } from "@/components/browse/map-sheet";
import { browseOffers, useBrowse } from "@/lib/browse";
import { useHydrated, useNowMinute, useProfile } from "@/lib/account";
import { plural, savings } from "@/lib/mock-data";
import { formatTime, relativeDay, sameDay } from "@/lib/slots";
import { markNav } from "@/lib/nav-motion";

// H1m · Deals (map). The drawn map fills the screen and stays still (pins = shops
// with matching offers, price shown, selected adds "Save $X"); matching offers
// are in a slide-up panel over it (MapSheet). Card → Offer (details
// first); "See open times" → Pick a time (shortcut). Same search, tabs and
// filters as the list.
export default function DealsMapPage() {
  const profile = useProfile();
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const browse = useBrowse();
  const [selected, setSelected] = useState<string | null>(null);

  const clock = hydrated ? nowMs : 0;
  const shown = browseOffers(browse, profile?.needs ?? [], clock);

  // One pin per shop: its cheapest matching offer.
  const pins: MapPin[] = [];
  for (const o of shown) {
    const existing = pins.find((p) => p.business.id === o.business.id);
    if (!existing) pins.push({ business: o.business, price: o.service.offPeakPrice, save: savings(o.service), serviceId: o.service.id });
    else if (o.service.offPeakPrice < existing.price) {
      existing.price = o.service.offPeakPrice;
      existing.save = savings(o.service);
      existing.serviceId = o.service.id;
    }
  }
  const sel = pins.some((p) => p.business.id === selected) ? selected : null;
  const list = sel ? [...shown].sort((a, b) => Number(b.business.id === sel) - Number(a.business.id === sel)) : shown;

  const select = (id: string) => {
    setSelected(id === sel ? null : id);
    if (id !== sel) document.getElementById(`map-offer-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <Screen className="h-dvh overflow-hidden">
      <ScreenBody className="flex min-h-0 flex-col px-0 py-0 overflow-hidden!">
        <BrowseHeader mode="map" resultCount={shown.length} />

        <div className="relative mt-3 min-h-0 flex-1">
          <DrawnMap pins={pins} selected={sel} onSelect={select} area={profile?.area} className="h-full" />

          <MapSheet coverSelector={`[role="tablist"][aria-label="Service"]`} title={shown.length === 0 ? "No offers nearby" : `${plural(shown.length, "offer")} nearby`}>
          <p className="sr-only" aria-live="polite">
            {plural(shown.length, "offer")} nearby
          </p>
          {shown.length === 0 ? (
            <NoResults />
          ) : (
            <>
              <ul className="flex flex-col gap-3 px-5 pt-1 pb-5">
                {list.map((o) => {
                  const first = o.matching[0]?.start;
                  const now = new Date(clock);
                  const left = first ? o.matching.filter((s) => sameDay(s.start, first)).length : 0;
                  const pct = Math.round((savings(o.service) / o.service.regularPrice) * 100);
                  return (
                    <li
                      key={o.service.id}
                      id={`map-offer-${o.business.id}`}
                      className={cn(
                        "relative overflow-hidden rounded-lg border bg-surface-card",
                        sel === o.business.id ? "border-status-positive ring-2 ring-status-positive" : "border-border-default",
                      )}
                    >
                      <div className="relative h-32 w-full bg-surface-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={o.business.photo} alt="" className="h-full w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded-xs bg-accent-primary px-1.5 py-0.5 text-label-sm text-on-action">
                          {pct}% off
                        </span>
                        <div className="absolute right-1 top-1 z-10">
                          <FavoriteHeart businessId={o.business.id} businessName={o.business.name} />
                        </div>
                      </div>
                      <div className="p-3">
                        <Link
                          href={`/offer/${o.service.id}`}
                          onNavigate={markNav("forward")}
                          className="text-title-sm text-text-primary after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-focus-ring"
                        >
                          {o.service.name}
                        </Link>
                        <p className="text-body-sm text-text-secondary">
                          {o.business.name} · ★ {o.business.rating} · {o.business.distanceMi} mi · {o.business.address}
                        </p>
                        <p className="mt-1 flex items-baseline gap-2">
                          <span className="text-title-md text-text-primary">${o.service.offPeakPrice}</span>
                          <span className="text-body-sm text-text-secondary line-through">reg ${o.service.regularPrice}</span>
                          <span className="text-label-md text-status-positive">Save ${savings(o.service)}</span>
                        </p>
                        <p className="text-body-sm text-text-secondary">
                          {!clock
                            ? "Checking open times…"
                            : first
                              ? `${left} left · ${relativeDay(first, now)}, from ${formatTime(first, true)}`
                              : "No open times soon"}
                        </p>
                        <ButtonLink
                          href={`/offer/${o.service.id}/time`}
                          variant="outlined"
                          fullWidth
                          className="relative z-10 mt-3 text-action-primary!"
                        >
                          See open times
                        </ButtonLink>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          </MapSheet>
        </div>
      </ScreenBody>
      <NavBar active="deals" />
    </Screen>
  );
}
