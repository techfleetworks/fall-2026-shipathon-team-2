"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Screen, ScreenBody, BottomActionBar } from "@/components/ui/screen";
import { Button, ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { CATEGORY_WORDS } from "@/lib/mock-data";
import { formatTime, relativeDay } from "@/lib/slots";
import { rateBooking } from "@/lib/account";
import { useBooking } from "@/components/booking/use-booking";
import { BookingLoading, BookingMissing } from "@/components/booking/booking-states";
import { ShopBadge } from "@/components/booking/shop-badge";
import { PageHeader } from "@/components/ui/page-header";

// P6 · Rate your visit. 1–5 stars (nothing pre-selected) plus optional "What
// went well?" chips; saved to the visit on this device. Figma notes the chip row
// is tight at 375px, so the chips wrap onto two lines here.
const TAGS = ["On time", "Friendly", "Clean", "Value"];
const STAR_WORDS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export function RateView({ bookingId }: { bookingId: string }) {
  const data = useBooking(bookingId);
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thanksRef = useRef<HTMLParagraphElement>(null);
  const rated = data.state === "ok" && !!data.booking.rating;

  // After submitting, move focus to the thank-you message so keyboard and
  // screen-reader users aren't left on a button that disappeared.
  useEffect(() => {
    if (rated) thanksRef.current?.focus();
  }, [rated]);

  if (data.state === "loading") return <BookingLoading title="Rate your visit" />;
  if (data.state === "missing") return <BookingMissing title="Rate your visit" />;

  const { booking, business, now } = data;
  const start = new Date(booking.startsAt);
  const day = relativeDay(start, now);
  const when = `${day === "Today" ? "today" : day === "Tomorrow" ? "tomorrow" : `on ${day}`}, ${formatTime(start)}`;

  // Only confirmed visits can be rated.
  if (booking.status !== "kept") {
    return (
      <Screen>
        <PageHeader title="Rate your visit" backHref="/bookings" />
        <ScreenBody className="pt-2">
          <p className="text-body-lg text-text-secondary">
            You can rate {business.shortName} after your visit has been confirmed at the counter.
          </p>
          <ButtonLink href={`/booked/${booking.id}`} fullWidth className="mt-4">
            See your booking
          </ButtonLink>
        </ScreenBody>
      </Screen>
    );
  }

  // Stars follow the ARIA radio-group pattern: one tab stop, arrow keys move.
  const onStarKey = (e: React.KeyboardEvent, n: number) => {
    const next =
      e.key === "ArrowRight" || e.key === "ArrowUp" ? Math.min(5, n + 1) : e.key === "ArrowLeft" || e.key === "ArrowDown" ? Math.max(1, n - 1) : e.key === "Home" ? 1 : e.key === "End" ? 5 : 0;
    if (!next) return;
    e.preventDefault();
    setStars(next);
    starRefs.current[next - 1]?.focus();
  };

  if (booking.rating) {
    return (
      <Screen>
        <ScreenBody className="pt-6 text-center">
          <h1 className="text-left text-headline-lg text-text-heading">Rate your visit</h1>
          <ShopBadge business={business} check />
          <p ref={thanksRef} tabIndex={-1} role="status" className="mt-6 text-headline-sm text-text-heading focus:outline-none">
            Thanks for rating {business.shortName}
          </p>
          <p className="mt-2 text-body-lg text-text-secondary">
            You gave {booking.rating.stars} out of 5. Ratings help other people find good shops.
          </p>
        </ScreenBody>
        <BottomActionBar className="border-t-0!">
          <ButtonLink href="/deals" fullWidth>
            Find another deal
          </ButtonLink>
        </BottomActionBar>
      </Screen>
    );
  }

  const toggle = (t: string) => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">Rate your visit</h1>
        <ShopBadge business={business} />
        <p className="mt-5 text-center text-headline-sm text-text-heading">How was {business.shortName}?</p>
        <p className="mt-1 text-center text-body-lg text-text-secondary">
          Your {CATEGORY_WORDS[business.category].booking} {when}
        </p>

        <div role="radiogroup" aria-label="Rating, 1 to 5 stars" className="mt-4 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              ref={(el) => {
                starRefs.current[n - 1] = el;
              }}
              type="button"
              role="radio"
              aria-checked={stars === n}
              aria-label={`${n} star${n === 1 ? "" : "s"}, ${STAR_WORDS[n]}`}
              tabIndex={stars ? (stars === n ? 0 : -1) : n === 1 ? 0 : -1}
              onKeyDown={(e) => onStarKey(e, n)}
              onClick={() => setStars(n)}
              className="flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <Icon
                name={n <= stars ? "star-filled" : "star"}
                size={32}
                className={cn(n <= stars ? "text-action-primary" : "text-border-control")}
              />
            </button>
          ))}
        </div>
        <p className="text-center text-body-sm text-text-secondary" aria-live="polite">
          {stars ? `${stars} out of 5 · ${STAR_WORDS[stars]} · Tap a star to change it` : "Tap a star to rate"}
        </p>

        <fieldset className="mt-5">
          <legend className="text-label-md text-text-secondary">What went well? (optional)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <Chip key={t} selected={tags.includes(t)} onClick={() => toggle(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </fieldset>
        <p className="mt-3 text-center text-body-sm text-text-secondary">Ratings are anonymous. Shops only see the average.</p>
      </ScreenBody>

      <BottomActionBar className="flex flex-col items-center gap-1 border-t-0!">
        <Button fullWidth disabled={!stars} onClick={() => rateBooking(booking.id, stars, tags)}>
          Submit rating
        </Button>
        <ButtonLink href="/deals" variant="text">
          Skip
        </ButtonLink>
      </BottomActionBar>
    </Screen>
  );
}
