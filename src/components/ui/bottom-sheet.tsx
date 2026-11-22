"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconButton } from "./icon-button";

// Modal bottom sheet (Figma Elevation 3: scrim + handle + rounded top). Built on
// the native <dialog> so focus is trapped, Esc closes it, and the page behind is
// inert. Title states what will happen.
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

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="sheet-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto flex max-h-[92dvh] w-full max-w-[430px] flex-col rounded-t-xl bg-surface-default p-0 shadow-e3 backdrop:bg-text-primary/40 [&:not([open])]:hidden"
    >
      <div className="overflow-y-auto px-5 pt-2 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div aria-hidden="true" className="mx-auto mb-4 h-1 w-8 rounded-full bg-border-control" />
        <div className="flex items-center gap-1">
          {showClose && <IconButton icon="x" label="Close" onClick={onClose} className="-ml-3" />}
          <h2 id="sheet-title" className="text-title-lg font-bold text-text-heading">
            {title}
          </h2>
        </div>
        {children}
      </div>
      {footer && <div className="border-t border-border-default px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">{footer}</div>}
    </dialog>
  );
}
