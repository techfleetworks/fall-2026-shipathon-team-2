"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";
import type { Business } from "@/lib/mock-data";

// DRAWN demo map (Figma H1m). Deliberately not a real street map: the sample
// shops use real LA addresses, and real map pins would land on real buildings
// that may hold real businesses. Pins sit at illustrative positions
// (Business.mapPos). See docs/notes-for-judges.md.

export interface MapPin {
  business: Business;
  price: number;
  save: number;
}

export function DrawnMap({
  pins,
  selected,
  onSelect,
  area,
}: {
  pins: MapPin[];
  selected: string | null;
  onSelect: (businessId: string) => void;
  area?: string;
}) {
  return (
    <div className="relative h-72 w-full overflow-hidden bg-surface-muted" aria-label="Map of nearby offers (illustrative)" role="group">
      {/* Streets, park and freeway — decorative */}
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M58 60 Q70 52 82 62 L86 82 Q72 90 60 84 Z" className="fill-status-positive-surface" />
        <path d="M6 70 Q16 64 24 72 L22 86 Q12 90 6 84 Z" className="fill-status-positive-surface" />
        <g className="stroke-surface-default" strokeLinecap="round" fill="none">
          <path d="M0 30 L100 18" strokeWidth="2.4" />
          <path d="M0 56 L100 44" strokeWidth="2" />
          <path d="M0 86 L100 74" strokeWidth="2" />
          <path d="M22 0 L30 100" strokeWidth="2" />
          <path d="M48 0 L54 100" strokeWidth="2.4" />
          <path d="M74 0 L80 100" strokeWidth="2" />
          <path d="M0 12 L100 2" strokeWidth="1" />
          <path d="M0 70 L100 60" strokeWidth="1" />
          <path d="M10 0 L16 100" strokeWidth="1" />
          <path d="M62 0 L67 100" strokeWidth="1" />
          <path d="M88 0 L92 100" strokeWidth="1" />
        </g>
        <path d="M0 96 Q40 70 100 88" fill="none" strokeWidth="3.2" className="stroke-category-care-surface" />
      </svg>

      {/* You */}
      <div className="absolute left-[46%] top-[52%] -translate-x-1/2 -translate-y-1/2" aria-label={`You${area ? `, ${area}` : ""}`} role="img">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-surface-default bg-accent-surface text-on-tint-primary shadow-e2">
          <Icon name="user" size={18} />
        </span>
      </div>

      {/* Shop pins */}
      {pins.map(({ business, price, save }) => {
        const isSel = selected === business.id;
        return (
          <button
            key={business.id}
            type="button"
            onClick={() => onSelect(business.id)}
            aria-pressed={isSel}
            aria-label={`${business.name}, from $${price}`}
            style={{ left: `${business.mapPos.x}%`, top: `${business.mapPos.y}%` }}
            className={cn(
              "absolute z-10 flex min-h-[48px] -translate-x-1/2 -translate-y-1/2 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring rounded-full",
              isSel && "z-20",
            )}
          >
            <span
              className={cn(
                "flex items-center gap-1 rounded-full border-2 px-2 py-1 text-label-md shadow-e2",
                isSel ? "border-surface-default bg-status-positive text-on-action" : "border-status-positive bg-surface-default text-text-primary",
              )}
            >
              <Icon name={business.category === "haircut" ? "scissors" : "shirt"} size={14} />${price}
              {isSel && <span className="font-bold">· Save ${save}</span>}
            </span>
          </button>
        );
      })}

      <p className="absolute top-2 right-3 rounded-full bg-surface-default/90 px-2 py-0.5 text-label-sm text-text-secondary">
        Illustrative map · sample shops
      </p>
    </div>
  );
}
