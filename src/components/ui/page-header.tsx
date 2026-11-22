"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IconButton } from "./icon-button";

// Large-title header (Figma "Your booking", "Show at the counter"): back arrow +
// headline. Back always goes to this screen's logical parent (`backHref`), so the
// arrow is predictable no matter how you arrived.
export function PageHeader({ title, backHref }: { title: ReactNode; backHref: string }) {
  const router = useRouter();
  const goBack = () => router.push(backHref);
  return (
    <header className="flex items-center gap-2 px-2 pt-4 pb-2">
      <IconButton icon="chevron-left" label="Go back" onClick={goBack} />
      <h1 className="text-headline-sm text-text-heading">{title}</h1>
    </header>
  );
}
