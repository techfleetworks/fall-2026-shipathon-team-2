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
      <header className="flex flex-col gap-4">
        {/* Wordmark — placeholder name, easy to change */}
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-primary">
            Plenty
          </span>
        </div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          LA County
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Good food from local stores, for families who need it
        </h1>
        <p className="text-lg text-muted">
          Small neighborhood stores list surplus groceries. Families on a
          limited income reserve them free or discounted and pick them up.
        </p>
      </header>

      <nav className="flex flex-col gap-3">
        {flows.map((flow) => (
          <Link
            key={flow.href}
            href={flow.href}
            className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {flow.step}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-lg font-semibold">
                {flow.title}
              </span>
              <span className="text-muted">{flow.description}</span>
            </span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
