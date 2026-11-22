import type { Business, Service, WeekHours } from "./mock-data";

// Real-date open times for the sample shops. Slots are generated from each
// shop's off-peak window for today and the next two days, in the person's local
// time. Past times are skipped. Some slots show as "taken" (a stable pseudo-random
// pick per shop/time, standing in for other customers) plus any the person has
// booked themselves. Only call these on the client (they read the clock).

export const DAYS_AHEAD = 3;
const MIN_LEAD_MINUTES = 15;
const TAKEN_SHARE = 0.3;

export interface OpenSlot {
  start: Date;
  end: Date;
  taken: boolean;
}

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

/** Today, tomorrow and the day after (midnight of each). */
export const upcomingDays = (now: Date) => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(startOfDay(now), i));

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 2 ** 32;
}

/** Open off-peak slots for one service on one day. `mine` = start times (ms) the person already booked. */
export function slotsFor(service: Service, business: Business, day: Date, now: Date, mine: Set<number> = new Set()): OpenSlot[] {
  const { days, start, end } = business.offPeak;
  if (!days.includes(day.getDay())) return [];
  const out: OpenSlot[] = [];
  for (let m = start * 60; m + service.minutes <= end * 60; m += service.minutes) {
    const s = new Date(startOfDay(day).getTime() + m * 60_000);
    if (s.getTime() < now.getTime() + MIN_LEAD_MINUTES * 60_000) continue;
    const key = `${service.id}|${s.getFullYear()}-${s.getMonth()}-${s.getDate()}|${m}`;
    out.push({
      start: s,
      end: new Date(s.getTime() + service.minutes * 60_000),
      taken: mine.has(s.getTime()) || hash(key) < TAKEN_SHARE,
    });
  }
  return out;
}

/** First day (of the next three) with a free slot, and that day's free slots. */
export function nextAvailability(service: Service, business: Business, now: Date) {
  for (const day of upcomingDays(now)) {
    const free = slotsFor(service, business, day, now).filter((s) => !s.taken);
    if (free.length) return { day, free };
  }
  return null;
}

/** Favorites status for a place: "3 offers today" / "1 offer tomorrow" / "2 offers on Mon 23". */
export function placeOfferStatus(business: Business, services: Service[], now: Date) {
  for (const day of upcomingDays(now)) {
    const n = services.filter((s) => slotsFor(s, business, day, now).some((x) => !x.taken)).length;
    if (n) {
      const when = relativeDay(day, now);
      const label = when === "Today" ? "today" : when === "Tomorrow" ? "tomorrow" : `on ${when}`;
      return { open: true, text: `${n} offer${n === 1 ? "" : "s"} ${label}` };
    }
  }
  return { open: false, text: "No open times soon" };
}

// ---- Formatting -------------------------------------------------------------

/** 13.5 → "1:30 pm"; whole hours drop ":00" only when `short`. */
export function formatTime(d: Date, short = false) {
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? "am" : "pm";
  return short && m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** "2:30–3:00 pm", or "11:30 am–12:30 pm" when it crosses noon. */
export function formatRange(start: Date, end: Date) {
  const sameHalf = start.getHours() < 12 === end.getHours() < 12;
  return sameHalf ? `${formatTime(start).replace(/ (am|pm)$/, "")}–${formatTime(end)}` : `${formatTime(start)}–${formatTime(end)}`;
}

/** "1–5 pm" / "10 am–2 pm" for whole hours. */
export function formatHourRange(from: number, to: number) {
  const f = (h: number) => `${h % 12 === 0 ? 12 : h % 12}`;
  const ap = (h: number) => (h < 12 ? "am" : "pm");
  return ap(from) === ap(to) ? `${f(from)}–${f(to)} ${ap(to)}` : `${f(from)} ${ap(from)}–${f(to)} ${ap(to)}`;
}

/** "Tue 24" */
export const shortDay = (d: Date) => `${WEEKDAY_SHORT[d.getDay()]} ${d.getDate()}`;
/** "Tuesday" */
export const longDay = (d: Date) => WEEKDAY_LONG[d.getDay()];
/** "Today" / "Tomorrow" / "Mon 23" */
export function relativeDay(d: Date, now: Date) {
  if (sameDay(d, now)) return "Today";
  if (sameDay(d, addDays(now, 1))) return "Tomorrow";
  return shortDay(d);
}

/** "weekdays 1–5 pm" / "Tue–Fri 1–4 pm" */
export function offPeakLabel(b: Business) {
  const { days, start, end } = b.offPeak;
  const range = formatHourRange(start, end);
  if (days.join() === "1,2,3,4,5") return `weekdays ${range}`;
  const sorted = [...days].sort();
  return `${WEEKDAY_SHORT[sorted[0]]}–${WEEKDAY_SHORT[sorted[sorted.length - 1]]} ${range}`;
}

/** Groups opening hours for display: [["Mon–Fri", "10 am – 7 pm"], ["Saturday", …], ["Sunday", "Closed"]]. */
export function groupHours(hours: WeekHours): [string, string][] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const label = (h: [number, number] | null) =>
    h ? `${formatHourRange(h[0], h[1]).replace("–", " – ")}` : "Closed";
  const rows: { from: number; to: number; text: string }[] = [];
  for (const d of order) {
    const text = label(hours[d]);
    const last = rows[rows.length - 1];
    if (last && last.text === text) last.to = d;
    else rows.push({ from: d, to: d, text });
  }
  return rows.map((r) => [
    r.from === r.to ? WEEKDAY_LONG[r.from] : r.from === 0 && r.to === 0 ? "Sunday" : `${WEEKDAY_SHORT[r.from]}–${WEEKDAY_SHORT[r.to]}`,
    r.text,
  ]);
}

/** Closing time for a given day, e.g. "7 pm" (or null if closed). */
export function closesAt(b: Business, day: Date) {
  const h = b.hours[day.getDay()];
  if (!h) return null;
  const c = h[1];
  return `${c % 12 === 0 ? 12 : c % 12} ${c < 12 ? "am" : "pm"}`;
}
