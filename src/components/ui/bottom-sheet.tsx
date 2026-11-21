"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Modal bottom sheet (Figma Elevation 3: scrim + handle + rounded top). Built on
// the native <dialog> so focus is trapped, Esc closes it, and the page behind is
// inert. Title states what will happen.
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
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
      className="fixed inset-x-0 top-auto bottom-0 m-0 mx-auto w-full max-w-[430px] max-h-none rounded-t-xl bg-surface-default p-0 shadow-e3 backdrop:bg-text-primary/40"
    >
      <div className="px-5 pt-2 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div aria-hidden="true" className="mx-auto mb-4 h-1 w-8 rounded-full bg-border-control" />
        <h2 id="sheet-title" className="text-title-lg font-bold text-text-heading">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
