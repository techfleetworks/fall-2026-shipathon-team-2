"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";

// 48×48 hit area (Figma rule). `label` is required and becomes the accessible
// name — icon-only controls must announce what they do, and toggles their state.
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  icon: IconName;
  label: string;
  pressed?: boolean;
}

export function IconButton({ icon, label, pressed, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-full text-text-primary transition-colors",
        "hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
        pressed && "text-accent-primary",
        className,
      )}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
