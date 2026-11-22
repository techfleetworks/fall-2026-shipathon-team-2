"use client";

import { cn } from "@/lib/cn";

// Toggle switch. Takes effect immediately (no Save). Controlled.
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
        checked ? "bg-action-primary" : "bg-border-control",
      )}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 rounded-full bg-surface-default shadow-e1 transition-transform",
          checked ? "translate-x-7" : "translate-x-1",
        )}
      />
    </button>
  );
}
