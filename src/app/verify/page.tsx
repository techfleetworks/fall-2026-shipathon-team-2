"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepShell } from "@/components/onboarding/step-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { SparetimeLogo } from "@/components/brand/logo";
import {
  RESEND_AFTER_SECONDS,
  isSignedUp,
  maskPhone,
  sendCode,
  useAccount,
  useHydrated,
  useNowSeconds,
  verifyCode,
} from "@/lib/account";
import { go } from "@/lib/nav-motion";

// O2 · Code (+ O2e wrong code). Step 2 of 5. DEMO: the code is generated in the
// app and shown in a "text message" banner instead of being texted (real SMS
// needs a paid provider + carrier registration). The code is really checked.
export default function VerifyPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { pending } = useAccount();
  const now = useNowSeconds();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();

  const secondsLeft = pending ? Math.max(0, RESEND_AFTER_SECONDS - (now - Math.floor(pending.sentAt / 1000))) : 0;

  const submit = () => {
    if (code.length !== 6) return;
    if (!verifyCode(code)) {
      setError("That code didn’t match. Try again or get a new one.");
      return;
    }
    go(router, isSignedUp() ? "/deals" : "/reason", "forward");
  };

  if (hydrated && !pending) {
    return (
      <StepShell step={2} onBack={() => go(router, "/phone", "back")} action={<ButtonLink href="/phone" fullWidth>Enter your phone number</ButtonLink>}>
        <h1 className="text-headline-lg text-text-heading">Enter the code</h1>
        <p className="mt-2 text-body-lg text-text-secondary">
          There&apos;s no code waiting. Enter your phone number and we&apos;ll send one.
        </p>
      </StepShell>
    );
  }

  return (
    <StepShell
      // Signing in is 2 screens, so no sign-up progress bar there.
      step={pending?.signin ? undefined : 2}
      onBack={() => router.back()}
      action={
        <Button fullWidth disabled={code.length !== 6} onClick={submit}>
          Continue
        </Button>
      }
    >
      {pending && (
        <div
          aria-live="polite"
          className="mb-5 rounded-lg border border-border-default bg-surface-default p-3 shadow-e2"
        >
          <div className="flex items-start gap-3">
            <SparetimeLogo size={32} />
            <div className="min-w-0 flex-1">
              <p className="flex justify-between text-label-sm text-text-secondary">
                <span>Messages · Sparetime</span>
                <span>now</span>
              </p>
              <p className="mt-0.5 text-body-md text-text-primary">
                Your Sparetime code is <strong className="tracking-wider">{pending.code}</strong>. Don&apos;t share it.
              </p>
            </div>
          </div>
          <p className="mt-2 border-t border-border-default pt-2 text-body-sm text-text-secondary">
            Demo: in the live app this code arrives by text message.
          </p>
        </div>
      )}

      <h1 className="text-headline-lg text-text-heading">Enter the code</h1>
      <p className="mt-2 text-body-lg text-text-secondary">Sent to {pending ? maskPhone(pending.phone) : "your phone"}</p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <TextField
          label="Code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setError(undefined);
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          helper="6 digits"
          error={error}
          className="tracking-[0.3em]"
        />
      </form>

      <div className="mt-4">
        <Button
          variant="outlined"
          disabled={!hydrated || secondsLeft > 0}
          onClick={() => {
            if (!pending) return;
            sendCode(pending.phone, { signin: pending.signin, bookingTexts: pending.bookingTexts });
            setCode("");
            setError(undefined);
          }}
        >
          {secondsLeft > 0 ? `Send a new code (0:${String(secondsLeft).padStart(2, "0")})` : "Send a new code"}
        </Button>
      </div>
    </StepShell>
  );
}
