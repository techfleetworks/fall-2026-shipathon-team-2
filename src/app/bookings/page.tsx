import Link from "next/link";
import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import {
  demoBooking,
  getBusiness,
  getService,
  monthSavings,
  pastBookings,
  plural,
} from "@/lib/mock-data";

// H2 · My bookings. Upcoming (the demo booking) + Past (kept visits, "Book again").
// Figma draws the empty Upcoming state; it shows here whenever nothing is booked.
export default function MyBookingsPage() {
  const upcoming = [demoBooking];
  const month = monthSavings({ includeDemo: false });

  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">My bookings</h1>

        <h2 className="mt-5 mb-2 text-label-md text-text-secondary">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center rounded-lg border border-border-default px-5 py-5 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle text-on-tint-primary">
              <Icon name="ticket" size={22} />
            </span>
            <p className="mt-3 text-title-sm text-text-primary">Nothing booked right now</p>
            <p className="mt-1 text-body-md text-text-secondary">Your next booking will show up here.</p>
            <ButtonLink href="/deals" fullWidth className="mt-4">
              Find offers near you
            </ButtonLink>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {upcoming.map((b) => {
              const business = getBusiness(b.businessId)!;
              const service = getService(b.serviceId)!;
              return (
                <li key={b.id}>
                  <Link
                    href={`/booked/${b.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border-default p-4 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={business.photo} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-title-sm text-text-primary">{business.name}</p>
                      <p className="text-body-md text-text-secondary">
                        {service.name} · {b.dayLabel}, {b.timeRange}
                      </p>
                      <div className="mt-1">
                        <StatusBadge tone="positive">
                          <Icon name="check" size={14} /> Booked · ${service.offPeakPrice} cash
                        </StatusBadge>
                      </div>
                    </div>
                    <Icon name="chevron-right" size={20} className="text-text-secondary" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <h2 className="mt-5 mb-2 text-label-md text-text-secondary">Past</h2>
        <ul className="flex flex-col gap-3">
          {pastBookings.map((p) => {
            const business = getBusiness(p.businessId)!;
            return (
              <li key={p.id} className="flex items-center gap-3 rounded-lg border border-border-default p-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={business.photo} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-title-sm text-text-primary">{business.name}</p>
                  <p className="text-body-md text-text-secondary">
                    {p.label} · ${p.paid} · saved ${p.saved} · {p.dateLabel}
                  </p>
                </div>
                <ButtonLink href={`/offer/${p.serviceId}`} variant="outlined" className="shrink-0 px-4! text-action-primary!">
                  Book again<span className="sr-only"> at {business.name}</span>
                </ButtonLink>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-body-md text-text-secondary">
          ${month.amount} saved this month · {plural(month.bookings, "booking")}
        </p>
      </ScreenBody>
      <NavBar active="bookings" />
    </Screen>
  );
}
