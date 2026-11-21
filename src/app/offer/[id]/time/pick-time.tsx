"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Screen, ScreenBody, AppBar, BottomActionBar } from "@/components/ui/screen";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";

type SlotRow = { t: string; left?: string; booked?: boolean };
const DAY_SLOTS: SlotRow[] = [
  { t: "2:00 pm", left: "1 left" },
  { t: "2:30 pm", left: "1 left" },
  { t: "3:00 pm", booked: true },
  { t: "3:30 pm", booked: true },
];

export function PickTime({
  serviceId,
  businessName,
  serviceName,
  price,
}: {
  serviceId: string;
  businessName: string;
  serviceName: string;
  price: number;
}) {
  const router = useRouter();
  const [day, setDay] = useState("Tue 24");
  const [slot, setSlot] = useState("2:30 pm");

  return (
    <Screen>
      <AppBar title="Pick a time" onBack={() => router.push(`/offer/${serviceId}`)} />
      <ScreenBody>
        <p className="text-body-lg text-text-secondary">
          {businessName} will have your chair ready for the slot you pick.
        </p>

        <div className="mt-4 flex gap-2">
          {["Today", "Mon 23", "Tue 24"].map((d) => (
            <Chip key={d} selected={day === d} onClick={() => setDay(d)}>{d}</Chip>
          ))}
        </div>

        <p className="mt-5 text-title-sm text-text-heading">{day} · 30-minute slots</p>
        <div className="mt-3 flex flex-col gap-2" role="radiogroup">
          {DAY_SLOTS.map((s) =>
            s.booked ? (
              <div
                key={s.t}
                aria-disabled
                className="flex items-center justify-between rounded-lg border border-dashed border-border-default px-4 py-4 text-text-secondary"
              >
                <span className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full border-2 border-border-default" />
                  <span className="text-body-lg">{s.t}</span>
                </span>
                <span className="text-body-md">Booked</span>
              </div>
            ) : (
              <button
                key={s.t}
                type="button"
                role="radio"
                aria-checked={slot === s.t}
                onClick={() => setSlot(s.t)}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-4 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                  slot === s.t ? "border-action-primary ring-1 ring-action-primary" : "border-border-default hover:bg-surface-muted",
                )}
              >
                <span className="flex items-center gap-3">
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border-2", slot === s.t ? "border-action-primary" : "border-border-control")}>
                    {slot === s.t && <span className="h-3 w-3 rounded-full bg-action-primary" />}
                  </span>
                  <span className="text-body-lg text-text-primary">{s.t}</span>
                </span>
                <span className="text-body-md text-text-secondary">{s.left}</span>
              </button>
            ),
          )}
        </div>

        <p className="mt-4 text-title-sm text-text-heading">{businessName} will expect you Tuesday at {slot}.</p>
      </ScreenBody>

      <BottomActionBar>
        <p className="mb-2 text-center text-body-sm text-text-secondary">{serviceName} · ${price} · cash at the shop</p>
        <Button fullWidth onClick={() => router.push("/confirm")}>Continue</Button>
      </BottomActionBar>
    </Screen>
  );
}
