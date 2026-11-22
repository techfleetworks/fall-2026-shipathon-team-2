"use client";

import { Switch } from "@/components/ui/switch";
import { ListGroup, ListRow } from "@/components/ui/list-row";
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
        {ITEMS.map((i) => (
          <ListRow
            key={i.key}
            title={i.title}
            sub={i.sub}
            trailing={
              <Switch label={i.title} checked={hydrated ? value(i.key, i.fallback) : i.fallback} onChange={(next) => change(i.key, next)} />
            }
          />
        ))}
      </ListGroup>
      {blocked && (
        <p role="status" className="mt-2 px-1 text-body-sm text-text-secondary">
          Notifications are blocked in your browser settings, so reminders will show inside the app only.
        </p>
      )}
    </>
  );
}
