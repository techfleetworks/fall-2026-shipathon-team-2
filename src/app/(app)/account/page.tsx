import type { Metadata } from "next";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <h1 className="text-2xl font-bold tracking-tight">Account</h1>
      <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
        Profile, verification status, and settings will live here.
      </p>
    </div>
  );
}
