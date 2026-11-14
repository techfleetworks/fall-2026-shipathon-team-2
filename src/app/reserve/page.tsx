import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ReserveList from "./reserve-list";

export const metadata: Metadata = {
  title: "Find & reserve",
};

// Flow 1: Find & reserve.
// This file runs on the server (so it can set the page title above).
// The interactive list lives in reserve-list.tsx, which runs in the browser.
export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-primary">
        ← Home
      </Link>
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          Step 1 of 3
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Find &amp; reserve
        </h1>
        <p className="text-lg text-muted">
          Browse nearby surplus groceries from small local stores, reserve
          items, and choose a pickup window.
        </p>
      </header>

      <Suspense fallback={<p className="text-muted">Loading items…</p>}>
        <ReserveList />
      </Suspense>
    </main>
  );
}
