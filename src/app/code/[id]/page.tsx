import { notFound } from "next/navigation";
import { Screen, ScreenBody, BottomActionBar } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { BookingTicket } from "@/components/ui/booking-ticket";
import { QrCode } from "@/components/ui/qr-code";
import { InfoBox } from "@/components/ui/info-box";
import { ButtonLink } from "@/components/ui/button";
import { getBooking, getBusiness, getService } from "@/lib/mock-data";

// P4 · Show code. The customer shows this at the counter; staff scan or type the
// 6 digits. "Done" stands in for the business confirming the visit (the staff
// confirm screen is not designed yet — see docs/frontend-build-plan.md §6).
export const instant = false;

export default async function ShowCodePage({ params }: PageProps<"/code/[id]">) {
  const { id } = await params;
  const booking = getBooking(id);
  const business = booking && getBusiness(booking.businessId);
  const service = booking && getService(booking.serviceId);
  if (!booking || !business || !service) notFound();

  const pinDisplay = `${booking.pin.slice(0, 3)} ${booking.pin.slice(3)}`;

  return (
    <Screen>
      <PageHeader title="Show at the counter" backHref={`/today/${booking.id}`} />
      <ScreenBody className="flex flex-col gap-3 pt-2">
        <section
          aria-label="Your check-in code"
          className="flex flex-col items-center rounded-lg border border-border-default bg-surface-card px-4 pt-6 pb-5 shadow-e1"
        >
          <QrCode value={booking.code} />
          <p className="mt-3 font-display text-headline-sm tracking-[0.15em] text-text-primary">
            <span className="sr-only">Code: </span>
            {pinDisplay}
          </p>
          <p className="mt-2 text-body-md text-text-secondary">Staff can type the numbers if the scan fails</p>
        </section>

        <BookingTicket booking={booking} business={business} service={service} when={`Today, ${booking.timeRange}`} />

        <InfoBox>Pay ${service.offPeakPrice} in cash at the counter.</InfoBox>
      </ScreenBody>
      <BottomActionBar className="border-t-0!">
        <ButtonLink href={`/saved/${booking.id}`} fullWidth>
          Done
        </ButtonLink>
      </BottomActionBar>
    </Screen>
  );
}
