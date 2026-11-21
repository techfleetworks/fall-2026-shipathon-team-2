"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { clearAccount, maskPhone, useProfile } from "@/lib/account";

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

// Log out forgets everything saved on this device and returns to Welcome, so
// the next person (or the next demo run) starts clean.
export function LogOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        clearAccount();
        router.push("/welcome");
      }}
      className="inline-flex min-h-[48px] items-center rounded-full px-6 text-label-lg text-action-primary hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      Log out
    </button>
  );
}
