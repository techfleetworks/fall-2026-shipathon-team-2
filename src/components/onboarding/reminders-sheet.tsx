"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Switch, SwitchVisual } from "@/components/ui/switch";
import { updateProfile, useProfile } from "@/lib/account";

// O5b · Booking reminders. Asked once, right after the first booking. "Turn on
// reminders" also asks the browser for permission to show notifications; the
// in-app reminder card works either way. Booking texts and offer alerts are
// optional and stay off unless switched on (both changeable in Settings). This
// is where booking texts are offered — the phone screens only send the code.
export function RemindersSheet({ open, onDone }: { open: boolean; onDone: () => void }) {
  const [offers, setOffers] = useState(false);
  const [texts, setTexts] = useState(false);
  const profile = useProfile();
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
    updateProfile({ reminders: true, offerAlerts: offers, bookingTexts: texts });
    setBusy(false);
    onDone();
  };

  return (
    <BottomSheet
      open={open}
      onClose={() => {
        updateProfile({ reminders: false, offerAlerts: false, bookingTexts: false });
        onDone();
      }}
      title="Get a reminder before each booking?"
    >
      <p className="mt-3 text-body-lg text-text-secondary">
        We&apos;ll send one notification an hour before your slot. No promotions unless you turn them on below.
      </p>

      {/* Optional booking texts. The whole row is the switch. */}
      <button
        type="button"
        role="switch"
        aria-checked={texts}
        onClick={() => setTexts((v) => !v)}
        className="mt-3 flex min-h-[56px] w-full items-center gap-3 rounded-lg border border-border-default p-4 text-left hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        <span className="flex-1">
          <span className="block text-title-sm text-text-primary">Also send booking texts</span>
          <span className="block text-body-sm text-text-secondary">
            Confirmations and reminders{profile?.phone ? ` to ${profile.phone}` : ""} · optional
          </span>
        </span>
        <SwitchVisual checked={texts} />
      </button>
      {texts && (
        <p className="mt-2 px-1 text-body-sm text-text-secondary">
          Message frequency varies. Message and data rates may apply. Reply STOP to opt out.
        </p>
      )}

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
            updateProfile({ reminders: false, offerAlerts: false, bookingTexts: false });
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
