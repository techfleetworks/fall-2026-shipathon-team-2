import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Category tag + generic status pill. Category colours come from the design system
// (haircut / laundry / care), each paired with its soft surface. Status is paired
// with a label so meaning never rests on colour alone.
type Category = "haircut" | "laundry" | "care";

const categoryCls: Record<Category, string> = {
  haircut: "bg-category-haircut-surface text-category-haircut",
  laundry: "bg-category-laundry-surface text-category-laundry",
  care: "bg-category-care-surface text-category-care",
};

export function CategoryBadge({ category, children }: { category: Category; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-label-sm", categoryCls[category])}>
      {children}
    </span>
  );
}

type Tone = "positive" | "danger" | "neutral";
const toneCls: Record<Tone, string> = {
  positive: "bg-status-positive-surface text-on-tint-positive",
  danger: "bg-danger-surface text-on-tint-danger",
  neutral: "bg-surface-muted text-text-secondary",
};

export function StatusBadge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-label-sm", toneCls[tone])}>
      {children}
    </span>
  );
}

// Discount / savings pill — "Save $16". Uses the accent (rose) role.
export function SavePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-panel-subtle px-2.5 py-1 text-label-md text-on-tint-accent">
      {children}
    </span>
  );
}
