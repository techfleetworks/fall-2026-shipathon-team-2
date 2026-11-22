"use client";

import { useState } from "react";
import Link from "next/link";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { useGreeting, useProfile } from "@/lib/account";
import { activeFilterCount, setQuery, setTab, useBrowse, type Tab } from "@/lib/browse";
import { FiltersSheet } from "./filters-sheet";

// Shared top of Deals (H1) and Deals → Map (H1m): greeting + settings, title +
// Map/List switch, search, filters (with a real badge) and category tabs.
const TABS: { key: Tab; label: string }[] = [
  { key: "foryou", label: "For you" },
  { key: "all", label: "All" },
  { key: "haircut", label: "Haircuts" },
  { key: "laundry", label: "Laundry" },
  { key: "care", label: "Clothing care" },
];

export function BrowseHeader({ mode, resultCount }: { mode: "list" | "map"; resultCount: number }) {
  const profile = useProfile();
  const greeting = useGreeting();
  const browse = useBrowse();
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = activeFilterCount(browse.filters);

  return (
    <>
      <div className="px-5 pt-4">
        <p className="text-title-md text-text-heading">
          {greeting}
          {profile?.firstName ? `, ${profile.firstName}` : ""}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between px-5">
        <h1 className="text-headline-sm text-text-heading">Deals near you</h1>
        <Link
          href={mode === "list" ? "/deals/map" : "/deals"}
          className="-my-1 inline-flex min-h-[48px] items-center"
        >
          <span className="inline-flex h-9 items-center gap-1 rounded-full border border-action-primary px-3 text-label-md text-action-primary">
            <Icon name={mode === "list" ? "map-pin" : "tag"} size={16} /> {mode === "list" ? "Map" : "List"}
          </span>
        </Link>
      </div>

      <div className="mt-3 flex items-center gap-2 px-5">
        <label className="flex h-12 flex-1 items-center gap-2 rounded-full bg-surface-muted px-4 focus-within:ring-2 focus-within:ring-focus-ring">
          <Icon name="search" size={20} className="text-text-secondary" />
          <span className="sr-only">Search deals or shops</span>
          <input
            type="search"
            value={browse.query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals or shops"
            className="w-full bg-transparent text-body-md text-text-primary outline-none placeholder:text-text-secondary"
          />
        </label>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label={active ? `Filters, ${active} active` : "Filters"}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-action-primary text-on-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
        >
          <Icon name="sliders" size={20} />
          {active > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-label-sm text-on-action"
            >
              {active}
            </span>
          )}
        </button>
      </div>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5 pb-1" role="tablist" aria-label="Service">
        {TABS.map((t) => (
          <Chip key={t.key} as="tab" selected={browse.tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Chip>
        ))}
      </div>

      <FiltersSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={browse.filters}
        resultCount={resultCount}
        area={profile?.area}
      />
    </>
  );
}
