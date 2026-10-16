import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Refresh the Supabase Auth session (no-op when credentials are missing or
  // the user is not signed in). This keeps server-rendered auth state fresh.
  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Do not run code between createServerClient and getClaims().
    await supabase.auth.getClaims();
  }

  // Let next-intl handle locale detection and routing.
  const response = handleI18nRouting(request);

  // Carry over any refreshed session cookies onto the final response.
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie);
  });

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except:
    // - paths starting with /api, /trpc, /_next, /_vercel
    // - paths containing a dot (e.g. favicon.ico)
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
