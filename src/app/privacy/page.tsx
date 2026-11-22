import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Sparetime collects, how long we keep it, and your choices. Draft for the demo — not legal advice.",
};

// Static legal page. Content mirrors docs/privacy-and-retention.md (the approved
// draft). Design uses the shared semantic tokens (see DESIGN.md / globals.css).

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-xl font-bold tracking-tight">{children}</h2>;
}

export default function PrivacyPage() {
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

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-1 text-sm text-text-secondary">Draft · last updated Nov 21, 2026</p>

      <div className="mt-4 rounded-2xl border border-border-default bg-surface-default p-4 text-sm text-text-secondary shadow-e1">
        This is a placeholder for the demo and is <strong>not legal advice</strong>.
        A qualified person must review it before it is shown to real users.
      </div>

      <p className="mt-6 text-[15px] leading-relaxed">
        Sparetime helps you find and book discounted off-peak time slots for
        everyday services, like haircuts and laundry, from small local
        businesses. We collect only what we need to do that, we do not sell your
        data, and you can delete it at any time.
      </p>

      <p className="mt-4 rounded-xl bg-surface-subtle px-4 py-3 text-[15px] font-semibold text-on-tint-primary">
        We never ask you to prove your income.
      </p>

      <H2>What we collect</H2>
      <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed">
        <li><strong>Account details:</strong> your first name and your US mobile phone number. We sign you in by texting a 6-digit code to that number, so there is no password. The code is used once and not kept.</li>
        <li><strong>Location:</strong> your ZIP code, so we can show businesses near you. If a map is used, device location is used only while you are on the map and is not stored.</li>
        <li><strong>Bookings:</strong> what you booked, with which business, your time slot, and whether you showed up. We use this to set how many bookings you can hold at once.</li>
        <li><strong>Preferences:</strong> any settings you choose (for example service filters), so we can tailor the slots we show.</li>
        <li><strong>Consent record:</strong> which version of the policy you agreed to, and when.</li>
        <li><strong>Security logs:</strong> sign-in attempts and error logs.</li>
      </ul>

      <p className="mt-4 rounded-2xl border border-border-default bg-surface-default p-4 text-sm text-text-secondary shadow-e1">
        <strong>In this demo:</strong> no text message is sent (the 6-digit code is
        shown on screen), and everything you enter (phone number, first name, ZIP
        code, bookings and preferences) is saved only on your device, in this
        browser. None of it is sent to a server. &ldquo;Start fresh on this
        device&rdquo; in Account deletes it.
      </p>

      <H2>What we do not collect</H2>
      <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed">
        <li><strong>Income, benefits or any proof of need.</strong> We never ask you to prove your income.</li>
        <li><strong>Payment card numbers.</strong> You pay the business directly, in cash.</li>
        <li><strong>Children&apos;s names or details.</strong> Sparetime is for adults aged 18 and over.</li>
      </ul>

      <H2>How we use it</H2>
      <p className="mt-2 text-[15px] leading-relaxed">
        To show available slots, hold your booking, give you a booking code, set
        your booking limit, and keep the service safe. We do not use it for
        advertising.
      </p>

      <H2>Who we share it with</H2>
      <p className="mt-2 text-[15px] leading-relaxed">
        We do not sell or rent your personal data. A business sees only what it
        needs to serve you: your first name, your booking code and your time slot.
        We use service providers to run the app (for example hosting and sign-in),
        and they may only use your data to provide that service. We may disclose
        data if the law requires it.
      </p>

      <H2>How long we keep it</H2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-border-default">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="bg-surface-subtle text-on-tint-primary">
            <tr>
              <th className="p-2.5 font-semibold">Data</th>
              <th className="p-2.5 font-semibold">How long</th>
            </tr>
          </thead>
          <tbody className="bg-surface-default">
            {[
              ["Account (phone number, first name)", "Until you delete your account, or 12 months after your last login"],
              ["ZIP code", "Until you change it or delete your account"],
              ["Live location", "Not stored — session only"],
              ["Active bookings", "Until the booking ends"],
              ["Past bookings", "12 months, then deleted"],
              ["Booking count (shows / misses)", "Until you delete your account"],
              ["Preferences", "Until you edit them or delete your account"],
              ["Consent records", "3 years after account deletion"],
              ["Security logs", "90 days"],
              ["Deleted accounts (except consent records)", "Removed within 30 days of your request"],
            ].map(([data, keep]) => (
              <tr key={data} className="border-t border-border-default align-top">
                <td className="p-2.5 font-medium">{data}</td>
                <td className="p-2.5 text-text-secondary">{keep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Your choices and rights</H2>
      <p className="mt-2 text-[15px] leading-relaxed">
        You can view and edit your information in Settings, download your data, or
        delete your account at any time. If you live in <strong>California</strong>{" "}
        you also have the right to know what we collect, to request deletion or
        correction, and not to be treated differently for using these rights.
        Contact: <span className="text-text-secondary">[privacy contact email, to be added]</span>.
      </p>

      <H2>Security</H2>
      <p className="mt-2 text-[15px] leading-relaxed">
        Encrypted connections and access controls; each user can read only their
        own records. No system is perfectly secure, so keep your phone and your
        sign-in codes to yourself.
      </p>

      <H2>Children</H2>
      <p className="mt-2 text-[15px] leading-relaxed">
        Sparetime is for adults aged 18 and over. We do not knowingly collect data
        from children.
      </p>

      <H2>Changes</H2>
      <p className="mt-2 text-[15px] leading-relaxed">
        If we make important changes, we will tell you in the app before they take
        effect.
      </p>

      <p className="mt-8 text-sm text-text-secondary">
        See also our{" "}
        <Link href="/terms" replace className="font-semibold text-action-primary underline">Terms of Service</Link>.
      </p>
    </main>
  );
}
