"use client";

import Link from "next/link";
import { SparetimeLogo } from "@/components/brand/logo";
import { CATEGORY_WORDS, getBusiness } from "@/lib/mock-data";
import { formatTime } from "@/lib/slots";
import { isActive, useBookings, useHydrated, useNowMinute } from "@/lib/account";

// P2 · Reminder — DEMONSTRATION ONLY. Recreates the phone lock screen with the
// "Your haircut is in 1 hour" notification so the pitch can start the show-up
// flow from someone's phone. Real reminders come from the phone's own
// notifications, so this page should be removed after the demo.
// See docs/notes-for-judges.md.
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ReminderDemoPage() {
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const bookings = useBookings();

  const next =
    hydrated && nowMs
      ? bookings.filter((b) => isActive(b, nowMs)).sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0]
      : undefined;
  const business = next ? getBusiness(next.businessId) : undefined;
  const start = next ? new Date(next.startsAt) : null;
  const remindAt = start ? new Date(start.getTime() - 60 * 60_000) : null;
  const clock = remindAt ? formatTime(remindAt).replace(/ (am|pm)$/, "") : "";

  return (
    <div className="min-h-dvh w-full bg-text-primary">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-4 pt-16 pb-8 text-surface-default">
        {remindAt && business && next && start ? (
          <>
            <p className="text-center text-title-md">
              {DAYS[remindAt.getDay()]}, {MONTHS[remindAt.getMonth()]} {remindAt.getDate()}
            </p>
            <p className="text-center font-display text-[80px] leading-none font-bold">{clock}</p>

            <Link
              href={`/booked/${next.id}`}
              className="mt-16 flex items-start gap-3 rounded-xl bg-surface-default p-4 text-text-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-surface"
            >
              <SparetimeLogo size={28} />
              <span className="min-w-0 flex-1">
                <span className="block text-label-sm uppercase tracking-wide text-text-secondary">Sparetime · now</span>
                <span className="block text-title-md text-text-primary">
                  Your {CATEGORY_WORDS[business.category].booking} is in 1 hour
                </span>
                <span className="block text-body-md text-text-secondary">
                  {business.shortName} · {business.address}. Arrive by {formatTime(start)} and show your code at the counter.
                </span>
              </span>
            </Link>
          </>
        ) : (
          <div className="mt-24 rounded-xl bg-surface-default p-5 text-center text-text-primary">
            <p className="text-title-md">{hydrated ? "No upcoming booking yet" : "Loading…"}</p>
            {hydrated && (
              <>
                <p className="mt-1 text-body-md text-text-secondary">Book a slot first. Its reminder will appear here.</p>
                <Link href="/deals" className="mt-3 inline-flex min-h-[48px] items-center rounded-full px-4 text-label-lg text-action-primary">
                  Find offers
                </Link>
              </>
            )}
          </div>
        )}

        <p className="mt-auto pt-10 text-center text-body-sm text-accent-surface">
          Demo screen: shows how the reminder looks on a phone&apos;s lock screen. Tap the notification to open the booking.
        </p>
      </div>
    </div>
  );
}
