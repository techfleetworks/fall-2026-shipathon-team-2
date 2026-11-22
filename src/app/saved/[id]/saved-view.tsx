"use client";

import Link from "next/link";
import { Screen, ScreenBody, BottomActionBar } from "@/components/ui/screen";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CATEGORY_WORDS, plural } from "@/lib/mock-data";
import { useBookings } from "@/lib/account";
import { useBooking } from "@/components/booking/use-booking";
import { BookingLoading, BookingMissing } from "@/components/booking/booking-states";

// P5 · All done — "You saved $X", from the person's real kept visits.
export function SavedView({ bookingId }: { bookingId: string }) {
  const data = useBooking(bookingId);
  const bookings = useBookings();

  if (data.state === "loading") return <BookingLoading title="All done" />;
  if (data.state === "missing") return <BookingMissing title="All done" />;

  const { booking, business, now } = data;
  const saved = booking.regular - booking.paid;
  const held = CATEGORY_WORDS[business.category].held;

  // This month's kept visits (including this one).
  const thisMonth = bookings.filter((b) => {
    if (b.status !== "kept" || !b.keptAt) return false;
    const d = new Date(b.keptAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const monthTotal = thisMonth.reduce((sum, b) => sum + (b.regular - b.paid), 0);

  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">All done</h1>

        <div className="relative mx-auto mt-4 flex h-40 w-40 items-center justify-center rounded-full bg-status-positive-surface">
          {/* Shop badge. Fresh Cuts' Figma logo export is lettering only, so the
              round badge and scissors mark are drawn behind it; other shops use
              their photo. */}
          {business.logo ? (
            <div className="flex h-32 w-32 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-status-positive text-on-action">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={business.logo} alt="" className="w-24" />
              <Icon name="scissors" size={32} />
            </div>
          ) : (
            <div className="h-32 w-32 overflow-hidden rounded-full bg-surface-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={business.photo} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <span className="absolute right-1 bottom-2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface-default bg-status-positive text-on-action">
            <Icon name="check" size={20} title="Visit confirmed" />
          </span>
        </div>

        <p className="mt-6 text-headline-sm text-text-heading">Thanks for coming to {business.shortName}.</p>
        <p className="mt-3 text-body-lg text-text-secondary">Paid ${booking.paid} at the counter.</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border-default p-4">
            <p className="text-label-md text-text-secondary">You saved</p>
            <p className="font-display text-headline-sm text-accent-primary">${saved}</p>
            <p className="text-body-sm text-text-secondary">off the regular price</p>
          </div>
          <div className="rounded-lg border border-border-default p-4">
            <p className="text-label-md text-text-secondary">{business.shortName}</p>
            <p className="font-display text-headline-sm text-action-primary">1 {held}</p>
            <p className="text-body-sm text-text-secondary">filled in a quiet hour</p>
          </div>
        </div>

        <p className="mt-4 border-t border-border-default pt-4 text-body-md text-text-secondary">
          ${monthTotal} saved this month · {plural(thisMonth.length, "booking")}
        </p>
      </ScreenBody>

      <BottomActionBar className="flex flex-col items-center gap-1 border-t-0!">
        <ButtonLink href="/deals" fullWidth>
          Find another deal
        </ButtonLink>
        <Link
          href="/bookings"
          className="inline-flex min-h-[48px] items-center rounded-full px-4 text-label-lg text-action-primary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          See my bookings
        </Link>
      </BottomActionBar>
    </Screen>
  );
}
