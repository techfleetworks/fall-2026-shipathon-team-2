"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepShell } from "@/components/onboarding/step-shell";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { TextField } from "@/components/ui/text-field";
import { Icon } from "@/components/ui/icon";

// O4 · When works. Step 4 of 5 · optional. Rough timing chips, plus an optional
// exact date. Everyone can skip.
const WHENS = ["Today", "This week", "Weekends", "Weekday evenings", "Whenever I'm free"];

export default function TimingPage() {
  const router = useRouter();
  const [when, setWhen] = useState("This week");

  return (
    <StepShell
      step={4}
      onBack={() => router.push("/reason")}
      action={
        <div className="flex flex-col gap-1">
          <Button fullWidth onClick={() => router.push("/about")}>Continue</Button>
          <Button variant="text" fullWidth onClick={() => router.push("/about")}>Skip for now</Button>
        </div>
      }
    >
      <h1 className="text-headline-lg text-text-heading">When are you free?</h1>
      <p className="mt-2 text-body-lg text-text-secondary">
        We&rsquo;ll show open slots that fit. You can change this any time.
      </p>

      <h2 className="mt-6 text-title-sm text-text-heading">Roughly when</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {WHENS.map((w) => (
          <Chip key={w} selected={when === w} onClick={() => setWhen(w)}>{w}</Chip>
        ))}
      </div>

      <h2 className="mt-7 text-title-sm text-text-heading">Have a date in mind?</h2>
      <div className="mt-2">
        <TextField
          label="Exact date · optional"
          placeholder="Choose a date"
          readOnly
          trailing={<Icon name="calendar" size={22} className="text-text-secondary" />}
          helper="We'll show slots before this date."
        />
      </div>
    </StepShell>
  );
}
