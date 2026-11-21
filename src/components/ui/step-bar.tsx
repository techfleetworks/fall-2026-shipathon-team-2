import { cn } from "@/lib/cn";

// "Step N of M" progress for the sign-up flow (Figma O1–O5).
export function StepBar({ step, total = 5 }: { step: number; total?: number }) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <span className="shrink-0 text-label-md text-text-secondary">
        Step {step} of {total}
      </span>
      <div className="flex flex-1 gap-1.5" aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < step ? "bg-action-primary" : "bg-surface-muted")} />
        ))}
      </div>
    </div>
  );
}
