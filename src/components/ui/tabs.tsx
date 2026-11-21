"use client";

import { cn } from "@/lib/cn";

// Secondary tabs (e.g. My bookings: Upcoming / Past). Two or three, fixed width,
// active marked by an underline + bolder label.
export interface TabItem {
  key: string;
  label: string;
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div role="tablist" className="flex border-b border-border-default">
      {tabs.map((t) => {
        const current = t.key === active;
        return (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={current}
            onClick={() => onChange(t.key)}
            className={cn(
              "flex-1 min-h-[48px] border-b-2 px-3 text-title-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
              current
                ? "border-action-primary font-bold text-action-primary"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
