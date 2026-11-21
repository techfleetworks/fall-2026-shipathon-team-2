"use client";

import { useRouter } from "next/navigation";
import { StepShell } from "@/components/onboarding/step-shell";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

// O2 · Code. Step 2 of 5. Enter the 6-digit code; resend is on a countdown.
export default function VerifyPage() {
  const router = useRouter();

  return (
    <StepShell
      step={2}
      onBack={() => router.push("/phone")}
      action={
        <Button fullWidth onClick={() => router.push("/reason")}>
          Continue
        </Button>
      }
    >
      <h1 className="text-headline-lg text-text-heading">Enter the code</h1>
      <p className="mt-2 text-body-lg text-text-secondary">Sent to (213) ***-**42</p>

      <div className="mt-6">
        <TextField label="Code" defaultValue="4 8 2 _ _ _" inputMode="numeric" autoComplete="one-time-code" helper="6 digits" />
      </div>

      <div className="mt-4 flex gap-3">
        <Button variant="outlined" disabled>Resend code (0:30)</Button>
        <Button variant="outlined">Call me instead</Button>
      </div>
    </StepShell>
  );
}
