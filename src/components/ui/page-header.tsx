"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "./icon-button";
import { go } from "@/lib/nav-motion";

// Large-title header (Figma "Your booking", "Show at the counter"): back arrow +
// headline. Back always goes to this screen's logical parent (`backHref`), so the
// arrow is predictable no matter how you arrived. A screen reachable from two
// places can be opened with `?from=/path` (an in-app path) to return there.
// Only same-site paths are allowed: resolve it the way the browser would and
// check the origin, so tricks like "/\evil.com" can't send people off-site.
function backTarget(fallback: string) {
  const from = new URLSearchParams(window.location.search).get("from");
  if (!from) return fallback;
  try {
    const url = new URL(from, window.location.origin);
    return url.origin === window.location.origin ? url.pathname + url.search : fallback;
  } catch {
    return fallback;
  }
}

export function PageHeader({ title, backHref }: { title: ReactNode; backHref: string }) {
  const router = useRouter();
  const goBack = () => go(router, backTarget(backHref), "back");
  return (
    <header className="flex items-center gap-2 px-2 pt-4 pb-2">
      <IconButton icon="chevron-left" label="Go back" onClick={goBack} />
      <h1 className="text-headline-sm text-text-heading">{title}</h1>
    </header>
  );
}
