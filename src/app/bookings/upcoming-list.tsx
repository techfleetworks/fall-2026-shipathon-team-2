"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { LoadingRow } from "@/components/ui/spinner";
import { getBusiness, getService } from "@/lib/mock-data";
import { formatTime, relativeDay, sameDay } from "@/lib/slots";
import { isActive, useBookings, useHydrated, useNowMinute } from "@/lib/account";
import { markNav } from "@/lib/nav-motion";

// H2 Upcoming: the person's real active bookings (on this device), soonest
// first. Figma's empty state shows when there are none.
export function UpcomingList() {
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const bookings = useBookings();

  if (!hydrated || nowMs === 0) return <LoadingRow label="Loading your bookings…" />;

  const now = new Date(nowMs);
  const upcoming = bookings
    .filter((b) => isActive(b, nowMs))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  if (upcoming.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-border-default px-5 py-5 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle text-on-tint-primary">
          <Icon name="ticket" size={22} />
        </span>
        <p className="mt-3 text-title-sm text-text-primary">Nothing booked right now</p>
        <p className="mt-1 text-body-md text-text-secondary">Your next booking will show up here.</p>
        <ButtonLink href="/deals" fullWidth className="mt-4">
          Find offers near you
        </ButtonLink>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {upcoming.map((b) => {
        const business = getBusiness(b.businessId)!;
        const service = getService(b.serviceId)!;
        const start = new Date(b.startsAt);
        const today = sameDay(start, now);
        return (
          <li key={b.id}>
            <Link
              href={`/booked/${b.id}`}
              onNavigate={markNav("forward")}
              className="flex items-center gap-3 rounded-lg border border-border-default p-4 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={business.photo} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-title-sm text-text-primary">{business.name}</p>
                <p className="text-body-md text-text-secondary">
                  {service.name} · {relativeDay(start, now)}, {formatTime(start)}
                </p>
                <div className="mt-1">
                  <StatusBadge tone="positive">
                    <Icon name={today ? "calendar" : "check"} size={14} /> {today ? "It’s today" : "Booked"} · ${b.paid} cash
                  </StatusBadge>
                </div>
              </div>
              <Icon name="chevron-right" size={20} className="text-text-secondary" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
