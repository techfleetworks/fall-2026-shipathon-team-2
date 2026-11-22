import { Screen, ScreenBody } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { NavBar } from "@/components/ui/nav-bar";
import { LimitStatusPanel } from "../limit-client";

// H3b · How bookings work — the trust ladder in plain language, plus your status.
const STEPS = [
  { title: "Start with one booking", body: "New members hold one booking at a time." },
  {
    title: "Show up to book more",
    body: "Show up for 2 bookings and you can hold 2 at once. Show up for those 2 and there’s no limit.",
  },
  {
    title: "Missed one? No fee",
    body: "A missed booking costs nothing. Two missed bookings in total reset your limit to one at a time. Cancelling less than 2 hours before counts as a miss.",
  },
];

export default function HowBookingsWorkPage() {
  return (
    <Screen>
      <PageHeader title="How bookings work" backHref="/account" />
      <ScreenBody className="pt-2">
        <p className="text-body-lg text-text-secondary">
          Booking is free. This rule keeps slots fair and lets shops count on the people who book.
        </p>

        <ol className="mt-4 flex flex-col gap-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-label-lg text-on-tint-primary"
              >
                {i + 1}
              </span>
              <div>
                <p className="text-title-sm text-text-primary">{s.title}</p>
                <p className="text-body-md text-text-secondary">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <LimitStatusPanel />
      </ScreenBody>
      <NavBar active="account" />
    </Screen>
  );
}
