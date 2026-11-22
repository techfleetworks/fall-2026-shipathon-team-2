"use client";

import { getBusiness, getService } from "@/lib/mock-data";
import { useBookings, useHydrated, useNowMinute } from "@/lib/account";

// Loads one of the person's bookings (saved on this device) for the
// after-booking screens, plus its sample shop and service, and the clock.
export function useBooking(id: string) {
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const bookings = useBookings();
  if (!hydrated || nowMs === 0) return { state: "loading" as const };
  const booking = bookings.find((b) => b.id === id);
  const service = booking && getService(booking.serviceId);
  const business = booking && getBusiness(booking.businessId);
  if (!booking || !service || !business) return { state: "missing" as const };
  return { state: "ok" as const, booking, service, business, now: new Date(nowMs), nowMs };
}
