"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { ListGroup, ListRow } from "@/components/ui/list-row";

// Notification toggles take effect immediately (no Save). Demo: kept in this page
// only until the backend stores preferences.
const ITEMS = [
  { key: "reminders", title: "Booking reminders", sub: "1 hour before your booking", initial: true },
  { key: "offers", title: "Offer alerts", sub: "New offers near you, up to 1 a day", initial: false },
  { key: "favorites", title: "Favorites", sub: "When a saved place posts an offer", initial: false },
] as const;

export function NotificationSettings() {
  const [on, setOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ITEMS.map((i) => [i.key, i.initial])),
  );

  return (
    <ListGroup>
      {ITEMS.map((i) => (
        <ListRow
          key={i.key}
          title={i.title}
          sub={i.sub}
          trailing={
            <Switch label={i.title} checked={on[i.key]} onChange={(next) => setOn((prev) => ({ ...prev, [i.key]: next }))} />
          }
        />
      ))}
    </ListGroup>
  );
}
