import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  // Eligibility status, read from profiles.verified (data contract).
  // Users cannot change it themselves; only complete_verification() sets it.
  verified: boolean;
};

// Returns the signed-in user, or null if nobody is signed in.
// Reads cookies, so call it from inside a <Suspense> boundary.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;

  const claims = data.claims;

  // A user who hasn't created a profile yet has no row, so they count as not verified.
  const { data: profile } = await supabase
    .from("profiles")
    .select("verified")
    .eq("id", claims.sub)
    .maybeSingle();

  return {
    id: claims.sub,
    email: claims.email ?? "",
    verified: profile?.verified === true,
  };
}
