// Mock data for the Sparetime happy-path prototype. Mirrors the Figma demo exactly:
// the same fictional businesses, services, prices and photos shown on the screens.
// Photos are the AI-generated demo images exported from Figma (public/figma/*).
// Replace with Supabase queries when wiring the real backend.

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
  address: string;
  area: string;
  distanceMi: number;
  rating: number;
  photo: string;
  logo?: string;
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
  day: string;
  time: string;
  taken: boolean;
}

export type BookingStatus = "booked" | "today" | "kept" | "missed" | "cancelled";

export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  slotId: string;
  code: string;
  status: BookingStatus;
}

export interface User {
  firstName: string;
  phone: string;
  keptCount: number;
  missCount: number;
}

export function bookingLimit(user: Pick<User, "keptCount" | "missCount">): number | "unlimited" {
  if (user.missCount >= 2) return 1;
  if (user.keptCount >= 4) return "unlimited";
  if (user.keptCount >= 2) return 2;
  return 1;
}

export const savings = (s: Service) => s.regularPrice - s.offPeakPrice;

export const businesses: Business[] = [
  { id: "b1", name: "Fresh Cuts Barbershop", category: "haircut", address: "1420 W 7th St, Westlake", area: "Westlake", distanceMi: 0.6, rating: 4.8, photo: "/figma/fresh-cuts.png", logo: "/figma/fresh-cuts-logo.svg" },
  { id: "b2", name: "Studio 7 Salon", category: "haircut", address: "815 S Hill St, Downtown LA", area: "Downtown LA", distanceMi: 0.9, rating: 4.6, photo: "/figma/studio-7.png" },
  { id: "b3", name: "Main St Barbers", category: "haircut", address: "2047 S Main St, South Park", area: "South Park", distanceMi: 1.2, rating: 4.7, photo: "/figma/main-st.png" },
  { id: "b4", name: "Spin City Laundry", category: "laundry", address: "535 Alvarado St, Westlake", area: "Westlake", distanceMi: 0.6, rating: 4.5, photo: "/figma/spin-city.png" },
  { id: "b5", name: "Prime Press", category: "care", address: "312 E 2nd St, Little Tokyo", area: "Little Tokyo", distanceMi: 1.1, rating: 4.7, photo: "/figma/prime-press.png" },
];

export const services: Service[] = [
  { id: "s1", businessId: "b1", name: "Haircut", regularPrice: 28, offPeakPrice: 12 },
  { id: "s2", businessId: "b2", name: "Wash, cut and style", regularPrice: 40, offPeakPrice: 18 },
  { id: "s3", businessId: "b3", name: "Classic cut", regularPrice: 22, offPeakPrice: 10 },
  { id: "s4", businessId: "b4", name: "Wash and fold, 15 lb", regularPrice: 15, offPeakPrice: 6 },
  { id: "s5", businessId: "b5", name: "Shirt press (5 items)", regularPrice: 30, offPeakPrice: 9 },
];

export const slots: Slot[] = [
  { id: "sl1", serviceId: "s1", day: "Tue 24", time: "2:00 pm", taken: false },
  { id: "sl2", serviceId: "s1", day: "Tue 24", time: "2:30 pm", taken: false },
  { id: "sl3", serviceId: "s1", day: "Tue 24", time: "3:00 pm", taken: true },
  { id: "sl4", serviceId: "s1", day: "Tue 24", time: "3:30 pm", taken: true },
];

export const user: User = { firstName: "Dana", phone: "(213) 555-0142", keptCount: 0, missCount: 0 };

export const demoBooking: Booking = {
  id: "bk1",
  businessId: "b1",
  serviceId: "s1",
  slotId: "sl2",
  code: "SPRT-7K3QZ9",
  status: "booked",
};

export const getBusiness = (id: string) => businesses.find((b) => b.id === id);
export const getService = (id: string) => services.find((s) => s.id === id);
export const getSlot = (id: string) => slots.find((s) => s.id === id);
