// SAMPLE BUSINESS DATA. We haven't partnered with or spoken to any shops yet, so
// the businesses, services, prices, hours and photos below are illustrative —
// we couldn't present real information on a business's behalf. Fresh Cuts
// mirrors the Figma demo exactly; the other shops follow the same pattern.
// Photos are the AI-generated demo images exported from Figma (public/figma/*).
// Everything about the PERSON (account, bookings) is real input — see
// src/lib/account.ts. Replace this file with Supabase queries later.

export type Category = "haircut" | "laundry" | "care";

export const CATEGORY_LABEL: Record<Category, string> = {
  haircut: "Haircut",
  laundry: "Laundry",
  care: "Clothing care",
};

// Sign-up "What do you need?" choices → categories (for the "For you" tab).
export const NEED_TO_CATEGORY: Record<string, Category> = {
  Haircuts: "haircut",
  Laundry: "laundry",
  "Clothing care": "care",
};

// Words that change with the kind of service, so laundry never says "chair".
export const CATEGORY_WORDS: Record<
  Category,
  { held: string; booking: string; ready: (shop: string) => string }
> = {
  haircut: { held: "chair", booking: "haircut", ready: (shop) => `${shop} will have your chair ready for the slot you pick.` },
  laundry: { held: "machine", booking: "laundry drop-off", ready: (shop) => `${shop} will have a machine ready for your drop-off.` },
  care: { held: "counter slot", booking: "pressing drop-off", ready: (shop) => `${shop} will be ready for your drop-off at the time you pick.` },
};

/** Opening hours per weekday, index 0 = Sunday … 6 = Saturday. [open, close] in 24h hours; null = closed. */
export type WeekHours = ([number, number] | null)[];

export interface Business {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  address: string;
  area: string;
  distanceMi: number;
  rating: number;
  photo: string;
  logo?: string;
  about: string;
  transit: string;
  hours: WeekHours;
  /** Discounted off-peak window: which weekdays, from/to hour (24h). */
  offPeak: { days: number[]; start: number; end: number };
  /** One-line description for Favorites cards. */
  blurb: string;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  regularPrice: number;
  offPeakPrice: number;
  includes: string;
  /** Length of one slot in minutes (30 for a chair, 60 for a drop-off window). */
  minutes: number;
}

export interface User {
  keptCount: number;
  missCount: number;
}

export function bookingLimit(user: Pick<User, "keptCount" | "missCount">): number | "unlimited" {
  if (user.missCount >= 2) return 1;
  if (user.keptCount >= 4) return "unlimited";
  if (user.keptCount >= 2) return 2;
  return 1;
}

// Plain-language status for "How bookings work" (H3b), following the trust ladder.
export function limitStatus(u: Pick<User, "keptCount" | "missCount">): { headline: string; detail: string } {
  const limit = bookingLimit(u);
  const kept = `You've shown up for ${u.keptCount} booking${u.keptCount === 1 ? "" : "s"}.`;
  if (u.missCount >= 2) {
    return { headline: "1 booking at a time", detail: "Two missed bookings reset your limit to one at a time. Show up to book more." };
  }
  if (limit === "unlimited") return { headline: "No limit", detail: `${kept} Keep showing up to keep it.` };
  if (limit === 2) {
    const left = 4 - u.keptCount;
    return { headline: "2 bookings at a time", detail: `${kept} ${left === 1 ? "One" : "Two"} more and there's no limit.` };
  }
  const left = 2 - u.keptCount;
  return {
    headline: "1 booking at a time",
    detail: u.keptCount === 0 ? "Show up for 2 bookings and you can hold 2 at once." : `${kept} ${left === 1 ? "One" : "Two"} more and you can hold 2 at once.`,
  };
}

export const savings = (s: Pick<Service, "regularPrice" | "offPeakPrice">) => s.regularPrice - s.offPeakPrice;

const WEEKDAYS = [1, 2, 3, 4, 5];

export const businesses: Business[] = [
  {
    id: "b1",
    name: "Fresh Cuts Barbershop",
    shortName: "Fresh Cuts",
    category: "haircut",
    address: "1420 W 7th St, Westlake",
    area: "Westlake",
    distanceMi: 0.6,
    rating: 4.8,
    photo: "/figma/fresh-cuts.png",
    logo: "/figma/fresh-cuts-logo.svg",
    about:
      "A barbershop near the 7th St/Metro station, open since 2019. Walk-ins welcome. Sparetime slots are held for you, so you won’t wait.",
    transit: "4 min walk from 7th St/Metro",
    hours: [null, [10, 19], [10, 19], [10, 19], [10, 19], [10, 19], [9, 17]],
    offPeak: { days: WEEKDAYS, start: 13, end: 17 },
    blurb: "Haircuts",
  },
  {
    id: "b2",
    name: "Studio 7 Salon",
    shortName: "Studio 7",
    category: "haircut",
    address: "815 S Hill St, Downtown LA",
    area: "Downtown LA",
    distanceMi: 0.9,
    rating: 4.6,
    photo: "/figma/studio-7.png",
    about:
      "A small salon on Hill Street with three stylists. Sparetime slots are its quiet weekday afternoons, so your stylist isn’t rushed.",
    transit: "6 min walk from Pershing Square station",
    hours: [null, null, [10, 19], [10, 19], [10, 19], [10, 19], [10, 18]],
    offPeak: { days: [2, 3, 4, 5], start: 13, end: 16 },
    blurb: "Cuts and styling",
  },
  {
    id: "b3",
    name: "Main St Barbers",
    shortName: "Main St",
    category: "haircut",
    address: "2047 S Main St, South Park",
    area: "South Park",
    distanceMi: 1.2,
    rating: 4.7,
    photo: "/figma/main-st.png",
    about: "A neighborhood barbershop on Main Street for classic cuts and fades. Its off-peak hours are weekday mid-afternoons.",
    transit: "5 min walk from Grand/LATTC station",
    hours: [null, [9, 18], [9, 18], [9, 18], [9, 18], [9, 18], [9, 18]],
    offPeak: { days: WEEKDAYS, start: 15, end: 17 },
    blurb: "Haircuts",
  },
  {
    id: "b4",
    name: "Spin City Laundry",
    shortName: "Spin City",
    category: "laundry",
    address: "535 Alvarado St, Westlake",
    area: "Westlake",
    distanceMi: 0.6,
    rating: 4.5,
    photo: "/figma/spin-city.png",
    about:
      "A full-service laundromat. Drop off your laundry in a quiet hour and they wash, dry and fold it, ready to pick up the same evening.",
    transit: "2 min walk from Westlake/MacArthur Park station",
    hours: [[7, 22], [7, 22], [7, 22], [7, 22], [7, 22], [7, 22], [7, 22]],
    offPeak: { days: WEEKDAYS, start: 10, end: 14 },
    blurb: "Wash and fold",
  },
  {
    id: "b5",
    name: "Prime Press",
    shortName: "Prime Press",
    category: "care",
    address: "312 E 2nd St, Little Tokyo",
    area: "Little Tokyo",
    distanceMi: 1.1,
    rating: 4.7,
    photo: "/figma/prime-press.png",
    about:
      "A dry cleaner and pressing shop in Little Tokyo. Drop off in a quiet window and your items are pressed and ready the next day.",
    transit: "4 min walk from Little Tokyo/Arts District station",
    hours: [null, [8, 18], [8, 18], [8, 18], [8, 18], [8, 18], [8, 15]],
    offPeak: { days: WEEKDAYS, start: 11, end: 14 },
    blurb: "Dry cleaning and pressing",
  },
];

// 9 offers in total, matching the Figma "9 offers". Fresh Cuts' three come
// straight from Figma (Haircut, Beard trim, Kids' haircut).
export const services: Service[] = [
  { id: "s1", businessId: "b1", name: "Haircut", regularPrice: 28, offPeakPrice: 12, includes: "wash, cut and a hot-towel finish", minutes: 30 },
  { id: "s6", businessId: "b1", name: "Beard trim", regularPrice: 15, offPeakPrice: 8, includes: "trim, line-up and a hot-towel finish", minutes: 30 },
  { id: "s7", businessId: "b1", name: "Kids’ haircut", regularPrice: 20, offPeakPrice: 10, includes: "cut and style for kids under 12", minutes: 30 },
  { id: "s2", businessId: "b2", name: "Wash, cut and style", regularPrice: 40, offPeakPrice: 18, includes: "wash, cut and blow-dry", minutes: 60 },
  { id: "s8", businessId: "b2", name: "Blowout", regularPrice: 30, offPeakPrice: 14, includes: "wash and blow-dry", minutes: 30 },
  { id: "s3", businessId: "b3", name: "Classic cut", regularPrice: 22, offPeakPrice: 10, includes: "clipper or scissor cut and a neck shave", minutes: 30 },
  { id: "s4", businessId: "b4", name: "Wash and fold, 15 lb", regularPrice: 15, offPeakPrice: 6, includes: "wash, dry and fold, ready the same evening", minutes: 60 },
  { id: "s9", businessId: "b4", name: "Wash and fold, 25 lb", regularPrice: 24, offPeakPrice: 10, includes: "wash, dry and fold, ready the same evening", minutes: 60 },
  { id: "s5", businessId: "b5", name: "Shirt press (5 items)", regularPrice: 30, offPeakPrice: 9, includes: "press and hang, ready the next day", minutes: 60 },
];

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export const getBusiness = (id: string) => businesses.find((b) => b.id === id);
export const getService = (id: string) => services.find((s) => s.id === id);
export const servicesAt = (businessId: string) => services.filter((s) => s.businessId === businessId);
