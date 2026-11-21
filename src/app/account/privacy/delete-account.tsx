"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";

// Delete account: destructive, so it asks first (title says what happens, safe
// choice focused). Demo: confirming shows the request status; nothing is stored.
export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  return (
    <section aria-labelledby="delete-title" className="mt-3 rounded-lg border border-border-default p-4">
      <h2 id="delete-title" className="text-title-sm text-text-primary">
        Delete account
      </h2>
      {requested ? (
        <>
          <p role="status" className="mt-1 text-body-md text-text-secondary">
            Your account is scheduled for deletion. We remove your data within 30 days.
          </p>
          <ButtonLink href="/welcome" variant="outlined" fullWidth className="mt-3">
            Back to start
          </ButtonLink>
        </>
      ) : (
        <>
          <p className="mt-1 text-body-md text-text-secondary">
            Permanently deletes your account. We remove your data within 30 days.
          </p>
          <Button variant="destructive" fullWidth className="mt-3 border border-danger-primary" onClick={() => setOpen(true)}>
            Delete account
          </Button>
        </>
      )}

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Delete your account?">
        <p className="mt-3 text-body-lg text-text-secondary">
          Your bookings, savings and favorites will be removed within 30 days. You can&apos;t undo this.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Button fullWidth autoFocus onClick={() => setOpen(false)}>
            Keep my account
          </Button>
          <Button
            variant="destructive"
            fullWidth
            className="border border-danger-primary"
            onClick={() => {
              setOpen(false);
              setRequested(true);
            }}
          >
            Delete account
          </Button>
        </div>
      </BottomSheet>
    </section>
  );
}
