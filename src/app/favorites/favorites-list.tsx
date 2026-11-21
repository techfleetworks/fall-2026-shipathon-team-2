"use client";

import { useState } from "react";
import Link from "next/link";
import { IconButton } from "@/components/ui/icon-button";
import { StatusBadge } from "@/components/ui/badge";
import { favorites, getBusiness } from "@/lib/mock-data";

// Cards link to the place's offer; the heart toggles the save (demo: local only,
// resets on reload). The heart sits above the card's stretched link so the two
// stay separate tap targets.
export function FavoritesList() {
  const [saved, setSaved] = useState(() => new Set(favorites.map((f) => f.businessId)));

  const toggle = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {favorites.map((f) => {
        const b = getBusiness(f.businessId)!;
        const isSaved = saved.has(b.id);
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
                href={`/offer/${f.serviceId}`}
                className="text-title-sm text-text-primary after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-focus-ring"
              >
                {b.name}
              </Link>
              <p className="text-body-sm text-text-secondary">
                {f.blurb} · {b.distanceMi} mi
              </p>
              <p className="text-body-sm text-text-secondary">{b.address}</p>
              <div className="mt-1">
                <StatusBadge tone="positive">{f.offers}</StatusBadge>
              </div>
            </div>
            <IconButton
              icon={isSaved ? "heart-filled" : "heart"}
              label={`Save ${b.name}`}
              pressed={isSaved}
              onClick={() => toggle(b.id)}
              className="relative z-10 text-action-primary!"
            />
          </li>
        );
      })}
    </ul>
  );
}
