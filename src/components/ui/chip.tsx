"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

// Filter / choice chip. 40px visual, 48px hit area. Selected = white fill with a
// 2px action outline AND a check icon (never colour alone). Use in a scrolling row.
export interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  /** role within an ARIA group; "tab" for category tabs, default a toggle button */
  as?: "button" | "tab";
}

export function Chip({ children, selected, onClick, as = "button" }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      role={as === "tab" ? "tab" : undefined}
      aria-selected={as === "tab" ? !!selected : undefined}
      aria-pressed={as === "button" ? !!selected : undefined}
      className={cn(
        "inline-flex min-h-[48px] shrink-0 items-center gap-1.5 rounded-full px-4 text-label-lg transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
        selected
          ? "bg-surface-default text-action-primary ring-2 ring-action-primary ring-inset"
          : "bg-surface-muted text-text-primary hover:bg-surface-subtle",
      )}
    >
      {selected && <Icon name="check" size={18} />}
      {children}
    </button>
  );
}
