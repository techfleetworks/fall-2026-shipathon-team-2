import { BookingView } from "@/components/booking/booking-view";

// P3 · It's today. Same screen as P1; the day-of header shows automatically.
export const instant = false;

export default async function TodayPage({ params }: PageProps<"/today/[id]">) {
  const { id } = await params;
  return <BookingView bookingId={id} />;
}
