"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepShell } from "@/components/onboarding/step-shell";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";

// O5 · About you. Step 5 of 5 (last step). First name, area/ZIP, and what they need
// (multi-select). "Confirm & browse" opens the main app.
const NEEDS = ["Haircuts", "Laundry", "Clothing care"];

export default function AboutPage() {
  const router = useRouter();
  const [needs, setNeeds] = useState<string[]>(["Haircuts", "Laundry"]);

  const toggle = (n: string) =>
    setNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  return (
    <StepShell
      step={5}
      onBack={() => router.push("/timing")}
      action={<Button fullWidth onClick={() => router.push("/deals")}>Confirm &amp; browse</Button>}
    >
      <h1 className="text-headline-lg text-text-heading">About you</h1>

      <div className="mt-6">
        <TextField label="First name" defaultValue="Dana" autoComplete="given-name" helper="So the business knows who to expect." />
      </div>

      <div className="mt-5">
        <TextField
          label="Area or ZIP code"
          defaultValue="Downtown LA"
          trailing={<Icon name="map-pin" size={22} className="text-action-primary" />}
          helper="Type a neighborhood or ZIP code. We serve a set list of LA County neighborhoods."
        />
      </div>

      <h2 className="mt-6 text-title-sm text-text-heading">What do you need?</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {NEEDS.map((n) => (
          <Chip key={n} selected={needs.includes(n)} onClick={() => toggle(n)}>{n}</Chip>
        ))}
      </div>
      <p className="mt-2 text-body-sm text-text-secondary">We&rsquo;ll show these first. You can still browse everything.</p>
    </StepShell>
  );
}
