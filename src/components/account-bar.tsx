import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";

const barClass =
  "flex min-h-12 items-center justify-end gap-3 border-b border-zinc-200 px-6 py-2 text-sm dark:border-zinc-800";

// Shows who is signed in. Reads cookies, so the layout wraps it in <Suspense>.
export async function AccountBar() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className={barClass}>
        <Link href="/login" className="font-medium hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className={barClass}>
      <span className="text-zinc-600 dark:text-zinc-400">{user.email}</span>
      <span
        className={
          user.verified
            ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100"
            : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        }
      >
        {user.verified ? "Verified" : "Not verified"}
      </span>
      <form action={signOut}>
        <button type="submit" className="font-medium hover:underline">
          Sign out
        </button>
      </form>
    </div>
  );
}

// Same size as the bar, shown for a split second while it loads.
export function AccountBarPlaceholder() {
  return <div className={barClass} aria-hidden="true" />;
}
