"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { deleteAccount } from "@/lib/account";

// Delete account: destructive, so it asks first (title says what happens, safe
// choice focused). Confirming really erases this person's account on this phone
// and goes back to Welcome, which says it was deleted.
export function DeleteAccount() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <section aria-labelledby="delete-title" className="mt-3 rounded-lg border border-border-default p-4">
      <h2 id="delete-title" className="text-title-sm text-text-primary">
        Delete account
      </h2>
      <p className="mt-1 text-body-md text-text-secondary">
        Permanently deletes your account and everything saved with it on this phone.
      </p>
      <Button variant="destructive" fullWidth className="mt-3 border border-danger-primary" onClick={() => setOpen(true)}>
        Delete account
      </Button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Delete your account?">
        <p className="mt-3 text-body-lg text-text-secondary">
          Your bookings, savings, favorites and settings will be deleted from this phone. You can&apos;t undo this.
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
              deleteAccount();
              router.replace("/welcome");
            }}
          >
            Delete account
          </Button>
        </div>
      </BottomSheet>
    </section>
  );
}
