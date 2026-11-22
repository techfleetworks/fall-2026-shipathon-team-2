"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import { toggleFavorite, useFavorites, useHydrated } from "@/lib/account";
import { markNav } from "@/lib/nav-motion";

// Heart that saves a place to the person's Favorites (on this device). 48px hit
// area; state is announced (aria-pressed) and shown by fill, not colour alone.
// Saving shows a short "Saved to Favorites · View" confirmation.
export function FavoriteHeart({
  businessId,
  businessName,
  variant = "overlay",
  className,
  onRemoved,
}: {
  businessId: string;
  businessName: string;
  /** "overlay" = white circle on photos; "plain" = bare icon on cards; "text" = labelled pill button. */
  variant?: "overlay" | "plain" | "text";
  className?: string;
  /** If set, removing calls this instead of showing the heart's own message
   * (the Favorites list shows "Removed · Undo" itself, since the row goes away). */
  onRemoved?: () => void;
}) {
  const hydrated = useHydrated();
  const favorites = useFavorites();
  const saved = hydrated && favorites.includes(businessId);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleFavorite(businessId);
    if (!nowSaved && onRemoved) {
      onRemoved();
      return;
    }
    setToast(nowSaved ? "Saved to Favorites" : "Removed from Favorites");
    startTimer();
  };

  // Stays 8 s, and pauses while hovered or focused so there's time to tap "View".
  const startTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 8000);
  };
  const pauseTimer = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  return (
    <>
      {variant === "text" ? (
        <button
          type="button"
          aria-pressed={saved}
          onClick={onClick}
          className={cn(
            "inline-flex min-h-[48px] items-center gap-2 rounded-full border px-4 text-label-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
            saved
              ? "border-action-primary bg-surface-subtle text-on-tint-primary"
              : "border-border-control text-text-primary hover:bg-surface-muted",
            className,
          )}
        >
          <Icon name={saved ? "heart-filled" : "heart"} size={18} className={saved ? "text-action-primary" : undefined} />
          {saved ? `${businessName} is in your favorites` : `Save ${businessName} to favorites`}
        </button>
      ) : (
        <button
          type="button"
          aria-pressed={saved}
          aria-label={`Save ${businessName} to favorites`}
          onClick={onClick}
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
            className,
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center rounded-full",
              variant === "overlay" ? "h-9 w-9 bg-surface-default/90 shadow-e1" : "h-10 w-10 hover:bg-surface-muted",
              saved ? "text-action-primary" : "text-text-secondary",
            )}
          >
            <Icon name={saved ? "heart-filled" : "heart"} size={20} />
          </span>
        </button>
      )}

      {toast && (
        <div
          role="status"
          onMouseEnter={pauseTimer}
          onMouseLeave={startTimer}
          onFocus={pauseTimer}
          onBlur={startTimer}
          className="fixed inset-x-0 bottom-24 z-30 mx-auto flex w-[calc(100%-32px)] max-w-[398px] items-center justify-between gap-3 rounded-lg bg-text-primary px-4 py-2 text-body-md text-surface-default shadow-e3"
        >
          <span className="flex items-center gap-2">
            <Icon name={toast.startsWith("Saved") ? "heart-filled" : "heart"} size={18} />
            {toast}
          </span>
          {toast.startsWith("Saved") && (
            <Link
              href="/favorites"
              onNavigate={markNav("tab")}
              className="inline-flex min-h-[48px] items-center rounded-full px-3 text-label-lg text-accent-surface underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-surface"
            >
              View
            </Link>
          )}
        </div>
      )}
    </>
  );
}
