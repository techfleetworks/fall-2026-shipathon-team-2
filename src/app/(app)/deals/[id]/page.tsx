import { Suspense } from "react";
import Listing from "./listing";

// Read route params inside a child under Suspense (Cache Components — see AGENTS.md).
async function Resolved({ params }: PageProps<"/deals/[id]">) {
  const { id } = await params;
  return <Listing id={id} />;
}

export default function ListingPage(props: PageProps<"/deals/[id]">) {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-muted">Loading…</p>}>
      <Resolved {...props} />
    </Suspense>
  );
}
