"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { maskPhone, updateProfile, useProfile } from "@/lib/account";

// First name edits inline and is saved to the person's account on this device.
// Changing the phone needs the text-a-code flow again, which isn't wired here yet.
export function DetailsForm() {
  const profile = useProfile();
  const name = profile?.firstName ?? "";
  const phone = profile?.phone ?? "";
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const error = draft.trim() === "" ? "Enter your first name." : undefined;

  return (
    <div className="mt-4 divide-y divide-border-default rounded-lg border border-border-default">
      <div className="p-4">
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (error) return;
              updateProfile({ firstName: draft.trim() });
              setEditing(false);
              setSaved(true);
            }}
            className="flex flex-col gap-3"
          >
            <TextField
              label="First name"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              helper="The shop uses it to know who to expect."
              error={error}
              autoComplete="given-name"
              autoFocus
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={!!error}>
                Save
              </Button>
              <Button
                type="button"
                variant="text"
                onClick={() => {
                  setDraft(name);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-label-md text-text-secondary">First name</p>
              <p className="text-body-lg text-text-primary">{name || "Not set yet"}</p>
              <p className="text-body-sm text-text-secondary">The shop uses it to know who to expect.</p>
              {saved && (
                <p role="status" className="mt-1 text-body-sm text-on-tint-positive">
                  Saved
                </p>
              )}
            </div>
            <Button
              variant="text"
              className="px-4!"
              onClick={() => {
                setDraft(name);
                setSaved(false);
                setEditing(true);
              }}
            >
              Edit<span className="sr-only"> first name</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-label-md text-text-secondary">Phone number</p>
          <p className="text-body-lg text-text-primary">
            {phone ? (
              <>
                <span className="sr-only">Ending in {phone.slice(-2)}</span>
                <span aria-hidden="true">{maskPhone(phone)}</span>
              </>
            ) : (
              "Not set yet"
            )}
          </p>
          <p className="text-body-sm text-text-secondary">We&apos;ll text a code to your new number to confirm it.</p>
        </div>
        <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-label-sm text-text-secondary">Soon</span>
      </div>
    </div>
  );
}
