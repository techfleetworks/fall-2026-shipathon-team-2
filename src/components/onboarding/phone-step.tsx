"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepShell } from "@/components/onboarding/step-shell";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import Link from "next/link";
import { formatPhone, isValidUsPhone, phoneDigits, sendCode } from "@/lib/account";
import { go, markNav } from "@/lib/nav-motion";

// O1 · Phone — shared by "Create your account" (/phone) and "Sign in" (/signin).
// Starts empty; formats as you type. This screen only handles the one-time
// code: tapping "Send code" is the request for that one text. Optional booking
// texts are asked later (reminders prompt after the first booking; Settings).
// "Send code" needs a valid US number. After the code, an existing account on
// this phone goes straight to Deals; a new number continues sign-up.
export function PhoneStep({ mode }: { mode: "signup" | "signin" }) {
  const router = useRouter();
  const [digits, setDigits] = useState("");
  const [touched, setTouched] = useState(false);
  const signin = mode === "signin";

  const valid = isValidUsPhone(digits);
  const error = touched && digits.length > 0 && !valid ? "Enter a 10-digit US phone number." : undefined;

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    sendCode(formatPhone(digits), signin ? { signin: true } : {});
    go(router, "/verify", "forward");
  };

  return (
    <StepShell
      step={signin ? undefined : 1}
      onBack={() => go(router, "/welcome", "back")}
      action={
        <Button fullWidth disabled={!valid} onClick={submit}>
          Send code
        </Button>
      }
    >
      <h1 className="text-headline-lg text-text-heading">{signin ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-2 text-body-lg text-text-secondary">
        {signin ? "Enter the phone number you signed up with." : "Enter your phone number to get started."}
      </p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <TextField
          label="Phone number"
          value={formatPhone(digits)}
          onChange={(e) => setDigits(phoneDigits(e.target.value))}
          onBlur={() => setTouched(true)}
          placeholder="(213) 555-0123"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          helper={
            signin
              ? "We'll text you a one-time sign-in code. Message and data rates may apply."
              : "We'll text you a code to confirm your number. Message and data rates may apply."
          }
          error={error}
        />
      </form>

      <p className="mt-4 rounded-lg bg-surface-muted px-4 py-3 text-body-sm text-text-primary">
        <span className="font-bold">Demo:</span> no texts are sent. Your code appears on the next screen, so any US
        number works, and your number stays on this phone.
        {signin && " Signing in with the number you used restores your account on this phone; a new number starts a fresh one."}
      </p>
      {signin && (
        <p className="mt-4 text-center text-body-md text-text-secondary">
          New to Sparetime?{" "}
          <Link
            href="/phone"
            replace
            onNavigate={markNav("forward")}
            className="inline-flex min-h-[48px] items-center font-semibold text-action-primary underline underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      )}
    </StepShell>
  );
}
