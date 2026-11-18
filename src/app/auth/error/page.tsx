import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign-in link problem",
};

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold">That sign-in link didn’t work</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Links expire after a while and only work once, in the same browser
        where you asked for them. Request a new one and try again.
      </p>
      <Link
        href="/login"
        className="self-start rounded-md bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Back to sign in
      </Link>
    </main>
  );
}
