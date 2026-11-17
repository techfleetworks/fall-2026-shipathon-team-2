import type { Metadata } from "next";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
      <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
        Tap the heart on a bag to save it here.
      </p>
    </div>
  );
}
