import { Suspense } from "react";
import PickupFlow from "./pickup-flow";

async function Resolved({ params }: PageProps<"/pickup/[id]">) {
  const { id } = await params;
  return <PickupFlow id={id} />;
}

export default function PickupPage(props: PageProps<"/pickup/[id]">) {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-muted">Loading…</p>}>
      <Resolved {...props} />
    </Suspense>
  );
}
