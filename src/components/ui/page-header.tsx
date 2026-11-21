"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "./icon-button";

// Large-title header (Figma "Your booking", "Show at the counter"): back arrow +
// headline. Back returns to the previous screen, or `backHref` when opened directly.
export function PageHeader({ title, backHref }: { title: ReactNode; backHref: string }) {
  const router = useRouter();
  const goBack = () => (window.history.length > 1 ? router.back() : router.push(backHref));
  return (
    <header className="flex items-center gap-2 px-2 pt-4 pb-2">
      <IconButton icon="chevron-left" label="Go back" onClick={goBack} />
      <h1 className="text-headline-sm text-text-heading">{title}</h1>
    </header>
  );
}
