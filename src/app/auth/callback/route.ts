import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routing, type Locale } from "@/i18n/routing";

function resolveLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && routing.locales.includes(cookie as Locale)) {
    return cookie as Locale;
  }
  return routing.defaultLocale;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const locale = resolveLocale(request);
  const successUrl = new URL(`/${locale}/diary`, origin);
  const errorUrl = new URL(`/${locale}/login`, origin);

  // PKCE flow: the confirmation link redirects back with a `code` that must be
  // exchanged for a session. The browser already holds the PKCE verifier in a
  // cookie, so the server client can complete the exchange.
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(successUrl);
    }
  }

  // Implicit flow (token_hash template): exchange the one-time token for a
  // session via verifyOtp. Only used if the email template was customized to
  // point at this route with `token_hash` and `type` query params.
  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(successUrl);
    }
  }

  // Invalid or already-used code/token: send the user back to the login page.
  return NextResponse.redirect(errorUrl);
}
