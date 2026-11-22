import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Runs before every page request. Its only job is to refresh the Supabase
// sign-in session so users stay signed in. The demo doesn't use Supabase auth
// yet (data is on this device — see ADR-0006), so if the keys aren't configured
// in this environment, or the refresh fails, we pass the request through
// untouched instead of erroring. Without this guard a missing key on the host
// (e.g. Vercel) would throw here and 500 every page.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          // Stops CDNs from caching one user's session for another.
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    });

    // Checks the session and refreshes it if it's about to expire.
    await supabase.auth.getClaims();
  } catch {
    // Supabase unreachable or misconfigured: don't block the page.
    return NextResponse.next({ request });
  }

  return response;
}

export const config = {
  // Skip static files and images.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
