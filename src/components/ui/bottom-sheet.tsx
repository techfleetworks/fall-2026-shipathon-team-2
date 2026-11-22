"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { IconButton } from "./icon-button";

// Modal bottom sheet (Figma Elevation 3: scrim + handle + rounded top). Built on
// the native <dialog> so focus is trapped, Esc closes it, and the page behind is
// inert. Title states what will happen.
//
// `onClose` means "the person dismissed it" (Esc, tapping outside, or X). It is
// NOT called when the parent closes the sheet itself after a button choice, so a
// choice like "Turn on reminders" is never overwritten by a dismiss handler.
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  showClose,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Adds an X close button next to the title (Figma Filters sheet). */
  showClose?: boolean;
  /** Sticky bottom area (e.g. "Show 9 offers"). */
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Freeze the page behind while the sheet is open, so it can't scroll or
  // bounce under it on iPhone.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        // Esc: keep the dialog in sync with React state; the parent closes it.
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      className="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto flex max-h-[92dvh] w-full max-w-[430px] flex-col rounded-t-xl bg-surface-default p-0 shadow-e3 backdrop:bg-text-primary/40 [&:not([open])]:hidden"
    >
      <div className="no-scrollbar overflow-y-auto px-5 pt-2 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div aria-hidden="true" className="mx-auto mb-4 h-1 w-8 rounded-full bg-border-control" />
        <div className="flex items-center gap-1">
          {showClose && <IconButton icon="x" label="Close" onClick={onClose} className="-ml-3" />}
          <h2 id={titleId} className="text-title-lg font-bold text-text-heading">
            {title}
          </h2>
        </div>
        {children}
      </div>
      {footer && <div className="border-t border-border-default px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">{footer}</div>}
    </dialog>
  );
}
