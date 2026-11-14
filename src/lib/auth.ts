import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  // Eligibility status. For the MVP this lives in the account's
  // app_metadata (only admins can change it). If we move it to a
  // profiles table later, only this file needs to change.
  verified: boolean;
};

// Returns the signed-in user, or null if nobody is signed in.
// Reads cookies, so call it from inside a <Suspense> boundary.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;

  const claims = data.claims;
  return {
    id: claims.sub,
    email: claims.email ?? "",
    verified: claims.app_metadata?.verified === true,
  };
}
