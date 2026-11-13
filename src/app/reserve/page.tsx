import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find & reserve",
};

// Flow 1: placeholder page. Replace with the real flow.
export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Home
      </Link>
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
        Flow 1
      </p>
      <h1 className="text-3xl font-semibold">Find & reserve</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Browse nearby surplus groceries from small local stores, reserve items, and choose a pickup window.
      </p>
      <section className="rounded-lg border border-dashed border-zinc-300 p-6 dark:border-zinc-700">
        <h2 className="mb-3 font-medium">To build</h2>
        <ul className="list-disc space-y-1 pl-5 text-zinc-600 dark:text-zinc-400">
          <li>Filter by category and distance</li>
          <li>Item list with free / discounted tags</li>
          <li>Reserve button</li>
          <li>Pickup window picker</li>
        </ul>
      </section>
    </main>
  );
}
