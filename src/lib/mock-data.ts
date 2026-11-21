// Mock data for the Sparetime happy-path prototype. Fake businesses only (photos
// are placeholders). Numbers are kept consistent across screens per the Figma
// handoff: Tue 24 · 2:30 pm · $12 paid / $28 regular · 12:30 pm cancel deadline ·
// cash at the shop. Replace with Supabase queries when wiring the real backend
// (see docs/data-contract-v2.md and docs/frontend-build-plan.md §7).

export type Category = "haircut" | "laundry" | "care";

export const CATEGORY_LABEL: Record<Category, string> = {
  haircut: "Haircut",
  laundry: "Laundry",
  care: "Clothing care",
};

export interface Business {
  id: string;
  name: string;
  category: Category;
  area: string;
  distanceMi: number;
  rating: number;
  /** placeholder image hue for the photo block until real photos are exported */
  photoHue: number;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  regularPrice: number;
  offPeakPrice: number;
}

export interface Slot {
  id: string;
  serviceId: string;
  /** ISO-like display is derived in the UI; keep raw parts for the prototype */
  day: string; // e.g. "Tue 24"
  time: string; // e.g. "2:30 pm"
  taken: boolean;
}

export type BookingStatus = "booked" | "today" | "kept" | "missed" | "cancelled";

export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  slotId: string;
  code: string; // SPRT-XXXXXX
  status: BookingStatus;
}

export interface User {
  firstName: string;
  phone: string;
  keptCount: number;
  missCount: number;
}

/** Trust-ladder limit derived from kept/miss counts (rules §5). */
export function bookingLimit(user: Pick<User, "keptCount" | "missCount">): number | "unlimited" {
  if (user.missCount >= 2) return 1;
  if (user.keptCount >= 4) return "unlimited";
  if (user.keptCount >= 2) return 2;
  return 1;
}

export const savings = (s: Service) => s.regularPrice - s.offPeakPrice;

export const businesses: Business[] = [
  { id: "b1", name: "Fresh Cuts Barber", category: "haircut", area: "Palms", distanceMi: 0.8, rating: 4.8, photoHue: 24 },
  { id: "b2", name: "Sudsy Laundromat", category: "laundry", area: "Mar Vista", distanceMi: 1.2, rating: 4.6, photoHue: 210 },
  { id: "b3", name: "Crease & Care Cleaners", category: "care", area: "Culver City", distanceMi: 1.9, rating: 4.7, photoHue: 45 },
  { id: "b4", name: "The Corner Chair", category: "haircut", area: "Palms", distanceMi: 2.3, rating: 4.5, photoHue: 12 },
];

export const services: Service[] = [
  { id: "s1", businessId: "b1", name: "Haircut", regularPrice: 28, offPeakPrice: 12 },
  { id: "s2", businessId: "b2", name: "Wash & fold (per load)", regularPrice: 20, offPeakPrice: 9 },
  { id: "s3", businessId: "b3", name: "Shirt press (5 items)", regularPrice: 22, offPeakPrice: 11 },
  { id: "s4", businessId: "b4", name: "Haircut", regularPrice: 30, offPeakPrice: 14 },
];

export const slots: Slot[] = [
  { id: "sl1", serviceId: "s1", day: "Tue 24", time: "2:30 pm", taken: false },
  { id: "sl2", serviceId: "s1", day: "Tue 24", time: "3:00 pm", taken: true },
  { id: "sl3", serviceId: "s1", day: "Tue 24", time: "3:30 pm", taken: false },
  { id: "sl4", serviceId: "s1", day: "Wed 25", time: "11:00 am", taken: false },
];

export const user: User = { firstName: "Dana", phone: "(213) 555-0142", keptCount: 0, missCount: 0 };

// The canonical demo booking used across the P-flow screens.
export const demoBooking: Booking = {
  id: "bk1",
  businessId: "b1",
  serviceId: "s1",
  slotId: "sl1",
  code: "SPRT-7K3QZ9",
  status: "booked",
};

export const getBusiness = (id: string) => businesses.find((b) => b.id === id);
export const getService = (id: string) => services.find((s) => s.id === id);
export const getSlot = (id: string) => slots.find((s) => s.id === id);
