import { Suspense } from "react";
import ItemDetail from "./item-detail";

// The id comes from the URL. Under this project's Cache Components setup, reading
// it must happen inside a <Suspense> boundary, so we resolve it in a child.
export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
          <p className="text-muted">Loading…</p>
        </main>
      }
    >
      <Resolver params={params} />
    </Suspense>
  );
}

async function Resolver({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ItemDetail id={id} />;
}
