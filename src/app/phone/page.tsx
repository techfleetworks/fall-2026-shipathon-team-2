"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepShell } from "@/components/onboarding/step-shell";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { CheckboxRow } from "@/components/ui/choice";

// O1 · Phone. Step 1 of 5. Consent is never pre-ticked; "Send code" stays disabled
// until it's checked (shows the disabled button state too).
export default function PhonePage() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);

  return (
    <StepShell
      step={1}
      onBack={() => router.push("/welcome")}
      action={
        <Button fullWidth disabled={!agree} onClick={() => router.push("/verify")}>
          Send code
        </Button>
      }
    >
      <h1 className="text-headline-lg text-text-heading">Create your account</h1>
      <p className="mt-2 text-body-lg text-text-secondary">Enter your phone number to get started.</p>

      <div className="mt-6">
        <TextField
          label="Phone number"
          defaultValue="(213) 555-0142"
          inputMode="tel"
          autoComplete="tel"
          helper="We only text bookings and reminders you turn on."
        />
      </div>

      <div className="mt-4">
        <CheckboxRow
          label="I agree to receive booking texts at this number"
          checked={agree}
          onChange={() => setAgree((v) => !v)}
        />
      </div>
      <p className="mt-2 px-1 text-body-sm text-text-secondary">
        Message frequency varies. Message and data rates may apply. Reply STOP to opt out. Terms · Privacy Policy
      </p>
    </StepShell>
  );
}
