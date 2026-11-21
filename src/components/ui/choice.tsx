"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

// Radio & Checkbox rows. The WHOLE row is the target (Figma rule), min 56px.
// Never pre-tick consent (caller controls `checked`).

function Row({
  checked,
  onToggle,
  role,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  role: "radio" | "checkbox";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      onClick={onToggle}
      className={cn(
        "flex w-full min-h-[56px] items-center gap-3 rounded-lg px-4 text-left text-body-lg text-text-primary transition-colors",
        "hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
      )}
    >
      {children}
    </button>
  );
}

export function RadioRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <Row role="radio" checked={checked} onToggle={onChange}>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
          checked ? "border-action-primary" : "border-border-control",
        )}
      >
        {checked && <span className="h-3 w-3 rounded-full bg-action-primary" />}
      </span>
      <span>{label}</span>
    </Row>
  );
}

export function CheckboxRow({ label, checked, onChange }: { label: ReactNode; checked: boolean; onChange: () => void }) {
  return (
    <Row role="checkbox" checked={checked} onToggle={onChange}>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-xs border-2 transition-colors",
          checked ? "border-action-primary bg-action-primary text-on-action" : "border-border-control",
        )}
      >
        {checked && <Icon name="check" size={16} />}
      </span>
      <span>{label}</span>
    </Row>
  );
}

// Bordered radio CARD with a title + subtitle (Figma O3). Selected = violet ring
// + violet title + filled radio.
export function RadioCard({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
        checked ? "border-action-primary ring-1 ring-action-primary" : "border-border-default hover:bg-surface-muted",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
          checked ? "border-action-primary" : "border-border-control",
        )}
      >
        {checked && <span className="h-3 w-3 rounded-full bg-action-primary" />}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className={cn("text-title-sm", checked ? "text-action-primary" : "text-text-primary")}>{title}</span>
        <span className="text-body-md text-text-secondary">{subtitle}</span>
      </span>
    </button>
  );
}
