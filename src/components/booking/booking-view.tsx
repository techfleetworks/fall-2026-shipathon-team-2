"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen, ScreenBody } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { BookingTicket } from "@/components/ui/booking-ticket";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { NavBar } from "@/components/ui/nav-bar";
import { CATEGORY_WORDS } from "@/lib/mock-data";
import { formatRange, formatTime, longDay, relativeDay, sameDay, shortDay } from "@/lib/slots";
import { cancelBooking, isLateToCancel, isMissed, setReschedule, useHistoryCounts, useProfile, type Booking } from "@/lib/account";
import { RemindersSheet } from "@/components/onboarding/reminders-sheet";
import { bookingLimit, type Business, type Service } from "@/lib/mock-data";
import { InfoBox } from "@/components/ui/info-box";
import { FavoriteHeart } from "@/components/ui/favorite-heart";
import Link from "next/link";
import { useBooking } from "./use-booking";
import { BookingLoading, BookingMissing } from "./booking-states";
import { markNav, go } from "@/lib/nav-motion";

// P1 "Your booking" and P3 "It's today" (shown automatically on the day), plus
// P1c cancel sheet and the cancelled / missed / done states. Everything comes from
// the person's real booking.

const pad = (n: number) => String(n).padStart(2, "0");
const icsTime = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

function downloadCalendarFile(booking: Booking, business: Business, service: Service) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sparetime//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@sparetime`,
    `DTSTART:${icsTime(new Date(booking.startsAt))}`,
    `DTEND:${icsTime(new Date(booking.endsAt))}`,
    `SUMMARY:${service.name} at ${business.name}`,
    `LOCATION:${business.address.replace(/,/g, "\\,")}`,
    `DESCRIPTION:Booking ${booking.ref}. Pay $${booking.paid} cash at the shop.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `sparetime-${booking.ref}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

const linkCls =
  "inline-flex min-h-[48px] items-center gap-2 rounded-full px-4 text-label-md text-text-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring";

export function BookingView({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const data = useBooking(bookingId);
  const counts = useHistoryCounts();
  const profile = useProfile();
  // Right after booking (`?new=1`), offer reminders once if never asked before.
  const justBooked = useSearchParams().get("new") === "1";
  const [remindersDone, setRemindersDone] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (data.state === "loading") return <BookingLoading title="Your booking" />;
  if (data.state === "missing") return <BookingMissing title="Your booking" />;

  const { booking, business, service, now, nowMs } = data;
  const start = new Date(booking.startsAt);
  const end = new Date(booking.endsAt);
  const words = CATEGORY_WORDS[business.category];
  const startTime = formatTime(start);
  const isToday = sameDay(start, now);
  const missed = isMissed(booking, nowMs);
  const late = isLateToCancel(booking, nowMs);

  // P3m · Missed booking (no confirmation by the end of the slot).
  if (missed) {
    const limit = bookingLimit(counts);
    const second = counts.missCount >= 2;
    return (
      <Screen>
        <PageHeader title="Your booking" backHref="/bookings" />
        <ScreenBody className="pt-0">
          <BookingTicket
            bookingRef={booking.ref}
            total={booking.paid}
            business={business}
            service={service}
            when=""
            status={{ tone: "missed", label: "Missed", icon: "x", headline: `You missed your ${startTime} slot` }}
            details={[
              ["When", `${isToday ? "Today" : shortDay(start)}, ${formatRange(start, end)}`],
              null,
              ["Charged", "Nothing"],
              ["Booking limit", limit === "unlimited" ? "No limit" : `${limit} at a time`],
            ]}
          />
          <InfoBox className="mt-4">
            {second
              ? "There's no fee. You've now missed 2 or more bookings, so your limit is back to one at a time. Show up to book more."
              : "There's no fee, and your limit stays the same. A second missed booking resets it to one at a time."}
          </InfoBox>
        </ScreenBody>
        <div className="sticky bottom-0 z-10 bg-surface-default">
          <div className="flex flex-col items-center gap-1 px-5 pt-3 pb-2">
            <ButtonLink href={`/offer/${service.id}/time`} fullWidth>
              Find another time
            </ButtonLink>
            <Link
              href="/account/how-bookings-work"
              onNavigate={markNav("forward")}
              className="inline-flex min-h-[48px] items-center rounded-full px-4 text-label-lg text-action-primary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              How bookings work
            </Link>
          </div>
          <NavBar active="bookings" />
        </div>
      </Screen>
    );
  }

  // Finished states: cancelled, done.
  if (booking.status !== "booked") {
    const kept = booking.status === "kept";
    return (
      <Screen>
        <PageHeader title="Your booking" backHref="/bookings" />
        <ScreenBody className="flex flex-col items-start gap-4 pt-2">
          <StatusBadge tone={kept ? "positive" : missed || booking.lateCancel ? "danger" : "neutral"}>
            <Icon name={kept ? "check" : missed ? "alert" : "x"} size={14} />{" "}
            {kept ? "Visit done" : missed ? "Missed" : "Cancelled"}
          </StatusBadge>
          <p role="status" className="text-body-lg text-text-primary">
            {kept
              ? `You went to ${business.shortName} ${relativeDay(start, now).toLowerCase() === "today" ? "today" : `on ${shortDay(start)}`} and paid $${booking.paid}.`
              : missed
                ? `No one confirmed your ${startTime} ${words.booking} at ${business.shortName}, so it counts as a missed booking. A missed booking costs nothing.`
                : booking.lateCancel
                  ? `Your ${startTime} ${words.booking} at ${business.shortName} is cancelled. It was less than 2 hours before, so it counts as a missed booking.`
                  : `Your ${startTime} ${words.booking} at ${business.shortName} is cancelled. It won't count as a missed booking.`}
          </p>
          {kept ? (
            <ButtonLink href={`/saved/${booking.id}`} fullWidth>
              See what you saved
            </ButtonLink>
          ) : (
            <ButtonLink href="/deals" fullWidth>
              Find another deal
            </ButtonLink>
          )}
        </ScreenBody>
        <NavBar active="bookings" />
      </Screen>
    );
  }

  const remindAt = new Date(start.getTime() - 60 * 60_000);
  const dayWord = isToday ? "today" : relativeDay(start, now) === "Tomorrow" ? "tomorrow" : longDay(start);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${business.address}`)}`;

  return (
    <Screen>
      <PageHeader title="Your booking" backHref="/bookings" />
      <ScreenBody className="pt-0">
        {!isToday && remindAt.getTime() > nowMs && (
          <p className="mb-4 text-body-lg text-text-secondary">
            {/* Only promise a reminder if this booking and the person's settings both want one. */}
            {booking.remind !== false && profile?.reminders !== false
              ? <>You&apos;re all set. We&apos;ll remind you {dayWord} at {formatTime(remindAt)}.</>
              : <>You&apos;re all set.</>}
          </p>
        )}

        <BookingTicket
          bookingRef={booking.ref}
          total={booking.paid}
          business={business}
          service={service}
          when={`${isToday ? "Today" : shortDay(start)}, ${formatRange(start, end)}`}
          status={
            isToday
              ? { tone: "today", label: "It’s today", icon: "calendar", headline: `Arrive by ${startTime}` }
              : {
                  tone: "booked",
                  label: "Booked",
                  icon: "check",
                  headline: `${relativeDay(start, now) === "Tomorrow" ? "Tomorrow" : longDay(start)} at ${startTime}`,
                }
          }
        />

        {isToday ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-border-control text-label-lg text-action-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
          >
            Get directions
            <span className="sr-only"> (opens Google Maps)</span>
          </a>
        ) : (
          <Button
            variant="outlined"
            fullWidth
            className="mt-4 text-action-primary!"
            onClick={() => downloadCalendarFile(booking, business, service)}
          >
            Add to calendar
          </Button>
        )}

        <div className="mt-2 flex justify-center gap-2">
          <button
            type="button"
            className={linkCls}
            onClick={() => {
              setReschedule(booking.id);
              go(router, `/offer/${service.id}/time`, "forward");
            }}
          >
            <Icon name="calendar" size={18} /> Reschedule
          </button>
          <button type="button" onClick={() => setSheetOpen(true)} className={linkCls}>
            <Icon name="x" size={18} /> Cancel booking
          </button>
        </div>
        <div className="mt-2 flex justify-center">
          <FavoriteHeart businessId={business.id} businessName={business.shortName} variant="text" />
        </div>
        <p className="mt-1 text-center">
          <Link
            href="/demo/reminder"
            onNavigate={markNav("forward")}
            className="inline-flex min-h-[48px] items-center rounded-full px-4 text-body-sm text-text-secondary underline underline-offset-2 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            Demo: see the reminder on a phone&apos;s lock screen
          </Link>
        </p>
      </ScreenBody>

      <div className="sticky bottom-0 z-10 bg-surface-default">
        <div className="px-5 pt-3 pb-3">
          <ButtonLink href={`/code/${booking.id}`} fullWidth>
            Show my code
          </ButtonLink>
        </div>
        <NavBar active="bookings" />
      </div>

      <RemindersSheet
        open={justBooked && !remindersDone && (profile?.reminders === undefined || profile?.reminders === null)}
        onDone={() => setRemindersDone(true)}
      />

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={`Cancel your ${startTime} ${words.booking}?`}>
        <p className="mt-3 text-body-lg text-text-secondary">
          {late
            ? `It's less than 2 hours before, so cancelling now counts as a missed booking. ${business.shortName} will offer your slot to someone else.`
            : `You're cancelling more than 2 hours before, so it won't count as a miss. ${business.shortName} will offer your slot to someone else.`}
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Button fullWidth autoFocus onClick={() => setSheetOpen(false)}>
            Keep my booking
          </Button>
          <Button
            variant="destructive"
            fullWidth
            className="border border-danger-primary"
            onClick={() => {
              setSheetOpen(false);
              cancelBooking(booking.id);
            }}
          >
            Cancel booking
          </Button>
        </div>
      </BottomSheet>
    </Screen>
  );
}
