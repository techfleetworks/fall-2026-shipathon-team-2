"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";

// Mobile app shell. Designed at 390px; works down to 375 and centers as a column
// on wider viewports (canvas behind). Compose: <Screen><AppBar/><ScreenBody/>
// <BottomActionBar/> or <NavBar/></Screen>.
export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-dvh w-full bg-bg-canvas">
      <div className={cn("relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-surface-default", className)}>
        {children}
      </div>
    </div>
  );
}

// Top app bar. Optional back button + title + trailing actions.
export function AppBar({
  title,
  onBack,
  trailing,
  tinted,
}: {
  title?: ReactNode;
  onBack?: () => void;
  trailing?: ReactNode;
  tinted?: boolean;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex min-h-[56px] items-center gap-1 px-2",
        tinted ? "bg-surface-subtle" : "bg-surface-default",
      )}
    >
      {onBack ? (
        <IconButton icon="chevron-left" label="Go back" onClick={onBack} />
      ) : (
        <span className="w-2" />
      )}
      {title ? <h1 className="flex-1 truncate px-1 text-title-md text-text-heading">{title}</h1> : <span className="flex-1" />}
      <div className="flex items-center">{trailing}</div>
    </header>
  );
}

// Scrollable content region between the app bar and the bottom bar.
export function ScreenBody({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("flex-1 overflow-y-auto px-5 py-4", className)}>{children}</main>;
}

// Sticky bottom bar for the single primary action (Figma rule: one filled button
// per screen, full width, above the bottom inset).
export function BottomActionBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 border-t border-border-default bg-surface-default px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
