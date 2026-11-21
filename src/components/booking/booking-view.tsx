"use client";

import { useState } from "react";
import Link from "next/link";
import { Screen, ScreenBody } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { BookingTicket } from "@/components/ui/booking-ticket";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { NavBar } from "@/components/ui/nav-bar";
import { CATEGORY_LABEL, type Booking, type Business, type Service } from "@/lib/mock-data";

// P1 "Your booking" (booked) and P3 "It's today" share this screen; they differ in
// the ticket header, the secondary action, and the "when" copy. Cancelling opens
// P1c (bottom sheet) and, once confirmed, swaps to a clear "cancelled" status.
type Variant = "booked" | "today";

// Demo slot: Tue Nov 24 2026, 2:30–3:00 pm (local time).
const ICS_START = "20261124T143000";
const ICS_END = "20261124T150000";

function downloadCalendarFile(booking: Booking, business: Business, service: Service) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sparetime//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.ref}@sparetime`,
    `DTSTART:${ICS_START}`,
    `DTEND:${ICS_END}`,
    `SUMMARY:${service.name} at ${business.name}`,
    `LOCATION:${business.address.replace(/,/g, "\\,")}`,
    `DESCRIPTION:Booking ${booking.ref}. Pay $${service.offPeakPrice} cash at the shop.`,
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

export function BookingView({
  variant,
  booking,
  business,
  service,
}: {
  variant: Variant;
  booking: Booking;
  business: Business;
  service: Service;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const serviceWord = CATEGORY_LABEL[business.category].toLowerCase();
  const shortName = business.name.split(" ").slice(0, 2).join(" ");
  // "2:30–3:00 pm" → "2:30 pm"
  const [start, end] = booking.timeRange.split("–");
  const startTime = `${start} ${end.split(" ")[1] ?? ""}`.trim();

  if (cancelled) {
    return (
      <Screen>
        <PageHeader title="Your booking" backHref="/deals" />
        <ScreenBody className="flex flex-col items-start gap-4">
          <StatusBadge tone="neutral">
            <Icon name="x" size={14} /> Cancelled
          </StatusBadge>
          <p role="status" className="text-body-lg text-text-primary">
            Your {startTime} {serviceWord} at {business.name} is cancelled. It won&apos;t count as a missed booking.
          </p>
          <ButtonLink href="/deals" fullWidth>
            Find another deal
          </ButtonLink>
        </ScreenBody>
        <NavBar active="bookings" />
      </Screen>
    );
  }

  const isToday = variant === "today";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${business.address}`)}`;

  return (
    <Screen>
      <PageHeader title="Your booking" backHref="/deals" />
      <ScreenBody className="pt-0">
        {!isToday && (
          <p className="mb-4 text-body-lg text-text-secondary">
            You&apos;re all set. We&apos;ll remind you Tuesday at 1:30 pm.
          </p>
        )}

        <BookingTicket
          booking={booking}
          business={business}
          service={service}
          when={isToday ? `Today, ${booking.timeRange}` : `${booking.dayLabel}, ${booking.timeRange}`}
          status={
            isToday
              ? { tone: "today", label: "It’s today", icon: "calendar", headline: `Arrive by ${startTime}` }
              : { tone: "booked", label: "Booked", icon: "check", headline: `Tuesday at ${startTime}` }
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
          <Link
            href={`/offer/${service.id}/time`}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-4 text-label-md text-text-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <Icon name="calendar" size={18} /> Reschedule
          </Link>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-4 text-label-md text-text-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <Icon name="x" size={18} /> Cancel booking
          </button>
        </div>
      </ScreenBody>

      <div className="sticky bottom-0 z-10 bg-surface-default">
        <div className="px-5 pt-3 pb-3">
          <ButtonLink href={`/code/${booking.id}`} fullWidth>
            Show my code
          </ButtonLink>
        </div>
        <NavBar active="bookings" />
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={`Cancel your ${startTime} ${serviceWord}?`}>
        <p className="mt-3 text-body-lg text-text-secondary">
          You&apos;re cancelling more than 2 hours before, so it won&apos;t count as a miss. {shortName} will offer your
          slot to someone else.
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
              setCancelled(true);
            }}
          >
            Cancel booking
          </Button>
        </div>
      </BottomSheet>
    </Screen>
  );
}
