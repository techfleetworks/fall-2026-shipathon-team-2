import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase client for Server Components, Server Functions and Route Handlers.
// Runs on the server. Create a new one per request; don't share it.
//
// Note: this project has Cache Components enabled. A page that calls this
// reads cookies, so wrap the part that uses it in <Suspense>.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components can't set cookies. This is safe to ignore
            // until sign-in is added; then a proxy.ts will refresh sessions.
          }
        },
      },
    },
  );
}
