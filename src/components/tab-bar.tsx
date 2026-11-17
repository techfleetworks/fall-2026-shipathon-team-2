"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string; icon: React.ReactNode };

function Icon({ path }: { path: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}

const TABS: Tab[] = [
  { href: "/deals", label: "Deals", icon: <Icon path="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8ZM7.5 7.5h.01" /> },
  { href: "/my-pickups", label: "My pickups", icon: <Icon path="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0" /> },
  { href: "/favorites", label: "Favorites", icon: <Icon path="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" /> },
  { href: "/account", label: "Account", icon: <Icon path="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /> },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-10 flex items-stretch border-t border-border bg-surface/95 backdrop-blur">
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 px-1 pb-2 pt-2 text-xs font-medium transition-colors ${
              active ? "text-primary" : "text-muted hover:text-foreground"
            }`}
          >
            <span
              className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                active ? "bg-primary-soft" : "bg-transparent"
              }`}
            >
              {tab.icon}
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
