"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// Slide-up panel over the map (like Maps apps). The map stays still behind it,
// and the panel rests at one of three stops: low (mostly map), half, or high
// (mostly list).
// - Below the top stop, swiping anywhere on the panel moves the panel; the list
//   doesn't scroll. Once the panel is all the way up, the list scrolls.
// - A quick flick goes to the next stop; a slow drag settles on the nearest.
// - Tapping the top of the panel goes all the way up (or all the way down if
//   it's already up), so dragging is never required. Arrow keys step one stop.
// Moves with transform (GPU), not height, so it tracks the finger smoothly.
const LOW_PX = 120; // handle + "N offers nearby" peeking out
const FLICK = 0.45; // px per ms
const SETTLE = "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1)";

type Stop = 0 | 1 | 2;

export function MapSheet({ title, children }: { title: ReactNode; children: ReactNode }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState(0); // height of the map area we sit in
  const [stop, setStop] = useState<Stop>(1);
  const [dragging, setDragging] = useState(false);

  // Gesture bookkeeping lives in a ref so finger moves don't re-render React.
  const g = useRef({ active: false, pending: false, fromHandle: false, id: -1, startY: 0, startOffset: 0, offset: 0, lastY: 0, lastT: 0, v: 0, moved: false });

  useEffect(() => {
    const el = sheetRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setArea(el.clientHeight));
    ro.observe(el);
    setArea(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const full = Math.max(LOW_PX, area - 24); // panel height = the high stop
  const visible = [LOW_PX, Math.round(area * 0.5), full];
  const offsetFor = (s: Stop) => full - visible[s]; // translateY for a stop

  const apply = (offset: number, animate: boolean) => {
    const el = sheetRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.style.transition = animate && !reduce ? SETTLE : "none";
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  };

  // Settle on the current stop whenever it (or the available space) changes.
  useLayoutEffect(() => {
    if (!area || g.current.active) return;
    apply(offsetFor(stop), true);
    if (stop !== 2 && listRef.current) listRef.current.scrollTop = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stop, area]);

  const begin = (e: React.PointerEvent, fromHandle: boolean) => {
    g.current.moved = false;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // On the list, only take over the gesture when the panel isn't fully up.
    if (!fromHandle && stop === 2) return;
    const s = g.current;
    Object.assign(s, { pending: true, active: false, fromHandle, id: e.pointerId, startY: e.clientY, startOffset: offsetFor(stop), offset: offsetFor(stop), lastY: e.clientY, lastT: e.timeStamp, v: 0, moved: false });
  };

  const move = (e: React.PointerEvent) => {
    const s = g.current;
    if ((!s.pending && !s.active) || e.pointerId !== s.id) return;
    const dy = e.clientY - s.startY;
    if (s.pending && Math.abs(dy) > 6) {
      s.pending = false;
      s.active = true;
      s.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    if (!s.active) return;
    const dt = Math.max(1, e.timeStamp - s.lastT);
    s.v = (e.clientY - s.lastY) / dt;
    s.lastY = e.clientY;
    s.lastT = e.timeStamp;
    // Follow the finger, with a little resistance past the top and bottom.
    let off = s.startOffset + dy;
    const max = offsetFor(0);
    if (off < 0) off = off / 3;
    if (off > max) off = max + (off - max) / 3;
    s.offset = off;
    apply(off, false);
  };

  const end = (e: React.PointerEvent) => {
    const s = g.current;
    if (e.pointerId !== s.id) return;
    if (s.active) {
      s.active = false;
      setDragging(false);
      let next: Stop;
      if (Math.abs(s.v) > FLICK) {
        // Flick: one stop in the direction of the swipe (down = smaller).
        const cur = ([0, 1, 2] as Stop[]).reduce((a, b) => (Math.abs(offsetFor(b) - s.startOffset) < Math.abs(offsetFor(a) - s.startOffset) ? b : a));
        next = (s.v > 0 ? Math.max(0, cur - 1) : Math.min(2, cur + 1)) as Stop;
      } else {
        next = ([0, 1, 2] as Stop[]).reduce((a, b) => (Math.abs(offsetFor(b) - s.offset) < Math.abs(offsetFor(a) - s.offset) ? b : a));
      }
      if (next === stop) apply(offsetFor(next), true);
      else setStop(next);
    } else if (s.pending && s.fromHandle && e.type === "pointerup") {
      // A tap on the top: all the way up, or all the way down if already up.
      setStop((x) => (x === 2 ? 0 : 2));
    }
    s.pending = false;
  };

  const cancel = () => {
    const s = g.current;
    if (s.active) apply(offsetFor(stop), true);
    s.active = false;
    s.pending = false;
    setDragging(false);
  };

  const label = stop === 2 ? "Show less of the list" : "Show more of the list";

  return (
    <div
      ref={sheetRef}
      style={{ height: area ? full : "50%", transform: area ? undefined : "none" }}
      className={cn(
        "absolute inset-x-0 bottom-0 z-10 flex flex-col rounded-t-xl bg-surface-default shadow-e3 will-change-transform",
        dragging && "select-none",
      )}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={stop === 2}
        onPointerDown={(e) => begin(e, true)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={cancel}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") setStop((s) => (s < 2 ? ((s + 1) as Stop) : s));
          if (e.key === "ArrowDown") setStop((s) => (s > 0 ? ((s - 1) as Stop) : s));
        }}
        onClick={(e) => {
          // Keyboard Enter/Space (pointer taps are handled in `end`).
          if (e.detail === 0) setStop((s) => (s === 2 ? 0 : 2));
        }}
        className="flex w-full shrink-0 cursor-grab touch-none flex-col items-center rounded-t-xl pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring active:cursor-grabbing"
      >
        <span aria-hidden="true" className="h-1 w-8 rounded-full bg-border-control" />
        <span className="flex min-h-[48px] w-full items-center px-5 text-left text-title-md text-text-heading">{title}</span>
      </button>
      <div
        ref={listRef}
        onPointerDown={(e) => begin(e, false)}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={cancel}
        // Don't let a mouse drag turn into "drag this photo/link somewhere".
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          // A swipe that moved the panel shouldn't also open the card under it.
          if (g.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            g.current.moved = false;
          }
        }}
        className={cn(
          "no-scrollbar min-h-0 flex-1",
          // Fully up: the list scrolls. Otherwise swipes move the panel instead.
          stop === 2 && !dragging ? "touch-pan-y overflow-y-auto" : "touch-none overflow-hidden",
        )}
      >
        {children}
      </div>
    </div>
  );
}
