"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Screen, ScreenBody, AppBar, BottomActionBar } from "@/components/ui/screen";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { LoadingRow } from "@/components/ui/spinner";
import { CATEGORY_WORDS, getBusiness, getService } from "@/lib/mock-data";
import { formatTime, longDay, offPeakLabel, relativeDay, sameDay, slotsFor, upcomingDays } from "@/lib/slots";
import { setDraft, setSlotGone, useAccount, useBookings, useHydrated, useNowMinute } from "@/lib/account";
import { go } from "@/lib/nav-motion";

// R5t · Pick a time. Real dates: today and the next two days, built from the
// shop's off-peak hours. Nothing is pre-selected; Continue waits for a pick.
export function PickTime({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const service = getService(serviceId)!;
  const business = getBusiness(service.businessId)!;
  const words = CATEGORY_WORDS[business.category];
  const hydrated = useHydrated();
  const nowMs = useNowMinute();
  const bookings = useBookings();
  const { reschedule, slotGone } = useAccount();
  // Rescheduling only applies to the same service the booking was for.
  const replaces = bookings.find((b) => b.id === reschedule && b.serviceId === serviceId && b.status === "booked")?.id;
  const [dayIdx, setDayIdx] = useState<number | null>(null);
  const [pick, setPick] = useState<number | null>(null);

  const ready = hydrated && nowMs > 0;
  const now = new Date(nowMs);
  const mine = new Set(
    bookings.filter((b) => b.serviceId === serviceId && b.status === "booked").map((b) => new Date(b.startsAt).getTime()),
  );
  const days = ready ? upcomingDays(now) : [];
  const daySlots = days.map((d) => slotsFor(service, business, d, now, mine));
  const firstOpen = daySlots.findIndex((s) => s.some((x) => !x.taken));

  // R5x · The time picked earlier stopped being available: suggest the nearest
  // open time (same day first) and pre-select it.
  // Only fresh notices count (10 min), so leaving and coming back later doesn't
  // show an old apology.
  const fresh = slotGone && slotGone.serviceId === serviceId && nowMs - (slotGone.at ?? 0) < 10 * 60_000;
  const gone = fresh && slotGone ? new Date(slotGone.startsAt) : null;
  const goneStarted = gone ? gone.getTime() <= nowMs : false;
  let alt: { day: number; start: number } | null = null;
  if (gone && ready) {
    // Same day as the gone time first, then the other days in order.
    const order = [...daySlots.keys()].sort((a, b) => Number(!sameDay(days[a], gone)) - Number(!sameDay(days[b], gone)));
    for (const i of order) {
      const free = daySlots[i].find((x) => !x.taken && x.start.getTime() >= gone.getTime()) ?? daySlots[i].find((x) => !x.taken);
      if (free) {
        alt = { day: i, start: free.start.getTime() };
        break;
      }
    }
  }

  const selected = dayIdx ?? alt?.day ?? (firstOpen >= 0 ? firstOpen : 0);
  const slotsToday = daySlots[selected] ?? [];
  const effectivePick = pick ?? (dayIdx === null ? alt?.start ?? null : null);
  const picked = slotsToday.find((s) => s.start.getTime() === effectivePick);
  const pickedDay = days[selected];
  const dayWord = pickedDay ? (sameDay(pickedDay, now) ? "today" : relativeDay(pickedDay, now) === "Tomorrow" ? "tomorrow" : longDay(pickedDay)) : "";

  return (
    <Screen>
      <AppBar title={replaces ? "Pick a new time" : "Pick a time"} onBack={() => go(router, `/offer/${serviceId}`, "back")} />
      <ScreenBody>
        <p className="text-body-lg text-text-secondary">{words.ready(business.shortName)}</p>

        {ready && gone && (
          <div role="alert" className="mt-4 rounded-lg bg-danger-surface px-4 py-3 text-on-tint-danger">
            <p className="text-title-sm">Sorry, {formatTime(gone)} isn&apos;t available any more</p>
            <p className="mt-0.5 text-body-md">
              {goneStarted ? "That time has already started." : "It's no longer open for booking."}{" "}
              {alt
                ? `${formatTime(new Date(alt.start))}${
                    sameDay(new Date(alt.start), gone)
                      ? ""
                      : (() => {
                          const d = relativeDay(new Date(alt.start), now);
                          return d === "Today" || d === "Tomorrow" ? ` ${d.toLowerCase()}` : ` on ${d}`;
                        })()
                  } is still open, at the same $${service.offPeakPrice} deal.`
                : "Try another day."}
            </p>
          </div>
        )}

        {!ready ? (
          <div className="mt-4">
            <LoadingRow label="Finding open times…" />
          </div>
        ) : (
          <>
            <div className="mt-4 flex gap-2" role="tablist" aria-label="Day">
              {days.map((d, i) => (
                <Chip
                  key={d.getTime()}
                  as="tab"
                  selected={selected === i}
                  onClick={() => {
                    setDayIdx(i);
                    setPick(null);
                  }}
                >
                  {relativeDay(d, now)}
                </Chip>
              ))}
            </div>

            <p className="mt-5 text-title-sm text-text-heading">
              {relativeDay(days[selected], now)} · {service.minutes}-minute {business.category === "haircut" ? "slots" : "drop-off windows"}
            </p>

            {slotsToday.length === 0 ? (
              <div className="mt-3 rounded-lg bg-surface-muted px-4 py-4 text-body-md text-text-secondary">
                No open times {sameDay(days[selected], now) ? "left today" : `on ${longDay(days[selected])}`}. {business.shortName}{" "}
                offers off-peak slots {offPeakLabel(business)}. Try another day.
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2" role="radiogroup" aria-label="Time">
                {slotsToday.map((s) => {
                  const t = s.start.getTime();
                  return s.taken ? (
                    <div
                      key={t}
                      aria-disabled
                      className="flex items-center justify-between rounded-lg border border-dashed border-border-default px-4 py-4 text-text-secondary"
                    >
                      <span className="flex items-center gap-3">
                        <span className="h-6 w-6 rounded-full border-2 border-border-default" />
                        <span className="text-body-lg">{formatTime(s.start)}</span>
                      </span>
                      <span className="text-body-md">{mine.has(t) ? "Your booking" : "Booked"}</span>
                    </div>
                  ) : (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={effectivePick === t}
                      onClick={() => setPick(t)}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-4 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                        effectivePick === t ? "border-action-primary ring-1 ring-action-primary" : "border-border-default hover:bg-surface-muted",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full border-2",
                            effectivePick === t ? "border-action-primary" : "border-border-control",
                          )}
                        >
                          {effectivePick === t && <span className="h-3 w-3 rounded-full bg-action-primary" />}
                        </span>
                        <span className="text-body-lg text-text-primary">{formatTime(s.start)}</span>
                      </span>
                      <span className="text-body-md text-text-secondary">Open</span>
                    </button>
                  );
                })}
              </div>
            )}

            {picked && (
              <p className="mt-4 text-title-sm text-text-heading" role="status">
                {business.shortName} will expect you {dayWord} at {formatTime(picked.start)}.
              </p>
            )}
          </>
        )}
      </ScreenBody>

      <BottomActionBar>
        <p className="mb-2 text-center text-body-sm text-text-secondary">
          {service.name} · ${service.offPeakPrice} · cash at the shop
        </p>
        <Button
          fullWidth
          disabled={!picked}
          onClick={() => {
            if (!picked) return;
            setSlotGone(null);
            setDraft({ serviceId, startsAt: picked.start.toISOString(), endsAt: picked.end.toISOString(), replaces });
            go(router, "/confirm", "forward");
          }}
        >
          Continue
        </Button>
      </BottomActionBar>
    </Screen>
  );
}
