import Link from "next/link";

const flows = [
  {
    href: "/reserve",
    step: "1",
    title: "Find & reserve",
    description: "Browse surplus groceries nearby and pick a pickup window.",
  },
  {
    href: "/verify",
    step: "2",
    title: "Verify eligibility",
    description: "Confirm SNAP/EBT, Medicaid or other benefits to unlock free items.",
  },
  {
    href: "/pickup",
    step: "3",
    title: "Pick up",
    description: "Show your code at the store and collect your order.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Shipathon Team 2 · Palms, LA County
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Good food from local stores, for families who need it
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Small neighborhood stores list surplus groceries. Single parents
          reserve them free or discounted and pick them up.
        </p>
      </header>

      <nav className="flex flex-col gap-3">
        {flows.map((flow) => (
          <Link
            key={flow.href}
            href={flow.href}
            className="flex items-start gap-4 rounded-lg border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {flow.step}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-medium">{flow.title}</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {flow.description}
              </span>
            </span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
