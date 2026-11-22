"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Screen, ScreenBody, BottomActionBar } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { BookingTicket } from "@/components/ui/booking-ticket";
import { QrCode } from "@/components/ui/qr-code";
import { InfoBox } from "@/components/ui/info-box";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatRange, longDay, sameDay, shortDay } from "@/lib/slots";
import { isMissed, markKept, useOnline } from "@/lib/account";
import { useBooking } from "@/components/booking/use-booking";
import { BookingLoading, BookingMissing } from "@/components/booking/booking-states";
import { go } from "@/lib/nav-motion";

// P4 · Show code. The person shows this at the counter; staff scan the pattern or
// type the 6 digits. DEMO: "Done" stands in for the shop confirming the visit
// (the business side isn't built), and marks the booking as kept. Check-in only
// works on the day of the visit; earlier, the code shows but Done waits.
export function CodeView({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const data = useBooking(bookingId);
  const online = useOnline();

  if (data.state === "loading") return <BookingLoading title="Show at the counter" />;
  if (data.state === "missing") return <BookingMissing title="Show at the counter" />;

  const { booking, business, service, now } = data;
  const start = new Date(booking.startsAt);
  const end = new Date(booking.endsAt);
  const pinDisplay = `${booking.pin.slice(0, 3)} ${booking.pin.slice(3)}`;
  const done = booking.status === "kept";
  const cancelled = booking.status === "cancelled";
  const missed = isMissed(booking, now.getTime());
  const today = sameDay(start, now);
  // The demo "Done" (shop confirms) only makes sense on the day of the visit.
  const canCheckIn = !done && !cancelled && !missed && today;

  return (
    <Screen>
      <PageHeader title="Show at the counter" backHref={`/booked/${booking.id}`} />
      <ScreenBody className="flex flex-col gap-3 pt-2">
        {/* P4o · Offline: the code is saved on the phone, so it still works. */}
        {!online && (
          <p role="status" className="rounded-lg bg-surface-muted px-4 py-3 text-title-sm text-text-primary">
            You&apos;re offline. Your code still works.
          </p>
        )}
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
        {canCheckIn && (
          <p className="px-1 text-body-sm text-text-secondary">
            Demo: tapping Done stands in for the shop confirming your visit, or{" "}
            <Link href="/staff/confirm" className="text-action-primary underline underline-offset-2">
              open the shop&apos;s view
            </Link>{" "}
            and type the code.
          </p>
        )}
      </ScreenBody>
      <BottomActionBar className="border-t-0!">
        {cancelled ? (
          <ButtonLink href="/deals" fullWidth>
            This booking was cancelled · Find another deal
          </ButtonLink>
        ) : done || canCheckIn ? (
          <Button
            fullWidth
            onClick={() => {
              if (!done) markKept(booking.id);
              go(router, `/saved/${booking.id}`, "forward");
            }}
          >
            Done
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <p role="status" className="text-center text-body-md text-text-secondary">
              {missed
                ? "This booking time has passed, so it can't be checked in."
                : `Come back on ${longDay(start)} to check in. Your code will be right here.`}
            </p>
            <ButtonLink href={`/booked/${booking.id}`} variant="outlined" fullWidth>
              Back to my booking
            </ButtonLink>
          </div>
        )}
      </BottomActionBar>
    </Screen>
  );
}
