"use client";

import { useRef, useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { nearestNeighborhood } from "@/lib/neighborhoods";

// O5l · Use your location. Explains why first (Figma copy), then the browser
// asks for permission. We fill in the nearest neighborhood name only — the
// coordinates are not saved or sent anywhere.
export function LocationSheet({
  open,
  onClose,
  onArea,
}: {
  open: boolean;
  onClose: () => void;
  onArea: (area: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "finding" | "error" | "outside">("idle");
  // Each opening gets a new "attempt"; results from an attempt the person already
  // dismissed (e.g. "Not now" while finding) are ignored.
  const attempt = useRef(0);
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setStatus("idle");
  }

  const close = () => {
    attempt.current += 1;
    onClose();
  };

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }
    setStatus("finding");
    const mine = ++attempt.current;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (mine !== attempt.current) return;
        const name = nearestNeighborhood(pos.coords.latitude, pos.coords.longitude);
        if (!name) {
          setStatus("outside");
          return;
        }
        setStatus("idle");
        onArea(name);
        close();
      },
      () => {
        if (mine === attempt.current) setStatus("error");
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  };

  return (
    <BottomSheet open={open} onClose={close} title="Use your location?">
      <p className="mt-3 text-body-lg text-text-secondary">
        We use it once to fill in your area. We don&apos;t track you in the background, and we only keep the
        neighborhood name.
      </p>
      {status === "error" && (
        <p role="alert" className="mt-3 rounded-lg bg-danger-surface px-4 py-3 text-body-md text-on-tint-danger">
          We couldn&apos;t get your location. Type your neighborhood or ZIP code instead.
        </p>
      )}
      {status === "outside" && (
        <p role="alert" className="mt-3 rounded-lg bg-surface-muted px-4 py-3 text-body-md text-text-primary">
          You look outside our LA County pilot area. Type the neighborhood or ZIP code you&apos;d like offers near.
        </p>
      )}
      <div className="mt-5 flex flex-col items-center gap-1">
        <Button fullWidth onClick={locate} loading={status === "finding"} loadingLabel="Finding you…">
          Use my location
        </Button>
        <Button variant="text" onClick={close}>
          Not now
        </Button>
      </div>
    </BottomSheet>
  );
}
