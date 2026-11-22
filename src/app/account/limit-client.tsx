"use client";

import { ListRow } from "@/components/ui/list-row";
import { bookingLimit, limitStatus } from "@/lib/mock-data";
import { useHistoryCounts, useHydrated } from "@/lib/account";

// Booking limit row (Account) and "Your status" panel (How bookings work), from
// the person's real kept/missed visits via the trust ladder.
export function BookingLimitRow() {
  const hydrated = useHydrated();
  const counts = useHistoryCounts();
  const limit = bookingLimit(hydrated ? counts : { keptCount: 0, missCount: 0 });
  const copy = limit === "unlimited" ? "No limit" : `${limit} at a time for now`;
  return <ListRow icon="ticket" title="Booking limit" sub={`${copy} · how it works`} href="/account/how-bookings-work" />;
}

export function LimitStatusPanel() {
  const hydrated = useHydrated();
  const counts = useHistoryCounts();
  const status = limitStatus(hydrated ? counts : { keptCount: 0, missCount: 0 });
  return (
    <section aria-label="Your status" className="mt-5 rounded-lg bg-surface-muted p-4">
      <p className="text-label-md text-text-secondary">Your status</p>
      <p className="mt-1 text-title-lg font-bold text-text-primary">{status.headline}</p>
      <p className="mt-1 text-body-md text-text-secondary">{status.detail}</p>
    </section>
  );
}
