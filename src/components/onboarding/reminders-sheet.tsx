"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SparetimeLogo } from "@/components/brand/logo";
import { updateProfile } from "@/lib/account";

// O5b · Booking reminders. Asked once, after About you. "Turn on reminders"
// also asks the browser for permission to show notifications; the in-app
// reminder card works either way. Offer alerts stay off unless switched on.
export function RemindersSheet({ open, onDone }: { open: boolean; onDone: () => void }) {
  const [offers, setOffers] = useState(false);
  const [busy, setBusy] = useState(false);

  const turnOn = async () => {
    setBusy(true);
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        await Notification.requestPermission();
      }
    } catch {
      /* permission prompt not available: in-app reminders still work */
    }
    updateProfile({ reminders: true, offerAlerts: offers });
    setBusy(false);
    onDone();
  };

  return (
    <BottomSheet
      open={open}
      onClose={() => {
        updateProfile({ reminders: false, offerAlerts: false });
        onDone();
      }}
      title="Get a reminder before each booking?"
    >
      <p className="mt-3 text-body-lg text-text-secondary">
        We&apos;ll send one notification an hour before your slot. No promotions unless you turn them on below.
      </p>

      <div aria-hidden="true" className="mt-4 flex items-start gap-3 rounded-lg bg-surface-muted p-3">
        <SparetimeLogo size={28} />
        <div className="min-w-0 flex-1">
          <p className="flex justify-between text-label-sm text-text-secondary">
            <span>Sparetime</span>
            <span>1 hour before</span>
          </p>
          <p className="text-title-sm text-text-primary">Your haircut is in 1 hour</p>
          <p className="text-body-sm text-text-secondary">Example reminder</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-lg border border-border-default p-4">
        <div className="flex-1">
          <p className="text-title-sm text-text-primary">Also tell me about new offers</p>
          <p className="text-body-sm text-text-secondary">Near you, up to 1 a day · optional</p>
        </div>
        <Switch label="Also tell me about new offers" checked={offers} onChange={setOffers} />
      </div>

      <div className="mt-4 flex flex-col items-center gap-1">
        <Button fullWidth onClick={turnOn} loading={busy} loadingLabel="Turning on…">
          Turn on reminders
        </Button>
        <Button
          variant="text"
          onClick={() => {
            updateProfile({ reminders: false, offerAlerts: false });
            onDone();
          }}
        >
          Not now
        </Button>
        <p className="mt-1 text-body-sm text-text-secondary">You can change this any time in Settings.</p>
      </div>
    </BottomSheet>
  );
}
