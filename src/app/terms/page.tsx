import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules for using Sparetime: 18+, pay the business directly, booking limits, cancellation. Draft for the demo — not legal advice.",
};

// Static legal page. Content mirrors the Terms points in
// docs/privacy-and-retention.md (the approved draft).

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-xl font-bold tracking-tight">{children}</h2>;
}

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-16 pt-6">
      <BackButton
        fallback="/"
        label="Back"
        className="inline-flex min-h-[48px] items-center gap-1 text-sm text-text-secondary transition-colors hover:text-action-primary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </BackButton>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-1 text-sm text-text-secondary">Draft · last updated Nov 20, 2026</p>

      <div className="mt-4 rounded-2xl border border-border-default bg-surface-default p-4 text-sm text-text-secondary shadow-e1">
        This is a placeholder for the demo and is <strong>not legal advice</strong>.
        A qualified person must review it before any real launch.
      </div>

      <p className="mt-6 text-[15px] leading-relaxed">
        Sparetime connects you with discounted off-peak time slots for everyday
        services from small local businesses. By using Sparetime, you agree to the
        points below.
      </p>

      <H2>Using Sparetime</H2>
      <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed">
        <li>You must be <strong>18 or older</strong> to use Sparetime.</li>
        <li>You pay the business <strong>directly, in cash</strong> — Sparetime does not process payments and never stores card numbers.</li>
        <li>Businesses, not Sparetime, provide and are responsible for the services.</li>
        <li>Slots depend on what businesses have open.</li>
        <li>Do not resell bookings or share your booking codes.</li>
      </ul>

      <H2>Booking limits (the trust ladder)</H2>
      <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed">
        <li>A new account can hold <strong>1</strong> active booking at a time.</li>
        <li>After you have <strong>shown up for 2 bookings</strong>, you can hold <strong>2</strong> at a time.</li>
        <li>After that, the limit opens up fully.</li>
        <li><strong>Two missed bookings</strong> reset your limit back to 1.</li>
      </ul>

      <H2>Cancellation</H2>
      <p className="mt-2 text-[15px] leading-relaxed">
        You can cancel up to <strong>2 hours before</strong> your booking time.
        Cancelling later, or not showing up, counts as a <strong>miss</strong>.
      </p>

      <H2>Governing law</H2>
      <p className="mt-2 text-[15px] leading-relaxed">
        These terms follow <strong>California</strong> law.
      </p>

      <H2>About Sparetime</H2>
      <p className="mt-2 text-[15px] leading-relaxed">
        Sparetime is a <strong>planned public benefit corporation</strong> (not yet
        filed). Legal entity name and address:{" "}
        <span className="text-text-secondary">to be added</span>.
      </p>

      <p className="mt-8 text-sm text-text-secondary">
        See also our{" "}
        <Link href="/privacy" replace className="font-semibold text-action-primary underline">Privacy Policy</Link>.
      </p>
    </main>
  );
}
