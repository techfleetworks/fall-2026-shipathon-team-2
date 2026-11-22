import { Screen, ScreenBody } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { LoadingRow } from "@/components/ui/spinner";
import { NavBar } from "@/components/ui/nav-bar";

// Shared loading / not-found states for the after-booking screens.
export function BookingLoading({ title }: { title: string }) {
  return (
    <Screen>
      <PageHeader title={title} backHref="/bookings" />
      <ScreenBody className="pt-2">
        <LoadingRow label="Loading your booking…" />
      </ScreenBody>
    </Screen>
  );
}

export function BookingMissing({ title }: { title: string }) {
  return (
    <Screen>
      <PageHeader title={title} backHref="/bookings" />
      <ScreenBody className="pt-2">
        <p className="text-body-lg text-text-secondary">
          We couldn&apos;t find that booking on this device. It may have been made on another phone, or you logged out.
        </p>
        <ButtonLink href="/bookings" fullWidth className="mt-4">
          See my bookings
        </ButtonLink>
      </ScreenBody>
      <NavBar active="bookings" />
    </Screen>
  );
}

// For "All done" and "Rate your visit" opened before the visit was checked in
// (e.g. from a direct link): don't claim a visit or payment that didn't happen.
export function BookingNotCheckedIn({ title, bookingId }: { title: string; bookingId: string }) {
  return (
    <Screen>
      <PageHeader title={title} backHref={`/booked/${bookingId}`} />
      <ScreenBody className="pt-2">
        <p className="text-body-lg text-text-secondary">
          This visit hasn&apos;t been checked in yet. Once the shop confirms it, you can see your savings and rate it here.
        </p>
        <ButtonLink href={`/booked/${bookingId}`} fullWidth className="mt-4">
          See my booking
        </ButtonLink>
      </ScreenBody>
      <NavBar active="bookings" />
    </Screen>
  );
}
