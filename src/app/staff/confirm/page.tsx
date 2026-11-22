"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Screen, ScreenBody, BottomActionBar } from "@/components/ui/screen";
import { PageHeader } from "@/components/ui/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { StatusBadge } from "@/components/ui/badge";
import { InfoBox } from "@/components/ui/info-box";
import { Icon } from "@/components/ui/icon";
import { getBusiness, getService } from "@/lib/mock-data";
import { formatRange } from "@/lib/slots";
import { findBookingByPin, getAccount, markKept, type Booking } from "@/lib/account";
import { markNav } from "@/lib/nav-motion";

// Business confirms (shop view) — NOT IN FIGMA YET; built from the design
// system so the show-up flow can be completed honestly in the demo. Staff type
// the customer's 6-digit code; only a matching open booking is confirmed.
// DEMO: it reads bookings saved on this same device. In the real app this runs
// on the shop's own device against the shared database.
export default function StaffConfirmPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);

  // After confirming, move focus to the result so it's read out and keyboard
  // users aren't left on a button that disappeared.
  useEffect(() => {
    if (confirmed) doneRef.current?.focus();
  }, [confirmed]);

  const submit = () => {
    if (code.length !== 6) return;
    const b = findBookingByPin(code);
    if (!b) {
      setError("That code doesn't match an open booking for today. Check the numbers with the customer and try again.");
      return;
    }
    markKept(b.id);
    setConfirmed(b);
  };

  if (confirmed) {
    const business = getBusiness(confirmed.businessId)!;
    const service = getService(confirmed.serviceId)!;
    const name = getAccount().profile?.firstName || "Customer";
    return (
      <Screen>
        <PageHeader title="Visit confirmed" backHref="/deals" />
        <ScreenBody className="pt-2">
          <div role="status" className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-status-positive text-on-action">
              <Icon name="check" size={30} />
            </span>
            <p ref={doneRef} tabIndex={-1} className="mt-4 text-headline-sm text-text-heading focus:outline-none">
              {name} is checked in
            </p>
            <p className="mt-1 text-body-lg text-text-secondary">
              {service.name} · {formatRange(new Date(confirmed.startsAt), new Date(confirmed.endsAt))}
            </p>
            <p className="mt-4 rounded-lg bg-status-positive-surface px-5 py-3 text-title-lg font-bold text-on-tint-positive">
              Collect ${confirmed.paid} cash
            </p>
            <p className="mt-2 text-body-sm text-text-secondary">
              Booking {confirmed.ref} · {business.name}
            </p>
          </div>
        </ScreenBody>
        <BottomActionBar className="flex flex-col items-center gap-1">
          <Button
            fullWidth
            onClick={() => {
              setConfirmed(null);
              setCode("");
            }}
          >
            Confirm another visit
          </Button>
          <Link
            href={`/saved/${confirmed.id}`}
            onNavigate={markNav("forward")}
            className="inline-flex min-h-[48px] items-center rounded-full px-4 text-label-lg text-action-primary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            Back to the customer&apos;s app
          </Link>
        </BottomActionBar>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageHeader title="Confirm a visit" backHref="/deals" />
      <ScreenBody className="pt-2">
        <StatusBadge tone="neutral">
          <Icon name="user" size={14} /> Shop view · demo
        </StatusBadge>
        <p className="mt-3 text-body-lg text-text-secondary">
          Ask the customer to show their code, then type the 6 numbers under the pattern.
        </p>
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <TextField
            label="Customer's code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              setError(undefined);
            }}
            inputMode="numeric"
            autoComplete="off"
            maxLength={6}
            helper="6 digits, e.g. 683 001"
            error={error}
            className="tracking-[0.3em]"
          />
        </form>
        <InfoBox className="mt-4">
          Demo: the shop side isn&apos;t built yet. This screen checks bookings saved on this phone; in the real app the
          shop uses its own device.
        </InfoBox>
      </ScreenBody>
      <BottomActionBar>
        <Button fullWidth disabled={code.length !== 6} onClick={submit}>
          Confirm visit
        </Button>
        <ButtonLink href="/deals" variant="text" fullWidth className="mt-1">
          Cancel
        </ButtonLink>
      </BottomActionBar>
    </Screen>
  );
}
