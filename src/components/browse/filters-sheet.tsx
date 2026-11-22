"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { plural } from "@/lib/mock-data";
import {
  DISTANCE_ANY,
  clearFilters,
  setFilters,
  type DayFilter,
  type Filters,
  type PriceFilter,
  type TimeFilter,
  type TransitFilter,
} from "@/lib/browse";

// R3 · Filters. Each row is a single choice and changes apply right away; the
// count on the button updates live. Defaults are the feed's normal view; only
// changes from them count toward the badge.

function Row<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="mt-5">
      <legend className="text-label-md text-text-secondary">{label}</legend>
      <div className="mt-2 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {options.map(([v, text]) => (
          <Chip key={v} selected={value === v} onClick={() => onChange(v)}>
            {text}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

export function FiltersSheet({
  open,
  onClose,
  filters,
  resultCount,
  area,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  resultCount: number;
  area?: string;
}) {
  const distLabel = filters.distance >= DISTANCE_ANY ? "Any distance" : `Within ${filters.distance} mi`;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Filters"
      showClose
      footer={
        <div className="flex flex-col items-center gap-1">
          <Button fullWidth onClick={onClose}>
            {resultCount === 0 ? "No offers match" : `Show ${plural(resultCount, "offer")}`}
          </Button>
          <Button variant="text" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      }
    >
      <Row<DayFilter>
        label="Day"
        value={filters.day}
        onChange={(day) => setFilters({ day })}
        options={[
          ["soon", "Next 3 days"],
          ["week", "This week"],
          ["weekend", "Weekends"],
        ]}
      />
      <Row<TimeFilter>
        label="Time of day"
        value={filters.time}
        onChange={(time) => setFilters({ time })}
        options={[
          ["any", "Any time"],
          ["morning", "Morning"],
          ["afternoon", "Afternoon"],
          ["evening", "Evening"],
        ]}
      />

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor="distance" className="text-label-md text-text-secondary">
            Distance from you
          </label>
          <span className="text-label-md text-action-primary">{distLabel}</span>
        </div>
        <input
          id="distance"
          type="range"
          min={0.5}
          max={DISTANCE_ANY}
          step={0.5}
          value={filters.distance}
          onChange={(e) => setFilters({ distance: Number(e.target.value) })}
          aria-valuetext={distLabel}
          className="mt-2 h-12 w-full accent-action-primary"
        />
        <p className="text-body-sm text-text-secondary">
          From {area || "your area"} · distances are approximate for the sample shops
        </p>
      </div>

      <Row<TransitFilter>
        label="Near public transit"
        value={filters.transit}
        onChange={(transit) => setFilters({ transit })}
        options={[
          ["any", "Any"],
          ["metro", "Metro"],
          ["bus", "Bus"],
          ["walk", "Walking distance"],
        ]}
      />
      <Row<PriceFilter>
        label="Price"
        value={filters.price}
        onChange={(price) => setFilters({ price })}
        options={[
          ["any", "Any price"],
          ["under10", "Under $10"],
          ["10to20", "$10–20"],
        ]}
      />
    </BottomSheet>
  );
}
