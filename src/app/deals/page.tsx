"use client";

import { useState } from "react";
import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { IconButton } from "@/components/ui/icon-button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { InfoBox } from "@/components/ui/info-box";
import { OfferCard, type Offer } from "@/components/ui/offer-card";
import { businesses, services, getBusiness, type Category } from "@/lib/mock-data";

// H1 · Deals. The main browse screen. Offers come from mock data; category chips
// filter the list.
const AVAIL: Record<string, string> = {
  s1: "Today · 2–4 pm",
  s2: "Today · 1–3 pm · 3 left",
  s3: "Today · 4–6 pm",
  s4: "Tomorrow · 10 am–12 pm",
};

const offers: (Offer & { category: Category })[] = services.map((s) => {
  const b = getBusiness(s.businessId)!;
  return {
    id: s.id,
    title: s.name,
    business: b.name,
    rating: b.rating,
    distanceMi: b.distanceMi,
    price: s.offPeakPrice,
    regular: s.regularPrice,
    availability: AVAIL[s.id] ?? "Today",
    photoHue: b.photoHue,
    category: b.category,
  };
});

const CHIPS: { key: string; label: string; cat?: Category }[] = [
  { key: "foryou", label: "For you" },
  { key: "all", label: "All" },
  { key: "haircut", label: "Haircuts", cat: "haircut" },
  { key: "laundry", label: "Laundry", cat: "laundry" },
  { key: "care", label: "Clothing care", cat: "care" },
];

export default function DealsPage() {
  const [chip, setChip] = useState("foryou");
  const activeCat = CHIPS.find((c) => c.key === chip)?.cat;
  const shown = activeCat ? offers.filter((o) => o.category === activeCat) : offers;

  return (
    <Screen>
      <ScreenBody className="px-0 py-0">
        <div className="flex items-center justify-between px-5 pt-4">
          <p className="text-title-md text-text-heading">Good morning, Dana</p>
          <IconButton icon="sliders" label="Settings" />
        </div>

        <div className="mt-2 flex items-center justify-between px-5">
          <h1 className="text-headline-sm text-text-heading">Deals near you</h1>
          <button className="inline-flex h-9 items-center gap-1 rounded-full border border-action-primary px-3 text-label-md text-action-primary">
            <Icon name="map-pin" size={16} /> Map
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 px-5">
          <div className="flex h-12 flex-1 items-center gap-2 rounded-full bg-surface-muted px-4">
            <Icon name="search" size={20} className="text-text-secondary" />
            <input
              placeholder="Search offers or places"
              aria-label="Search offers or places"
              className="w-full bg-transparent text-body-md text-text-primary outline-none placeholder:text-text-secondary"
            />
          </div>
          <button
            aria-label="Filters, 1 active"
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-action-primary text-on-action"
          >
            <Icon name="sliders" size={20} />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-label-sm text-on-action">
              1
            </span>
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {CHIPS.map((c) => (
            <Chip key={c.key} as="tab" selected={chip === c.key} onClick={() => setChip(c.key)}>
              {c.label}
            </Chip>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between px-5">
          <h2 className="text-title-sm text-text-heading">For you today &amp; tomorrow</h2>
          <span className="text-body-sm text-text-secondary">{shown.length} offers</span>
        </div>
        <p className="mt-1 px-5 text-body-sm text-text-secondary">
          Full-length appointments, just at quieter hours. Rated by people who booked.
        </p>

        <div className="mt-3 flex flex-col gap-3 px-5">
          {shown.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>

        <div className="px-5 py-5">
          <InfoBox tone="subtle">
            <span className="font-bold text-on-tint-primary">Own a local shop?</span> List your slow hours on
            Sparetime. <span className="font-bold text-action-primary underline">Learn more</span>
          </InfoBox>
        </div>
      </ScreenBody>

      <NavBar active="deals" />
    </Screen>
  );
}
