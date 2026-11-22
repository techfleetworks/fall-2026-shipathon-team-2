"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// Goes back ONE step (to whatever screen the person came from). If the page was
// opened directly (no in-app history), goes to `fallback` instead.
export function goBack(router: ReturnType<typeof useRouter>, fallback: string) {
  if (window.history.length > 1) router.back();
  else router.push(fallback);
}

export function BackButton({
  fallback,
  className,
  label = "Go back",
  children,
}: {
  fallback: string;
  className?: string;
  label?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <button type="button" aria-label={label} onClick={() => goBack(router, fallback)} className={className}>
      {children}
    </button>
  );
}
