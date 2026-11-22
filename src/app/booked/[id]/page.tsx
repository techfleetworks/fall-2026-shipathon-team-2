import { BookingView } from "@/components/booking/booking-view";

// P1 · Booked (switches to P3 "It's today" on the day). The booking lives on the
// person's device, so the client view looks it up by id.
export const instant = false;

export default async function BookedPage({ params }: PageProps<"/booked/[id]">) {
  const { id } = await params;
  return <BookingView bookingId={id} />;
}
