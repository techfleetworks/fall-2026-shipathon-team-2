"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SparetimeLogo } from "@/components/brand/logo";
import { CATEGORY_WORDS, getBusiness } from "@/lib/mock-data";
import { formatTime } from "@/lib/slots";
import { isActive, markNotified, useBookings, useHydrated, useNowMinute, useProfile } from "@/lib/account";

// P2 · Reminder. One hour before a booking (when "Remind me" was on), an in-app
// notification card appears at the top of Deals and My bookings. If the person
// allowed notifications (O5b), a real browser notification is also shown once
// while the app is open. (Reminders by text need an SMS provider — later.)
const WINDOW_MS = 60 * 60_000;

export function ReminderBanner() {
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const bookings = useBookings();
  const profile = useProfile();

  // In-app card: follows each booking's own "Remind me" switch. Browser
  // notifications (below) additionally need the person's reminders choice.
  const due =
    hydrated && nowMs
      ? bookings
          .filter((b) => isActive(b, nowMs) && b.remind !== false)
          .find((b) => {
            const t = new Date(b.startsAt).getTime();
            return t - nowMs <= WINDOW_MS && t > nowMs;
          })
      : undefined;
  const business = due ? getBusiness(due.businessId) : undefined;
  const minutes = due ? Math.max(1, Math.round((new Date(due.startsAt).getTime() - nowMs) / 60_000)) : 0;
  const inText = minutes >= 55 ? "1 hour" : `${minutes} min`;
  const noun = business ? CATEGORY_WORDS[business.category].booking : "booking";
  const title = `Your ${noun} is in ${inText}`;
  const body = business && due ? `${business.shortName} · ${business.address}. Arrive by ${formatTime(new Date(due.startsAt))} and show your code at the counter.` : "";

  // Real browser notification, once per booking, if allowed.
  useEffect(() => {
    if (!due || due.notified || !profile?.reminders) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    try {
      new Notification(title, { body, tag: due.id });
    } catch {
      /* some browsers only allow notifications from a service worker */
    }
    markNotified(due.id);
  }, [due, profile?.reminders, title, body]);

  if (!due || !business) return null;

  // Not a live region: the minutes count changes every minute and would be
  // re-announced each time. It sits at the top of the page, so it's found first.
  return (
    <div className="mx-5 mt-3">
    <Link
      href={`/booked/${due.id}`}
      className="flex items-start gap-3 rounded-lg border border-border-default bg-surface-default p-3 shadow-e2 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      <SparetimeLogo size={28} />
      <span className="min-w-0 flex-1">
        <span className="block text-label-sm uppercase tracking-wide text-text-secondary">Sparetime · now</span>
        <span className="block text-title-sm text-text-primary">{title}</span>
        <span className="block text-body-sm text-text-secondary">{body}</span>
      </span>
    </Link>
    </div>
  );
}
