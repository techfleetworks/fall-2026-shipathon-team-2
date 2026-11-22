"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { go } from "@/lib/nav-motion";

// Goes back ONE step (to whatever screen the person came from). If the page was
// opened directly (no in-app history), goes to `fallback` instead.
export function goBack(router: ReturnType<typeof useRouter>, fallback: string) {
  if (window.history.length > 1) router.back();
  else go(router, fallback, "back");
}

export function BackButton({
  fallback,
  className,
  label = "Go back",
  exact = false,
  children,
}: {
  fallback: string;
  className?: string;
  label?: string;
  /** Always go to `fallback` (this screen's logical parent), not browser history.
   * Use on core-flow screens with a single parent; leave off for leaf pages
   * (Terms, Privacy) reached from several places, where browser-back is better. */
  exact?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const onClick = () => (exact ? go(router, fallback, "back") : goBack(router, fallback));
  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
