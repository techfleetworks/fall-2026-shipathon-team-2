import { cn } from "@/lib/cn";

// Circular progress (Figma "Progress indicator"). Pair with a short label.
export function Spinner({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
      role="status"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function LoadingRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-muted px-4 py-4 text-text-primary">
      <Spinner className="text-action-primary" />
      <span className="text-body-lg">{label}</span>
    </div>
  );
}
