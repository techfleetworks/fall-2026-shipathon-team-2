"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";

// Bottom navigation: the four top-level destinations. Visible on top-level screens,
// hidden inside flows. Active item is marked by a pill + bolder label (not colour
// alone). Icon + label on every item.
export type NavKey = "deals" | "bookings" | "favorites" | "account";

const DESTS: { key: NavKey; label: string; icon: IconName; href: string }[] = [
  { key: "deals", label: "Deals", icon: "tag", href: "/deals" },
  { key: "bookings", label: "My bookings", icon: "ticket", href: "/bookings" },
  { key: "favorites", label: "Favorites", icon: "heart", href: "/favorites" },
  { key: "account", label: "Account", icon: "user", href: "/account" },
];

export function NavBar({ active, hide }: { active: NavKey; hide?: NavKey[] }) {
  const items = DESTS.filter((d) => !hide?.includes(d.key));
  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-10 flex items-stretch justify-around gap-1 border-t border-border-default bg-surface-default px-2 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))]"
    >
      {items.map((d) => {
        const current = d.key === active;
        return (
          <Link
            key={d.key}
            href={d.href}
            aria-current={current ? "page" : undefined}
            className={cn(
              "flex min-h-[48px] min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-full px-3 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
              current ? "bg-surface-subtle text-action-primary" : "text-text-secondary hover:bg-surface-muted",
            )}
          >
            <Icon name={current && d.key === "favorites" ? "heart-filled" : d.icon} size={22} />
            <span className={cn("text-label-sm", current && "font-bold")}>{d.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
