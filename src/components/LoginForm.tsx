"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (mode === "signUp") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(t("error"));
      } else if (data.session) {
        router.push("/diary");
        router.refresh();
      } else {
        setMessage(t("checkEmail"));
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(t("error"));
      } else {
        router.push("/diary");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-full bg-leaf-100 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("signIn");
            setError(null);
            setMessage(null);
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
            setMessage(null);
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

      {message && (
        <p className="rounded-2xl bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
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
