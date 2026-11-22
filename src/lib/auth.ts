import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
};

// Returns the signed-in user, or null if nobody is signed in.
// Reads cookies, so call it from inside a <Suspense> boundary.
// Verification was removed from the off-peak model (data contract v2), so this
// no longer reads profiles.verified.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;

  const claims = data.claims;
  return {
    id: claims.sub,
    email: claims.email ?? "",
  };
}
