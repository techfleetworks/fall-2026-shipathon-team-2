"use client";

// Lightweight shared client store for the demo: reservations + favorite stores,
// persisted to localStorage. Real data comes from Supabase later (J-tasks).

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { listings, getListing, saveDollars } from "@/lib/fake-data";

export type Reservation = {
  id: string;
  listingId: string;
  qty: number;
  code: string;
  arrivalLabel: string;
  status: "upcoming" | "picked_up";
};

type Store = {
  reservations: Reservation[];
  favorites: string[]; // store ids
  addReservation: (r: Omit<Reservation, "id" | "status">) => string;
  markPickedUp: (id: string) => void;
  isFavorite: (storeId: string) => boolean;
  toggleFavorite: (storeId: string) => void;
  savedThisMonth: number;
  pickupCount: number;
};

// Seed so the tabs look lived-in on first visit (matches the Figma mockups).
const SEED_FAVORITES = ["s1", "s2"];
const SEED_RESERVATIONS: Reservation[] = [
  { id: "r1", listingId: "b1", qty: 1, code: "PLNTY-4821", arrivalLabel: "3:30 pm", status: "upcoming" },
  { id: "r0", listingId: "b2", qty: 1, code: "PLNTY-7781", arrivalLabel: "4:00 pm", status: "picked_up" },
];

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(SEED_RESERVATIONS);
  const [favorites, setFavorites] = useState<string[]>(SEED_FAVORITES);

  // Load persisted state after mount (keeps server/client first render identical).
  useEffect(() => {
    try {
      const r = localStorage.getItem("plenty.reservations");
      const f = localStorage.getItem("plenty.favorites");
      // Hydration-safe load: first render matches the server seed, then we sync
      // from storage. Intentional one-time setState in effect.
      /* eslint-disable react-hooks/set-state-in-effect */
      if (r) setReservations(JSON.parse(r));
      if (f) setFavorites(JSON.parse(f));
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      /* ignore unavailable storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("plenty.reservations", JSON.stringify(reservations));
    } catch {}
  }, [reservations]);
  useEffect(() => {
    try {
      localStorage.setItem("plenty.favorites", JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const value = useMemo<Store>(() => {
    const pickedUp = reservations.filter((r) => r.status === "picked_up");
    const savedThisMonth = pickedUp.reduce((sum, r) => {
      const l = getListing(r.listingId);
      return sum + (l ? saveDollars(l) * r.qty : 0);
    }, 0);
    return {
      reservations,
      favorites,
      addReservation: (r) => {
        const id = `r${Date.now()}`;
        setReservations((cur) => [{ ...r, id, status: "upcoming" }, ...cur]);
        return id;
      },
      markPickedUp: (id) =>
        setReservations((cur) =>
          cur.map((r) => (r.id === id ? { ...r, status: "picked_up" } : r)),
        ),
      isFavorite: (storeId) => favorites.includes(storeId),
      toggleFavorite: (storeId) =>
        setFavorites((cur) =>
          cur.includes(storeId) ? cur.filter((s) => s !== storeId) : [...cur, storeId],
        ),
      savedThisMonth,
      pickupCount: pickedUp.length,
    };
  }, [reservations, favorites]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}

// Current best (available) listing for a store, for the Favorites tab.
export function bestListingForStore(storeId: string) {
  return listings.find((l) => l.store_id === storeId && l.quantity_left > 0);
}
