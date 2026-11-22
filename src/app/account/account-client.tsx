"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { resetDevice, signOut, maskPhone, useProfile } from "@/lib/account";

// Profile card: the person's own first name and masked phone (from sign-up).
export function ProfileCard() {
  const profile = useProfile();
  const name = profile?.firstName || "Your account";
  const phone = profile?.phone;

  return (
    <Link
      href="/account/details"
      className="mt-5 flex items-center gap-3 rounded-lg border border-border-default px-4 py-3 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-subtle text-title-md text-on-tint-primary"
      >
        {profile?.firstName ? profile.firstName[0].toUpperCase() : <Icon name="user" size={22} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-title-sm text-text-primary">{name}</span>
        <span className="block text-body-md text-text-secondary">
          {phone ? (
            <>
              <span className="sr-only">Your details, phone ending in {phone.slice(-2)}</span>
              <span aria-hidden="true">{maskPhone(phone)}</span>
            </>
          ) : (
            "Your details"
          )}
        </span>
      </span>
      <Icon name="chevron-right" size={20} className="text-text-secondary" />
    </Link>
  );
}

// Log out ends the session and returns to Welcome. The account stays saved
// under its phone number, so signing back in restores it. "Start fresh" is the
// deliberate wipe for handing a shared demo phone to the next person.
export function AccountActions() {
  const router = useRouter();

  const startFresh = () => {
    const ok = window.confirm(
      "Start fresh on this device?\n\nThis erases every account saved in this browser — for handing a demo phone to the next person. It can't be undone.",
    );
    if (!ok) return;
    resetDevice();
    router.push("/welcome");
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => {
          signOut();
          router.push("/welcome");
        }}
        className="inline-flex min-h-[48px] items-center rounded-full px-6 text-label-lg text-action-primary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        Log out
      </button>
      <button
        type="button"
        onClick={startFresh}
        className="inline-flex min-h-[48px] items-center rounded-full px-6 text-body-sm text-text-secondary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        Start fresh on this device
      </button>
    </div>
  );
}
