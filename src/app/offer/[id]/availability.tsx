"use client";

import { getBusiness, getService } from "@/lib/mock-data";
import { formatTime, nextAvailability, relativeDay } from "@/lib/slots";
import { useHydrated, useNowMinute } from "@/lib/account";
import { plural } from "@/lib/mock-data";

// "2 slots left today" — real open times for this offer (needs the person's clock,
// so it renders on the client).
export function Availability({ serviceId, className }: { serviceId: string; className?: string }) {
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  if (!hydrated || nowMs === 0) return <p className={className}>&nbsp;</p>;

  const service = getService(serviceId)!;
  const business = getBusiness(service.businessId)!;
  const now = new Date(nowMs);
  const next = nextAvailability(service, business, now);

  if (!next) return <p className={`${className} text-text-secondary!`}>No open times in the next 3 days</p>;
  const day = relativeDay(next.day, now);
  return (
    <p className={className}>
      {plural(next.free.length, "slot")} left {day === "Today" ? "today" : day === "Tomorrow" ? "tomorrow" : `on ${day}`} · from{" "}
      {formatTime(next.free[0].start)}
    </p>
  );
}
