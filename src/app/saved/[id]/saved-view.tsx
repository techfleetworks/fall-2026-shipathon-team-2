"use client";

import Link from "next/link";
import { Screen, ScreenBody, BottomActionBar } from "@/components/ui/screen";
import { ButtonLink } from "@/components/ui/button";
import { CATEGORY_WORDS, plural } from "@/lib/mock-data";
import { useBookings } from "@/lib/account";
import { useBooking } from "@/components/booking/use-booking";
import { ShopBadge } from "@/components/booking/shop-badge";
import { FavoriteHeart } from "@/components/ui/favorite-heart";
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

        <ShopBadge business={business} check />

        <p className="mt-6 text-headline-sm text-text-heading">Thanks for coming to {business.shortName}.</p>
        <p className="mt-3 text-body-lg text-text-secondary">Paid ${booking.paid} at the counter.</p>
        <div className="mt-3">
          <FavoriteHeart businessId={business.id} businessName={business.shortName} variant="text" />
        </div>

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
        {!booking.rating && (
          <ButtonLink href={`/rate/${booking.id}`} variant="outlined" fullWidth className="text-action-primary!">
            Rate your visit
          </ButtonLink>
        )}
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
