"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./spinner";

type Variant = "filled" | "tonal" | "outlined" | "text" | "destructive";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 min-h-[48px] text-label-lg transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  filled: "bg-action-primary text-on-action hover:bg-on-tint-primary disabled:bg-disabled-bg disabled:text-disabled-text",
  tonal: "bg-surface-subtle text-on-tint-primary hover:bg-accent-surface disabled:bg-disabled-bg disabled:text-disabled-text",
  outlined: "border border-border-control text-text-primary bg-transparent hover:bg-surface-muted disabled:text-disabled-text disabled:border-border-default",
  text: "text-action-primary bg-transparent hover:bg-surface-subtle disabled:text-disabled-text",
  destructive: "text-danger-primary bg-transparent hover:bg-danger-surface disabled:text-disabled-text",
};

export function Button({
  variant = "filled",
  fullWidth,
  loading,
  loadingLabel,
  leadingIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={20} />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        <>
          {leadingIcon}
          {children}
        </>
      )}
    </button>
  );
}
