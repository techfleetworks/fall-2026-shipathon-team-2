"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHydrated, useProfile } from "@/lib/account";

// Sign-up steps 3–5 need a verified phone number first. If someone lands here
// directly (bookmark, back button after logging out), send them to step 1.
export function useRequirePhone() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useProfile();
  useEffect(() => {
    if (hydrated && !profile) router.replace("/phone");
  }, [hydrated, profile, router]);
  return profile;
}
