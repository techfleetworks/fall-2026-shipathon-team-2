"use client";

import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { getBusiness, getService, plural } from "@/lib/mock-data";
import { shortDay } from "@/lib/slots";
import { isActive, isMissed, useBookings, useHydrated, useNowMinute } from "@/lib/account";

// H2 Past: the person's finished bookings (done, cancelled, missed), newest
// first, plus this month's savings from confirmed visits. Empty for a new account.
export function PastList() {
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const bookings = useBookings();
  if (!hydrated || nowMs === 0) return null;

  const now = new Date(nowMs);
  const past = bookings.filter((b) => !isActive(b, nowMs)).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  const keptThisMonth = bookings.filter((b) => {
    if (b.status !== "kept" || !b.keptAt) return false;
    const d = new Date(b.keptAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const savedThisMonth = keptThisMonth.reduce((sum, b) => sum + (b.regular - b.paid), 0);

  if (past.length === 0) {
    return <p className="text-body-md text-text-secondary">Your past visits and savings will show up here.</p>;
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {past.map((b) => {
          const business = getBusiness(b.businessId)!;
          const service = getService(b.serviceId)!;
          const kept = b.status === "kept";
          const missed = isMissed(b, nowMs) || (b.status === "cancelled" && b.lateCancel);
          return (
            <li key={b.id} className="flex items-center gap-3 rounded-lg border border-border-default p-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={business.photo} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-title-sm text-text-primary">{business.shortName}</p>
                <p className="text-body-md text-text-secondary">
                  {service.name} · {kept ? `$${b.paid} · saved $${b.regular - b.paid}` : `$${b.paid}`} · {shortDay(new Date(b.startsAt))}
                </p>
                <div className="mt-1">
                  <StatusBadge tone={kept ? "positive" : missed ? "danger" : "neutral"}>
                    <Icon name={kept ? "check" : missed ? "alert" : "x"} size={14} />{" "}
                    {kept ? "Done" : isMissed(b, nowMs) ? "Missed" : missed ? "Cancelled late" : "Cancelled"}
                  </StatusBadge>
                </div>
              </div>
              <ButtonLink href={`/offer/${b.serviceId}`} variant="outlined" className="shrink-0 px-4! text-action-primary!">
                Book again<span className="sr-only"> at {business.name}</span>
              </ButtonLink>
            </li>
          );
        })}
      </ul>
      {keptThisMonth.length > 0 && (
        <p className="mt-4 text-body-md text-text-secondary">
          ${savedThisMonth} saved this month · {plural(keptThisMonth.length, "booking")}
        </p>
      )}
    </>
  );
}
