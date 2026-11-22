import { notFound } from "next/navigation";
import { getService } from "@/lib/mock-data";
import { PickTime } from "./pick-time";

// R5t · Pick a time. Server page reads the route param and hands it to the client
// slot-picker (open times depend on the person's clock, so they're built there).
export const instant = false;

export default async function PickTimePage({ params }: PageProps<"/offer/[id]/time">) {
  const { id } = await params;
  if (!getService(id)) notFound();
  return <PickTime serviceId={id} />;
}
