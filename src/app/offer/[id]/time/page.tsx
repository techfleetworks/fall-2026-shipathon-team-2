import { notFound } from "next/navigation";
import { getService, getBusiness } from "@/lib/mock-data";
import { PickTime } from "./pick-time";

// R5t · Pick a time. Server page reads the route param and hands it to the client
// slot-picker. Blocking render (route params; mock data, not cached).
export const instant = false;

export default async function PickTimePage({ params }: PageProps<"/offer/[id]/time">) {
  const { id } = await params;
  const service = getService(id);
  const business = service ? getBusiness(service.businessId) : undefined;
  if (!service || !business) notFound();

  return (
    <PickTime serviceId={id} businessName={business.name} serviceName={service.name} price={service.offPeakPrice} />
  );
}
