import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import type { Booking, Business, Service } from "@/lib/mock-data";

// The booking card used across the "after booking" screens (Figma P1, P3, P4).
// Optional status header (label + big time line), then the shop, then a 2×2 grid
// of when / total / payment / booking ID. Status is always icon + text, never
// colour alone.
type Tone = "booked" | "today";

const headerCls: Record<Tone, { bar: string; band: string }> = {
  booked: { bar: "bg-action-primary text-on-action", band: "bg-surface-muted text-text-primary" },
  today: { bar: "bg-status-positive text-on-action", band: "bg-status-positive-surface text-on-tint-positive" },
};

export function BookingTicket({
  booking,
  business,
  service,
  when,
  status,
  className,
}: {
  booking: Booking;
  business: Business;
  service: Service;
  /** "When" cell copy, e.g. "Tue 24, 2:30–3:00 pm" or "Today, 2:30–3:00 pm". */
  when: string;
  status?: { tone: Tone; label: string; icon: "check" | "calendar"; headline: ReactNode };
  className?: string;
}) {
  return (
    <section
      aria-label="Booking details"
      className={cn("overflow-hidden rounded-lg border border-border-default bg-surface-card shadow-e1", className)}
    >
      {status && (
        <>
          <p className={cn("flex items-center justify-center gap-2 px-4 py-2.5 text-label-lg", headerCls[status.tone].bar)}>
            <Icon name={status.icon} size={18} />
            {status.label}
          </p>
          <p className={cn("px-4 py-3 text-center text-title-lg font-bold", headerCls[status.tone].band)}>{status.headline}</p>
        </>
      )}

      <div className="flex items-start gap-3 p-4">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={business.photo} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-title-sm text-text-primary">{business.name}</p>
          <p className="text-body-md text-text-secondary">{service.name}</p>
          <p className="text-body-sm text-text-secondary">
            {business.address} · {business.distanceMi} mi
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-3 border-t border-border-default p-4">
        <div>
          <dt className="text-label-sm text-text-secondary">When</dt>
          <dd className="text-body-lg text-text-primary">{when}</dd>
        </div>
        <div className="text-right">
          <dt className="text-label-sm text-text-secondary">Total</dt>
          <dd className="text-body-lg text-text-primary">${service.offPeakPrice}</dd>
        </div>
        <div>
          <dt className="text-label-sm text-text-secondary">Payment</dt>
          <dd className="text-body-lg text-text-primary">Cash on arrival</dd>
        </div>
        <div className="text-right">
          <dt className="text-label-sm text-text-secondary">Booking ID</dt>
          <dd className="text-body-lg text-text-primary">{booking.ref}</dd>
        </div>
      </dl>
    </section>
  );
}
