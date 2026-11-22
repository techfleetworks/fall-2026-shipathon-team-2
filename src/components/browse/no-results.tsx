"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { clearAll, setTab } from "@/lib/browse";

// H1e · No results. Shown when search, tabs or filters leave nothing to book.
export function NoResults() {
  return (
    <div role="status" className="flex flex-col items-center px-5 py-10 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-subtle text-on-tint-primary">
        <Icon name="search" size={26} />
      </span>
      <p className="mt-4 text-title-lg font-bold text-text-heading">No deals match right now</p>
      <p className="mt-2 text-body-lg text-text-secondary">
        Try fewer filters or a wider area. New off-peak slots open every day.
      </p>
      <Button
        variant="outlined"
        className="mt-5 text-action-primary!"
        onClick={() => {
          clearAll();
          setTab("all");
        }}
      >
        Clear filters
      </Button>
    </div>
  );
}
