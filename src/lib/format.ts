// Small display helpers shared by the screens.
// These intentionally don't read the current clock, so they're safe to call
// during render (this project uses Next's Cache Components).

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function time(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

// e.g. "Fri, Nov 14 · 5:30–7:00 PM"
export function formatPickupWindow(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const day = start.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `${day} · ${time(start)}–${time(end)}`;
}

// e.g. "5:30–6:00 PM" (used for the pickup-time chips)
export function formatTimeRange(startIso: string, endIso: string): string {
  return `${time(new Date(startIso))}–${time(new Date(endIso))}`;
}

// e.g. "Best by Nov 15"
export function formatBestBy(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return `Best by ${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}
