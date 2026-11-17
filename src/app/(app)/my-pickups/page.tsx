import type { Metadata } from "next";

export const metadata: Metadata = { title: "My pickups" };

export default function MyPickupsPage() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight">My pickups</h1>
      <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
        Your reserved bags will appear here. (Pickup flow coming next.)
      </p>
    </div>
  );
}
