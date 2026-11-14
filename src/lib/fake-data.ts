// Demo data for the frontend (task F3).
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
  title: string;
  description: string;
  photo_url: string; // empty in the demo; the UI shows an emoji instead
  category: Category;
  dietary_tags: string[];
  price_cents: number; // 0 = free
  original_price_cents: number;
  quantity_left: number; // 0 = sold out
  best_by: string; // ISO date (YYYY-MM-DD)
  pickup_start: string; // ISO datetime
  pickup_end: string; // ISO datetime
  emoji: string; // DEMO ONLY — not in the data contract / not in Supabase
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
  { id: "s1", name: "Palms Corner Market", address: "3420 Motor Ave, Los Angeles, CA 90034", distance_mi: 0.4 },
  { id: "s2", name: "Rose Ave Bakery", address: "220 Rose Ave, Los Angeles, CA 90291", distance_mi: 0.8 },
  { id: "s3", name: "Overland Pantry", address: "3715 Overland Ave, Los Angeles, CA 90034", distance_mi: 1.1 },
];

export const listings: Listing[] = [
  { id: "l1", store_id: "s1", title: "Mixed vegetable box", description: "Carrots, greens, peppers and more — great for a few dinners.", photo_url: "", category: "produce", dietary_tags: ["vegetarian", "vegan"], price_cents: 0, original_price_cents: 1200, quantity_left: 4, best_by: dateOnly(2), pickup_start: at(0, 17, 30), pickup_end: at(0, 19, 0), emoji: "🥦" },
  { id: "l2", store_id: "s2", title: "Day-old sourdough loaf", description: "Baked yesterday, still great toasted.", photo_url: "", category: "bakery", dietary_tags: ["vegetarian"], price_cents: 150, original_price_cents: 600, quantity_left: 6, best_by: dateOnly(1), pickup_start: at(0, 16, 0), pickup_end: at(0, 19, 0), emoji: "🍞" },
  { id: "l3", store_id: "s1", title: "Gallon of milk", description: "Whole milk, sealed.", photo_url: "", category: "dairy", dietary_tags: [], price_cents: 200, original_price_cents: 450, quantity_left: 3, best_by: dateOnly(3), pickup_start: at(0, 12, 0), pickup_end: at(0, 14, 0), emoji: "🥛" },
  { id: "l4", store_id: "s1", title: "Bananas (bunch)", description: "Ripe and ready to eat.", photo_url: "", category: "produce", dietary_tags: ["vegan", "vegetarian"], price_cents: 0, original_price_cents: 300, quantity_left: 8, best_by: dateOnly(2), pickup_start: at(1, 9, 0), pickup_end: at(1, 11, 0), emoji: "🍌" },
  { id: "l5", store_id: "s3", title: "Pasta & sauce bundle", description: "Dry pasta plus a jar of marinara.", photo_url: "", category: "pantry", dietary_tags: ["vegetarian"], price_cents: 100, original_price_cents: 500, quantity_left: 5, best_by: dateOnly(30), pickup_start: at(0, 15, 0), pickup_end: at(0, 18, 0), emoji: "🍝" },
  { id: "l6", store_id: "s1", title: "Dozen eggs", description: "Grade A large.", photo_url: "", category: "dairy", dietary_tags: ["vegetarian", "gluten_free"], price_cents: 0, original_price_cents: 500, quantity_left: 2, best_by: dateOnly(7), pickup_start: at(1, 10, 0), pickup_end: at(1, 12, 0), emoji: "🥚" },
  { id: "l7", store_id: "s2", title: "Assorted pastries (4)", description: "A mix of croissants and muffins.", photo_url: "", category: "bakery", dietary_tags: ["vegetarian"], price_cents: 250, original_price_cents: 900, quantity_left: 4, best_by: dateOnly(1), pickup_start: at(0, 16, 0), pickup_end: at(0, 18, 30), emoji: "🥐" },
  { id: "l8", store_id: "s3", title: "Canned soup (3-pack)", description: "Assorted vegetable soups.", photo_url: "", category: "pantry", dietary_tags: ["vegan", "gluten_free"], price_cents: 0, original_price_cents: 600, quantity_left: 6, best_by: dateOnly(60), pickup_start: at(1, 13, 0), pickup_end: at(1, 16, 0), emoji: "🥫" },
  // Only 1 left — used to demo the "sold out while you were deciding" message on reserve
  { id: "l11", store_id: "s2", title: "Fresh bagels (6)", description: "Baked this morning — the last bag.", photo_url: "", category: "bakery", dietary_tags: ["vegetarian"], price_cents: 200, original_price_cents: 700, quantity_left: 1, best_by: dateOnly(1), pickup_start: at(0, 16, 0), pickup_end: at(0, 18, 0), emoji: "🥯" },
  // Sold out — should NOT appear in the feed (quantity_left = 0)
  { id: "l9", store_id: "s2", title: "Chocolate chip cookies", description: "Sold-out example.", photo_url: "", category: "bakery", dietary_tags: ["vegetarian"], price_cents: 200, original_price_cents: 500, quantity_left: 0, best_by: dateOnly(1), pickup_start: at(0, 16, 0), pickup_end: at(0, 18, 0), emoji: "🍪" },
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
