"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepShell } from "@/components/onboarding/step-shell";
import { Button } from "@/components/ui/button";
import { RadioCard } from "@/components/ui/choice";
import { updateProfile } from "@/lib/account";
import { useRequirePhone } from "@/components/onboarding/use-require-phone";
import { go } from "@/lib/nav-motion";

// O3 · What brings you here. Step 3 of 5. One tap, no proof; nothing pre-picked.
// Every answer leads to the same optional timing step.
const OPTIONS = [
  { key: "job", title: "Getting ready for a job", subtitle: "Interview, first day, or still searching" },
  { key: "saving", title: "Saving money", subtitle: "Haircuts, laundry and clothing care" },
  { key: "browsing", title: "Just looking around", subtitle: "Browse offers before you decide" },
];

export default function ReasonPage() {
  const router = useRouter();
  const profile = useRequirePhone();
  const [choice, setChoice] = useState<string | null>(profile?.reason ?? null);

  return (
    <StepShell
      step={3}
      onBack={() => go(router, "/phone", "back")}
      action={
        <Button
          fullWidth
          disabled={!choice}
          onClick={() => {
            updateProfile({ reason: choice });
            go(router, "/timing", "forward");
          }}
        >
          Continue
        </Button>
      }
    >
      <h1 id="reason-title" className="text-headline-lg text-text-heading">What brings you here?</h1>
      <p className="mt-2 text-body-lg text-text-secondary">Pick one. We&rsquo;ll use it to sort your offers.</p>

      <div role="radiogroup" aria-labelledby="reason-title" className="mt-6 flex flex-col gap-3">
        {OPTIONS.map((o) => (
          <RadioCard
            key={o.key}
            title={o.title}
            subtitle={o.subtitle}
            checked={choice === o.key}
            onChange={() => setChoice(o.key)}
          />
        ))}
      </div>
    </StepShell>
  );
}
