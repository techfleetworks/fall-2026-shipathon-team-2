"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Screen, ScreenBody, AppBar, BottomActionBar } from "@/components/ui/screen";
import { Button, ButtonLink } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { InfoBox } from "@/components/ui/info-box";
import { Icon } from "@/components/ui/icon";
import { LoadingRow } from "@/components/ui/spinner";
import { CATEGORY_WORDS, bookingLimit, getBusiness, getService, savings } from "@/lib/mock-data";
import { closesAt, formatRange, formatTime, longDay, relativeDay, sameDay, shortDay, slotsFor } from "@/lib/slots";
import {
  cancelBooking,
  createBooking,
  historyCounts,
  isActive,
  isLateToCancel,
  isSignedUp,
  setSlotGone,
  useAccount,
  useHydrated,
  useNowMinute,
} from "@/lib/account";

// R6 · Confirm booking (+ R6b one-booking-at-a-time). Shows the shop, service and
// time the person picked. "Book slot" creates a real booking on this device.
export default function ConfirmPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const account = useAccount();
  const [remind, setRemind] = useState(true);

  const draft = account.draft;
  const service = draft ? getService(draft.serviceId) : undefined;
  const business = service ? getBusiness(service.businessId) : undefined;

  if (!hydrated || nowMs === 0) {
    return (
      <Screen>
        <AppBar title="Confirm booking" onBack={() => router.push("/deals")} />
        <ScreenBody>
          <LoadingRow label="Loading your booking…" />
        </ScreenBody>
      </Screen>
    );
  }

  if (!draft || !service || !business) {
    return (
      <Screen>
        <AppBar title="Confirm booking" onBack={() => router.push("/deals")} />
        <ScreenBody>
          <p className="text-body-lg text-text-secondary">You haven&apos;t picked a time yet. Find an offer and choose a time to book.</p>
          <ButtonLink href="/deals" fullWidth className="mt-4">
            Find offers near you
          </ButtonLink>
        </ScreenBody>
      </Screen>
    );
  }

  const now = new Date(nowMs);
  const start = new Date(draft.startsAt);
  const end = new Date(draft.endsAt);
  const passed = start.getTime() < nowMs;
  const save = savings(service);
  const signedUp = isSignedUp(account);
  const name = account.profile?.firstName;

  const counts = historyCounts(account.bookings, nowMs);
  const limit = bookingLimit(counts);
  // Rescheduling: the booking being replaced doesn't count against the limit.
  const replaced = draft.replaces ? account.bookings.find((b) => b.id === draft.replaces && b.status === "booked") : undefined;
  const active = account.bookings.filter((b) => isActive(b, nowMs) && b.id !== replaced?.id);
  const atLimit = limit !== "unlimited" && active.length >= limit;
  const existing = active[0];
  const existingService = existing ? getService(existing.serviceId) : undefined;
  const existingBusiness = existing ? getBusiness(existing.businessId) : undefined;

  const dayText = sameDay(start, now) ? "Today" : relativeDay(start, now);
  const remindAt = new Date(start.getTime() - 60 * 60_000);
  const cancelBy = new Date(start.getTime() - 2 * 60 * 60_000);
  const closes = closesAt(business, start);

  // R5x: the picked time is gone (started, or no longer open) → back to Pick a
  // time with the "isn't available any more" banner and the nearest open time.
  const slotGoneBack = () => {
    setSlotGone({ serviceId: service.id, startsAt: draft.startsAt });
    router.push(`/offer/${service.id}/time`);
  };

  const book = () => {
    const mine = new Set(
      account.bookings
        .filter((b) => b.serviceId === service.id && b.status === "booked" && b.id !== replaced?.id)
        .map((b) => new Date(b.startsAt).getTime()),
    );
    const stillOpen = slotsFor(service, business, start, new Date(), mine).some(
      (s) => s.start.getTime() === start.getTime() && !s.taken,
    );
    if (!stillOpen) return slotGoneBack();
    if (replaced) cancelBooking(replaced.id);
    const b = createBooking({
      serviceId: service.id,
      businessId: business.id,
      startsAt: draft.startsAt,
      endsAt: draft.endsAt,
      paid: service.offPeakPrice,
      regular: service.regularPrice,
      remind,
    });
    router.push(`/booked/${b.id}`);
  };

  return (
    <Screen>
      <AppBar title="Confirm booking" onBack={() => router.push(`/offer/${service.id}/time`)} />
      <ScreenBody>
        {/* Summary */}
        <div className="overflow-hidden rounded-lg border border-border-default">
          <div className="flex items-center gap-3 p-4">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={business.photo} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-title-sm text-text-primary">{business.name}</p>
              <p className="text-body-md text-text-secondary">{service.name}</p>
              <p className="text-body-sm text-text-secondary">
                {business.address} · {business.distanceMi} mi
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-4 border-t border-border-default p-4">
            <div>
              <p className="text-label-md text-text-secondary">When</p>
              <p className="text-body-lg text-text-primary">
                {dayText}, {formatRange(start, end)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-label-md text-text-secondary">Total</p>
              <p className="text-body-lg text-text-primary">${service.offPeakPrice}</p>
            </div>
            <div>
              <p className="text-label-md text-text-secondary">Payment</p>
              <p className="text-body-lg text-text-primary">Cash on arrival</p>
            </div>
            <div className="text-right">
              <p className="text-label-md text-text-secondary">Takes</p>
              <p className="text-body-lg text-text-primary">{service.minutes} min</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mt-4 overflow-hidden rounded-lg border border-border-default">
          <div className="flex items-center gap-3 p-4">
            <Icon name="clock" size={22} className="text-text-secondary" />
            <div className="flex-1">
              <p className="text-title-sm text-text-primary">Remind me 1 hour before</p>
              <p className="text-body-sm text-text-secondary">At {formatTime(remindAt)}, in the app</p>
            </div>
            <Switch label="Remind me 1 hour before" checked={remind} onChange={setRemind} />
          </div>
          <div className="flex w-full items-center gap-3 border-t border-border-default p-4">
            <Icon name="map-pin" size={22} className="text-text-secondary" />
            <div className="flex-1">
              <p className="text-title-sm text-text-primary">Getting there</p>
              <p className="text-body-sm text-text-secondary">
                {business.transit} · {business.distanceMi} mi
              </p>
            </div>
          </div>
          <div className="flex w-full items-center gap-3 border-t border-border-default p-4">
            <Icon name="user" size={22} className="text-text-secondary" />
            <div className="flex-1">
              <p className="text-title-sm text-text-primary">Booking name</p>
              <p className="text-body-sm text-text-secondary">
                {name || "Your first name"} · the shop sees first name only
              </p>
            </div>
          </div>
        </div>

        {replaced && !passed && (
          <InfoBox tone="subtle" className="mt-4">
            This replaces your {formatTime(new Date(replaced.startsAt))} booking{" "}
            {sameDay(new Date(replaced.startsAt), now) ? "today" : `on ${shortDay(new Date(replaced.startsAt))}`}.
            {isLateToCancel(replaced, nowMs) ? " It's less than 2 hours away, so moving it counts as a missed booking." : ""}
          </InfoBox>
        )}
        {passed ? (
          <InfoBox className="mt-4">That time has already started. Pick another time.</InfoBox>
        ) : atLimit && existing && existingService && existingBusiness ? (
          // R6b · One booking at a time
          <div role="status" className="mt-4 rounded-lg bg-surface-subtle p-4 text-on-tint-primary">
            <p className="text-title-sm">
              {limit === 1 ? "One booking at a time" : `${limit} bookings at a time`}
            </p>
            <p className="mt-1 text-body-md">
              You already have {active.length === 1 ? `a ${CATEGORY_WORDS[existingBusiness.category].booking}` : `${active.length} bookings`} —{" "}
              {existingService.name} at {existingBusiness.shortName},{" "}
              {relativeDay(new Date(existing.startsAt), now).toLowerCase() === "today" ? "today" : longDay(new Date(existing.startsAt))} at{" "}
              {formatTime(new Date(existing.startsAt))}. Show up for 2 bookings and you can hold 2 at once.
            </p>
          </div>
        ) : (
          <InfoBox className="mt-4">
            {closes ? `${business.shortName} closes at ${closes}. ` : ""}Cancel by{" "}
            {sameDay(cancelBy, now) ? "today" : longDay(cancelBy)}, {formatTime(cancelBy)}. Later counts as a missed booking.
          </InfoBox>
        )}
      </ScreenBody>

      <BottomActionBar>
        <p className="mb-2 text-center text-body-sm text-accent-primary">
          You save ${save} · pay ${service.offPeakPrice} cash at the shop
        </p>
        {passed ? (
          <Button fullWidth onClick={slotGoneBack}>
            Pick another time
          </Button>
        ) : !signedUp ? (
          <ButtonLink href="/welcome" fullWidth>
            Create an account to book
          </ButtonLink>
        ) : atLimit && existing ? (
          <ButtonLink href={`/booked/${existing.id}`} fullWidth>
            See my booking
          </ButtonLink>
        ) : (
          <Button fullWidth onClick={book}>
            Book slot
          </Button>
        )}
      </BottomActionBar>
    </Screen>
  );
}
