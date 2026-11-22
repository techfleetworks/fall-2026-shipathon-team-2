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
import { LocationSheet } from "@/components/onboarding/location-sheet";
import { go } from "@/lib/nav-motion";

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
  const [locationOpen, setLocationOpen] = useState(false);

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
      onBack={() => go(router, "/timing", "back")}
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
              // Reminders are asked after the first booking (not during sign-up).
              go(router, "/deals", "forward");
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
          trailing={
            <button
              type="button"
              onClick={() => setLocationOpen(true)}
              aria-label="Use my location"
              className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-full text-action-primary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <Icon name="map-pin" size={22} />
            </button>
          }
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
      <p className="mt-2 text-body-sm text-text-secondary">
        <span className="font-bold text-text-primary">Laundry</span> is wash &amp; fold.{" "}
        <span className="font-bold text-text-primary">Clothing care</span> is pressing &amp; dry cleaning.
      </p>

      <LocationSheet open={locationOpen} onClose={() => setLocationOpen(false)} onArea={setArea} />
    </StepShell>
  );
}
