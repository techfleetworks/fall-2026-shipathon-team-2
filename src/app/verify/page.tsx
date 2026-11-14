import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify eligibility",
};

// Flow 2: placeholder page. Replace with the real flow.
export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Home
      </Link>
      <p className="text-sm font-medium uppercase tracking-wide text-muted">
        Step 2 of 3
      </p>
      <h1 className="text-3xl font-semibold">Verify eligibility</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Confirm eligibility with SNAP/EBT, Medicaid or other benefit proof. Mocked for the MVP: no image is stored.
      </p>
      <section className="rounded-lg border border-dashed border-zinc-300 p-6 dark:border-zinc-700">
        <h2 className="mb-3 font-medium">To build</h2>
        <ul className="list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
          <li>Choose a benefit type</li>
          <li>Mock upload / confirm step</li>
          <li>Verified status saved to the user’s profile</li>
        </ul>
      </section>
    </main>
  );
}
