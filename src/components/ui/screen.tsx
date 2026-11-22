"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";
import { usePageEnter } from "./page-motion";

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
  // Only the content moves on navigation; the top bar and bottom bar stay put.
  const ref = usePageEnter<HTMLElement>();
  return <main ref={ref} className={cn("flex-1 overflow-y-auto px-5 py-4", className)}>{children}</main>;
}

// Sticky bottom bar for the single primary action (Figma rule: one filled button
// per screen, full width, above the bottom inset).
// True while someone is typing in a text box on a touch phone (the on-screen
// keyboard is up). The bottom action bar steps aside then, so it doesn't ride up
// on top of the keyboard and cover the form; it comes back when they're done.
function useTypingOnPhone() {
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    const isTextBox = (el: Element | null) =>
      el instanceof HTMLTextAreaElement ||
      (el instanceof HTMLInputElement && !["checkbox", "radio", "range", "button", "submit"].includes(el.type));
    const update = () => setTyping(isTextBox(document.activeElement));
    // On focusout, wait a tick: focus may be moving to another text box.
    const onOut = () => setTimeout(update, 0);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", onOut);
    };
  }, []);
  return typing;
}

export function BottomActionBar({ children, className }: { children: ReactNode; className?: string }) {
  const typing = useTypingOnPhone();
  return (
    <div
      className={cn(
        typing && "hidden",
        "sticky bottom-0 z-10 border-t border-border-default bg-surface-default px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
