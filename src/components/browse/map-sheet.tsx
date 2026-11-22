"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// Slide-up panel over the map (like Maps apps): the map stays still behind it,
// and the panel rests at one of three heights — low (mostly map), half, or high
// (mostly list). Drag the handle to move it, or tap the handle to step through
// the heights (so it never depends on dragging alone). The list scrolls inside.
const LOW_PX = 120; // handle + "N offers nearby" peeking out

export function MapSheet({ title, children }: { title: ReactNode; children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState(0); // height of the map area we sit in
  const [stop, setStop] = useState<0 | 1 | 2>(1); // low, half, high
  const [drag, setDrag] = useState<{ startY: number; startH: number; h: number } | null>(null);

  // Track the available height (changes with rotation / browser bars).
  useEffect(() => {
    const el = wrapRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setArea(el.clientHeight));
    ro.observe(el);
    setArea(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const stops = [LOW_PX, Math.round(area * 0.5), Math.max(LOW_PX, area - 24)];
  const height = drag ? drag.h : stops[stop];

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ startY: e.clientY, startH: height, h: height });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const h = Math.min(stops[2], Math.max(LOW_PX, drag.startH + (drag.startY - e.clientY)));
    setDrag({ ...drag, h });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag) return;
    const moved = Math.abs(e.clientY - drag.startY);
    if (moved < 6) {
      // A tap: step up, and from the top go back down to low.
      setStop((s) => (s === 2 ? 0 : ((s + 1) as 1 | 2)));
    } else {
      // A drag: settle on the nearest height.
      let best: 0 | 1 | 2 = 0;
      stops.forEach((s, i) => {
        if (Math.abs(s - drag.h) < Math.abs(stops[best] - drag.h)) best = i as 0 | 1 | 2;
      });
      setStop(best);
    }
    setDrag(null);
  };

  const label = stop === 2 ? "Show less of the list" : "Show more of the list";

  return (
    <div
      ref={wrapRef}
      style={{ height: area ? height : "50%" }}
      className={cn(
        "absolute inset-x-0 bottom-0 z-10 flex flex-col rounded-t-xl bg-surface-default shadow-e3",
        !drag && "transition-[height] duration-300 ease-out motion-reduce:transition-none",
      )}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={stop === 2}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setDrag(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") setStop((s) => (s < 2 ? ((s + 1) as 1 | 2) : s));
          if (e.key === "ArrowDown") setStop((s) => (s > 0 ? ((s - 1) as 0 | 1) : s));
        }}
        onClick={(e) => {
          // Keyboard Enter/Space (pointer taps are handled in onPointerUp).
          if (e.detail === 0) setStop((s) => (s === 2 ? 0 : ((s + 1) as 1 | 2)));
        }}
        className="flex w-full shrink-0 cursor-grab touch-none flex-col items-center rounded-t-xl pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring active:cursor-grabbing"
      >
        <span aria-hidden="true" className="h-1 w-8 rounded-full bg-border-control" />
        <span className="flex min-h-[48px] w-full items-center px-5 text-left text-title-md text-text-heading">{title}</span>
      </button>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
