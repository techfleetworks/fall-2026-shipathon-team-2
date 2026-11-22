import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Tonal panel for rules/notes (Figma info boxes on Offer, Confirm, etc.).
export function InfoBox({ children, tone = "muted", className }: { children: ReactNode; tone?: "muted" | "subtle"; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg px-4 py-3 text-body-md leading-relaxed",
        tone === "muted" ? "bg-surface-muted text-text-secondary" : "bg-surface-subtle text-on-tint-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}
