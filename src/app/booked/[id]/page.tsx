import { notFound } from "next/navigation";
import { BookingView } from "@/components/booking/booking-view";
import { getBooking, getBusiness, getService } from "@/lib/mock-data";

// P1 · Booked. Blocking render (reads route params; mock data, not cached).
export const instant = false;

export default async function BookedPage({ params }: PageProps<"/booked/[id]">) {
  const { id } = await params;
  const booking = getBooking(id);
  const business = booking && getBusiness(booking.businessId);
  const service = booking && getService(booking.serviceId);
  if (!booking || !business || !service) notFound();

  return <BookingView variant="booked" booking={booking} business={business} service={service} />;
}
