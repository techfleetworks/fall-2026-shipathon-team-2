import { RateView } from "./rate-view";

// P6 · Rate your visit. The visit lives on the person's device; the client view
// looks it up by id.
export const instant = false;

export default async function RatePage({ params }: PageProps<"/rate/[id]">) {
  const { id } = await params;
  return <RateView bookingId={id} />;
}
