"use client";

import { SwitchVisual } from "@/components/ui/switch";
import { ListGroup } from "@/components/ui/list-row";
import { updateProfile, useHydrated, useProfile, type Profile } from "@/lib/account";

// Notification toggles take effect immediately (no Save) and are saved to the
// person's account — the same choices as the reminders sheet after sign-up.
// Turning booking reminders on also asks the browser for permission.
const ITEMS: { key: "reminders" | "bookingTexts" | "offerAlerts" | "favoriteAlerts"; title: string; sub: string; fallback: boolean }[] = [
  { key: "reminders", title: "Booking reminders", sub: "1 hour before your booking", fallback: true },
  { key: "bookingTexts", title: "Booking texts", sub: "Confirmations and reminders by text", fallback: false },
  { key: "offerAlerts", title: "Offer alerts", sub: "New offers near you, up to 1 a day", fallback: false },
  { key: "favoriteAlerts", title: "Favorites", sub: "When a saved place posts an offer", fallback: false },
];

export function NotificationSettings() {
  const hydrated = useHydrated();
  const profile = useProfile();

  const value = (key: (typeof ITEMS)[number]["key"], fallback: boolean) => {
    const v = profile?.[key as keyof Profile];
    return typeof v === "boolean" ? v : fallback;
  };

  const change = async (key: (typeof ITEMS)[number]["key"], next: boolean) => {
    if (key === "reminders" && next && typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {
        /* in-app reminders still work */
      }
    }
    updateProfile({ [key]: next });
  };

  // If the browser has blocked notifications, say so instead of failing silently.
  const blocked =
    hydrated && value("reminders", true) && typeof Notification !== "undefined" && Notification.permission === "denied";

  return (
    <>
      <ListGroup>
        {/* Each whole row is the switch: a big, easy tap target. */}
        {ITEMS.map((i) => {
          const on = hydrated ? value(i.key, i.fallback) : i.fallback;
          return (
            <button
              key={i.key}
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => change(i.key, !on)}
              className="flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-title-sm text-text-primary">{i.title}</span>
                <span className="block text-body-sm text-text-secondary">{i.sub}</span>
              </span>
              <SwitchVisual checked={on} />
            </button>
          );
        })}
      </ListGroup>
      {blocked && (
        <p role="status" className="mt-2 px-1 text-body-sm text-text-secondary">
          Notifications are blocked in your browser settings, so reminders will show inside the app only.
        </p>
      )}
    </>
  );
}
