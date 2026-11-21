"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepShell } from "@/components/onboarding/step-shell";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { updateProfile } from "@/lib/account";
import { useRequirePhone } from "@/components/onboarding/use-require-phone";

// O5 · About you. Step 5 of 5 (last step). First name, area/ZIP, and what they
// need (multi-select). All start empty; "Confirm & browse" opens the main app
// once all three are filled in.
const NEEDS = ["Haircuts", "Laundry", "Clothing care"];

export default function AboutPage() {
  const router = useRouter();
  const profile = useRequirePhone();
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [area, setArea] = useState(profile?.area ?? "");
  const [needs, setNeeds] = useState<string[]>(profile?.needs ?? []);

  const toggle = (n: string) =>
    setNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  const missing = [
    !firstName.trim() && "your first name",
    !area.trim() && "your area",
    needs.length === 0 && "at least one service",
  ].filter(Boolean) as string[];
  const ready = missing.length === 0;

  return (
    <StepShell
      step={5}
      onBack={() => router.push("/timing")}
      action={
        <div className="flex flex-col gap-2">
          {!ready && (
            <p className="text-center text-body-sm text-text-secondary">
              Add {missing.join(", ").replace(/, ([^,]*)$/, " and $1")} to continue.
            </p>
          )}
          <Button
            fullWidth
            disabled={!ready}
            onClick={() => {
              updateProfile({ firstName: firstName.trim(), area: area.trim(), needs });
              router.push("/deals");
            }}
          >
            Confirm &amp; browse
          </Button>
        </div>
      }
    >
      <h1 className="text-headline-lg text-text-heading">About you</h1>

      <div className="mt-6">
        <TextField
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Your first name"
          autoComplete="given-name"
          helper="So the business knows who to expect."
        />
      </div>

      <div className="mt-5">
        <TextField
          label="Area or ZIP code"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Neighborhood or ZIP code"
          autoComplete="postal-code"
          trailing={<Icon name="map-pin" size={22} className="text-action-primary" />}
          helper="Type a neighborhood or ZIP code. We serve a set list of LA County neighborhoods."
        />
      </div>

      <h2 className="mt-6 text-title-sm text-text-heading">What do you need?</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {NEEDS.map((n) => (
          <Chip key={n} selected={needs.includes(n)} onClick={() => toggle(n)}>
            {n}
          </Chip>
        ))}
      </div>
      <p className="mt-2 text-body-sm text-text-secondary">We&rsquo;ll show these first. You can still browse everything.</p>
    </StepShell>
  );
}
