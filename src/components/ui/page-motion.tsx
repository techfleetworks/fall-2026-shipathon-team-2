"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { currentNav } from "@/lib/nav-motion";

// Plays the entrance animation for the navigation that brought us here (see
// src/lib/nav-motion.ts). Runs before paint, so there's no flash. Plain CSS, so
// it works on older phones too; Reduce Motion turns it off (globals.css).
export function usePageEnter<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const dir = currentNav();
    const el = ref.current;
    if (!dir || !el) return;
    const cls = `page-enter-${dir}`;
    // Restart cleanly even if the class is still there from a previous visit.
    el.classList.remove("page-enter-forward", "page-enter-back", "page-enter-tab");
    void el.offsetWidth;
    el.classList.add(cls);
    // Remove the class when done. The timer backs up animationend, which
    // doesn't always fire (e.g. a background tab).
    const done = () => el.classList.remove(cls);
    el.addEventListener("animationend", done, { once: true });
    const timer = window.setTimeout(done, 600);
    return () => {
      el.removeEventListener("animationend", done);
      window.clearTimeout(timer);
      el.classList.remove(cls);
    };
  }, []);
  return ref;
}

export function PageMotion({ className, children }: { className?: string; children: ReactNode }) {
  const ref = usePageEnter<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
