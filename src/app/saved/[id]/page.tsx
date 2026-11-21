import Link from "next/link";
import { notFound } from "next/navigation";
import { Screen, ScreenBody, BottomActionBar } from "@/components/ui/screen";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getBooking, getBusiness, getService, monthSavings, plural, savings } from "@/lib/mock-data";

// P5 · All done — "You saved $X". Shown after the shop confirms the visit.
export const instant = false;

export default async function SavedPage({ params }: PageProps<"/saved/[id]">) {
  const { id } = await params;
  const booking = getBooking(id);
  const business = booking && getBusiness(booking.businessId);
  const service = booking && getService(booking.serviceId);
  if (!booking || !business || !service) notFound();

  const shortName = business.name.split(" ").slice(0, 2).join(" ");
  const saved = savings(service);
  const month = monthSavings({ includeDemo: true });

  return (
    <Screen>
      <ScreenBody className="pt-6">
        <h1 className="text-headline-lg text-text-heading">All done</h1>

        <div className="relative mx-auto mt-4 flex h-40 w-40 items-center justify-center rounded-full bg-status-positive-surface">
          {/* Shop badge. The Figma logo export is only the cream lettering, so the
              round badge and scissors mark are drawn here behind it. */}
          <div className="flex h-32 w-32 flex-col items-center justify-center gap-1 overflow-hidden rounded-full bg-status-positive text-on-action">
            {business.logo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={business.logo} alt="" className="w-24" />
                <Icon name="scissors" size={32} />
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.photo} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <span className="absolute right-1 bottom-2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface-default bg-status-positive text-on-action">
            <Icon name="check" size={20} title="Visit confirmed" />
          </span>
        </div>

        <p className="mt-6 text-headline-sm text-text-heading">Thanks for coming to {shortName}.</p>
        <p className="mt-3 text-body-lg text-text-secondary">Paid ${service.offPeakPrice} at the counter.</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border-default p-4">
            <p className="text-label-md text-text-secondary">You saved</p>
            <p className="font-display text-headline-sm text-accent-primary">${saved}</p>
            <p className="text-body-sm text-text-secondary">off the regular price</p>
          </div>
          <div className="rounded-lg border border-border-default p-4">
            <p className="text-label-md text-text-secondary">{shortName}</p>
            <p className="font-display text-headline-sm text-action-primary">1 chair</p>
            <p className="text-body-sm text-text-secondary">filled in a quiet hour</p>
          </div>
        </div>

        <p className="mt-4 border-t border-border-default pt-4 text-body-md text-text-secondary">
          ${month.amount} saved this month · {plural(month.bookings, "booking")}
        </p>
      </ScreenBody>

      <BottomActionBar className="flex flex-col items-center gap-1 border-t-0!">
        <ButtonLink href="/deals" fullWidth>
          Find another deal
        </ButtonLink>
        <Link
          href="/bookings"
          className="inline-flex min-h-[48px] items-center rounded-full px-4 text-label-lg text-action-primary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        >
          See my bookings
        </Link>
      </BottomActionBar>
    </Screen>
  );
}
