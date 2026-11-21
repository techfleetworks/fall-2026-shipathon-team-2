import { notFound } from "next/navigation";
import { BookingView } from "@/components/booking/booking-view";
import { getBooking, getBusiness, getService } from "@/lib/mock-data";

// P3 · It's today. Same screen as P1 with the day-of header and directions.
export const instant = false;

export default async function TodayPage({ params }: PageProps<"/today/[id]">) {
  const { id } = await params;
  const booking = getBooking(id);
  const business = booking && getBusiness(booking.businessId);
  const service = booking && getService(booking.serviceId);
  if (!booking || !business || !service) notFound();

  return <BookingView variant="today" booking={booking} business={business} service={service} />;
}
