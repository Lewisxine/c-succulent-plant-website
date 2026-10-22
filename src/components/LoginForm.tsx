"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

export default function LoginForm() {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);

  // If the user is already signed in (e.g. they landed on /login directly, or
  // a server redirect bounced them back here), send them to their diary.
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(`/${locale}/diary`);
      router.refresh();
    }
  }, [authLoading, user, locale, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (mode === "signUp") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) {
        setError(t("error"));
      } else if (data.session) {
        // Email confirmation is disabled, so the user is signed in immediately.
        router.push(`/${locale}/diary`);
        router.refresh();
      } else {
        // Email confirmation is required — show a dedicated confirmation screen.
        setConfirmationEmail(email);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(t("error"));
      } else {
        router.push(`/${locale}/diary`);
        router.refresh();
      }
    }

    setSubmitting(false);
  }

  if (confirmationEmail) {
    return (
      <div className="space-y-6 py-2 text-center">
        <div className="text-5xl" aria-hidden>
          📬
        </div>
        <h2 className="text-xl font-bold text-leaf-800">{t("confirmTitle")}</h2>
        <p className="text-leaf-600">
          {t("confirmMessage", { email: confirmationEmail })}
        </p>
        <button
          type="button"
          onClick={() => {
            setConfirmationEmail(null);
            setMode("signIn");
            setError(null);
          }}
          className="w-full rounded-full bg-leaf-500 px-6 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-leaf-600"
        >
          {t("backToLogin")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-full bg-leaf-100 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("signIn");
            setError(null);
          }}
          className={`rounded-full py-2 text-sm font-semibold transition-colors ${
            mode === "signIn" ? "bg-white text-leaf-700 shadow-sm" : "text-leaf-600"
          }`}
        >
          {t("signInTitle")}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signUp");
            setError(null);
          }}
          className={`rounded-full py-2 text-sm font-semibold transition-colors ${
            mode === "signUp" ? "bg-white text-leaf-700 shadow-sm" : "text-leaf-600"
          }`}
        >
          {t("signUpTitle")}
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-leaf-700">
          {t("email")}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-2xl border-2 border-leaf-200 bg-white px-4 py-3 text-leaf-800 focus:border-leaf-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-leaf-700">
          {t("password")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full rounded-2xl border-2 border-leaf-200 bg-white px-4 py-3 text-leaf-800 focus:border-leaf-400 focus:outline-none"
        />
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-leaf-500 px-6 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-leaf-600 disabled:opacity-60"
      >
        {mode === "signIn" ? t("signIn") : t("signUp")}
      </button>

      <p className="text-center text-sm text-leaf-600">
        {mode === "signIn" ? t("switchingToSignUp") : t("switchingToSignIn")}
      </p>
    </form>
  );
}
