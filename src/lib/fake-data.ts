// Demo data for the frontend. "Surprise bag" model to match the Figma flows:
// each listing is a discounted (or free) bag from a local store.
// Field names match docs/data-contract.md so swapping to Supabase later is clean.
// Real data will come from Sofia's backend; nothing here is permanent.

export type Store = {
  id: string;
  name: string;
  address: string;
  distance_mi: number; // DEMO ONLY — not in the data contract
};

export type Category = "produce" | "bakery" | "dairy" | "pantry";

export type Listing = {
  id: string;
  store_id: string;
  title: string; // the bag name, e.g. "Bread + produce bag"
  description: string;
  includes: string[]; // DEMO — what's in the bag, shown on the listing
  photo_url: string; // empty in the demo; UI shows an image placeholder / emoji
  emoji: string; // DEMO ONLY — placeholder visual until real photos
  image_key?: string; // DEMO — fruit image filename in /public/bags (optional)
  category: Category;
  dietary_tags: string[];
  price_cents: number; // 0 = free (verified users only)
  original_price_cents: number;
  quantity_left: number; // 0 = sold out
  near_metro: boolean; // DEMO — "Near Metro" chip
  best_by: string; // ISO date (YYYY-MM-DD)
  best_by_label: string; // DEMO display, e.g. "tomorrow" (clock-free for Cache Components)
  pickup_label: string; // DEMO display, e.g. "3–5 pm today"
  pickup_start: string; // ISO datetime
  pickup_end: string; // ISO datetime
};

// --- helpers so demo dates stay relative to "now" (nothing looks expired) ---
function at(daysFromNow: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}
function dateOnly(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

export const stores: Store[] = [
  { id: "s1", name: "Sunrise Bakery", address: "220 Rose Ave, Los Angeles, CA 90291", distance_mi: 0.6 },
  { id: "s2", name: "Vida Market", address: "3420 Motor Ave, Los Angeles, CA 90034", distance_mi: 1.1 },
  { id: "s3", name: "Corner Fresh", address: "3715 Overland Ave, Los Angeles, CA 90034", distance_mi: 1.8 },
  { id: "s4", name: "Palms Pantry", address: "3600 Palms Blvd, Los Angeles, CA 90034", distance_mi: 0.9 },
];

export const listings: Listing[] = [
  {
    id: "b1", store_id: "s1",
    title: "Bread + produce bag",
    description: "A mixed bag of day-fresh bakery and produce.",
    includes: ["2 loaves", "seasonal fruit", "greens"],
    photo_url: "", emoji: "🥖",
    category: "bakery", dietary_tags: ["vegetarian"],
    price_cents: 600, original_price_cents: 1500, quantity_left: 3,
    near_metro: true, best_by: dateOnly(1), best_by_label: "tomorrow",
    pickup_label: "3–5 pm today", pickup_start: at(0, 15), pickup_end: at(0, 17),
  },
  {
    id: "b2", store_id: "s2",
    title: "Dairy + eggs bundle",
    description: "Fridge staples close to their best-by date.",
    includes: ["1 gal milk", "dozen eggs", "yogurt"],
    photo_url: "", emoji: "🥛",
    category: "dairy", dietary_tags: ["vegetarian"],
    price_cents: 500, original_price_cents: 1100, quantity_left: 5,
    near_metro: true, best_by: dateOnly(3), best_by_label: "in 3 days",
    pickup_label: "4–6 pm today", pickup_start: at(0, 16), pickup_end: at(0, 18),
  },
  {
    id: "b3", store_id: "s3",
    title: "Produce surprise bag",
    description: "Whatever's ripe and ready — great value.",
    includes: ["mixed vegetables", "bananas", "apples"],
    photo_url: "", emoji: "🥦",
    category: "produce", dietary_tags: ["vegan", "vegetarian"],
    price_cents: 400, original_price_cents: 900, quantity_left: 4,
    near_metro: false, best_by: dateOnly(2), best_by_label: "in 2 days",
    pickup_label: "5–7 pm today", pickup_start: at(0, 17), pickup_end: at(0, 19),
  },
  {
    id: "b4", store_id: "s4",
    title: "Pantry staples bag",
    description: "Shelf-stable basics to stretch the week.",
    includes: ["pasta", "canned soup", "rice"],
    photo_url: "", emoji: "🥫",
    category: "pantry", dietary_tags: ["vegan", "vegetarian"],
    price_cents: 0, original_price_cents: 1200, quantity_left: 6,
    near_metro: true, best_by: dateOnly(30), best_by_label: "in 30 days",
    pickup_label: "1–4 pm today", pickup_start: at(0, 13), pickup_end: at(0, 16),
  },
  {
    id: "b5", store_id: "s1",
    title: "Pastry box",
    description: "The last box of the day — croissants and more.",
    includes: ["4 pastries", "1 loaf"],
    photo_url: "", emoji: "🥐",
    category: "bakery", dietary_tags: ["vegetarian"],
    price_cents: 300, original_price_cents: 1000, quantity_left: 1,
    near_metro: true, best_by: dateOnly(1), best_by_label: "tomorrow",
    pickup_label: "4–6 pm today", pickup_start: at(0, 16), pickup_end: at(0, 18),
  },
  {
    id: "b6", store_id: "s3",
    title: "Veggie + fruit bag",
    description: "A free bag of produce for verified members.",
    includes: ["seasonal vegetables", "fruit"],
    photo_url: "", emoji: "🍎",
    category: "produce", dietary_tags: ["vegan", "vegetarian", "gluten_free"],
    price_cents: 0, original_price_cents: 1000, quantity_left: 2,
    near_metro: false, best_by: dateOnly(2), best_by_label: "in 2 days",
    pickup_label: "10 am–12 pm tomorrow", pickup_start: at(1, 10), pickup_end: at(1, 12),
  },
  // Sold out — should NOT appear in the feed (quantity_left = 0)
  {
    id: "b7", store_id: "s2",
    title: "Deli lunch bag",
    description: "Sold-out example.",
    includes: ["sandwich", "side", "drink"],
    photo_url: "", emoji: "🥪",
    category: "pantry", dietary_tags: [],
    price_cents: 500, original_price_cents: 1100, quantity_left: 0,
    near_metro: true, best_by: dateOnly(1), best_by_label: "tomorrow",
    pickup_label: "12–2 pm today", pickup_start: at(0, 12), pickup_end: at(0, 14),
  },
];

export function getStore(storeId: string): Store | undefined {
  return stores.find((s) => s.id === storeId);
}

export function getListing(listingId: string): Listing | undefined {
  return listings.find((l) => l.id === listingId);
}

// Sold-out items are hidden here. Hiding EXPIRED items is the backend's job
// (the data contract says expired listings aren't returned), so we don't read
// the current clock during render.
export function isAvailable(listing: Listing): boolean {
  return listing.quantity_left > 0;
}

// Savings in whole dollars, e.g. 9 for a $6 bag that was $15.
export function saveDollars(listing: Listing): number {
  return Math.round((listing.original_price_cents - listing.price_cents) / 100);
}

// Discount percent, e.g. 60 for $6 from $15.
export function discountPct(listing: Listing): number {
  if (listing.original_price_cents === 0) return 0;
  return Math.round((1 - listing.price_cents / listing.original_price_cents) * 100);
}
