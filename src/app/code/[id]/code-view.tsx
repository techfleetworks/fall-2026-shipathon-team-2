"use client";

import { useRouter } from "next/navigation";
import { Screen, ScreenBody, BottomActionBar } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { BookingTicket } from "@/components/ui/booking-ticket";
import { QrCode } from "@/components/ui/qr-code";
import { InfoBox } from "@/components/ui/info-box";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatRange, sameDay, shortDay } from "@/lib/slots";
import { markKept } from "@/lib/account";
import { useBooking } from "@/components/booking/use-booking";
import { BookingLoading, BookingMissing } from "@/components/booking/booking-states";

// P4 · Show code. The person shows this at the counter; staff scan the pattern or
// type the 6 digits. DEMO: "Done" stands in for the shop confirming the visit
// (the business side isn't built), and marks the booking as kept.
export function CodeView({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const data = useBooking(bookingId);

  if (data.state === "loading") return <BookingLoading title="Show at the counter" />;
  if (data.state === "missing") return <BookingMissing title="Show at the counter" />;

  const { booking, business, service, now } = data;
  const start = new Date(booking.startsAt);
  const end = new Date(booking.endsAt);
  const pinDisplay = `${booking.pin.slice(0, 3)} ${booking.pin.slice(3)}`;
  const done = booking.status === "kept";
  const cancelled = booking.status === "cancelled";

  return (
    <Screen>
      <PageHeader title="Show at the counter" backHref={`/booked/${booking.id}`} />
      <ScreenBody className="flex flex-col gap-3 pt-2">
        <section
          aria-label="Your check-in code"
          className="flex flex-col items-center rounded-lg border border-border-default bg-surface-card px-4 pt-6 pb-5 shadow-e1"
        >
          <QrCode value={`${booking.id}:${booking.pin}`} />
          <p className="mt-3 font-display text-headline-sm tracking-[0.15em] text-text-primary">
            <span className="sr-only">Code: </span>
            {pinDisplay}
          </p>
          <p className="mt-2 text-body-md text-text-secondary">Staff can type the numbers if the scan fails</p>
        </section>

        <BookingTicket
          bookingRef={booking.ref}
          total={booking.paid}
          business={business}
          service={service}
          when={`${sameDay(start, now) ? "Today" : shortDay(start)}, ${formatRange(start, end)}`}
        />

        <InfoBox>Pay ${booking.paid} in cash at the counter.</InfoBox>
        {!done && !cancelled && (
          <p className="px-1 text-body-sm text-text-secondary">
            Demo: tapping Done stands in for the shop confirming your visit.
          </p>
        )}
      </ScreenBody>
      <BottomActionBar className="border-t-0!">
        {cancelled ? (
          <ButtonLink href="/deals" fullWidth>
            This booking was cancelled · Find another deal
          </ButtonLink>
        ) : (
          <Button
            fullWidth
            onClick={() => {
              if (!done) markKept(booking.id);
              router.push(`/saved/${booking.id}`);
            }}
          >
            Done
          </Button>
        )}
      </BottomActionBar>
    </Screen>
  );
}
