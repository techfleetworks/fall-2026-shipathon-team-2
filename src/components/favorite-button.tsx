"use client";

import { useAppStore } from "@/lib/store";

// Favorite toggle, backed by the shared store (favorites are by store).
export default function FavoriteButton({
  storeId,
  size = 36,
}: {
  storeId: string;
  size?: number;
}) {
  const { isFavorite, toggleFavorite } = useAppStore();
  const on = isFavorite(storeId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(storeId);
      }}
      aria-pressed={on}
      aria-label={on ? "Remove from favorites" : "Save to favorites"}
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-primary"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={on ? "var(--savings)" : "none"}
        stroke={on ? "var(--savings)" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
