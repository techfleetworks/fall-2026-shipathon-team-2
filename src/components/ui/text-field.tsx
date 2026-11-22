"use client";

import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

// Outlined text field (Figma rule): label always visible (never placeholder-only),
// helper text below, error state in text tied to the field (not colour alone).
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  helper?: string;
  error?: string;
  trailing?: ReactNode;
}

export function TextField({ label, helper, error, trailing, className, ...props }: TextFieldProps) {
  const id = useId();
  const helpId = `${id}-help`;
  const hasError = !!error;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={cn("text-label-md", hasError ? "text-danger-primary" : "text-text-secondary")}
      >
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border bg-surface-default px-4 min-h-[56px] transition-colors",
          "focus-within:ring-2 focus-within:ring-offset-0",
          hasError
            ? "border-danger-primary focus-within:ring-danger-primary"
            : "border-border-control focus-within:border-action-primary focus-within:ring-action-primary",
        )}
      >
        <input
          id={id}
          aria-invalid={hasError || undefined}
          aria-describedby={helper || error ? helpId : undefined}
          className={cn("w-full bg-transparent text-body-lg text-text-primary outline-none placeholder:text-text-secondary", className)}
          {...props}
        />
        {hasError ? <Icon name="alert" size={22} className="shrink-0 text-danger-primary" /> : trailing}
      </div>
      {(error || helper) && (
        // An error is a new element with role="alert" so screen readers announce
        // it as soon as it appears (e.g. a wrong code after tapping Continue).
        <p
          key={hasError ? "error" : "helper"}
          id={helpId}
          role={hasError ? "alert" : undefined}
          className={cn("text-body-sm", hasError ? "text-danger-primary" : "text-text-secondary")}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
}
