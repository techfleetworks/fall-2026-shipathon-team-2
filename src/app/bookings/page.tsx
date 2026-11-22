import { Screen, ScreenBody } from "@/components/ui/screen";
import { NavBar } from "@/components/ui/nav-bar";
import { ButtonLink } from "@/components/ui/button";
import { getBusiness, monthSavings, pastBookings, plural } from "@/lib/mock-data";
import { UpcomingList } from "./upcoming-list";

// H2 · My bookings. Upcoming = the person's real bookings. Past is still sample
// history until step 3 (empty history) replaces it with their kept visits.
export default function MyBookingsPage() {
  const month = monthSavings();

  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">My bookings</h1>

        <h2 className="mt-5 mb-2 text-label-md text-text-secondary">Upcoming</h2>
        <UpcomingList />

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
