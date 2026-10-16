"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import LanguageSwitcher from "./LanguageSwitcher";

type User = { email?: string } | null;

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
  }

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/plants", label: t("nav.plants") },
    { href: "/diary", label: t("nav.diary") },
    { href: "/about", label: t("nav.about") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-leaf-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-leaf-700">
          <span className="text-3xl" aria-hidden>
            🌵
          </span>
          <span className="text-lg font-bold tracking-tight">
            {t("common.siteName")}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-sun-200 text-leaf-800"
                  : "text-leaf-700 hover:bg-leaf-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/diary/new"
                className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-leaf-600"
              >
                {t("nav.writeDiary")}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-leaf-200 px-4 py-2 text-sm font-medium text-leaf-700 transition-colors hover:bg-leaf-100"
              >
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-leaf-600 md:inline-block"
            >
              {t("nav.login")}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2 text-leaf-700 hover:bg-leaf-100 md:hidden"
            aria-label="Menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-leaf-100 bg-cream px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-sun-200 text-leaf-800"
                    : "text-leaf-700 hover:bg-leaf-100"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-leaf-100 pt-3">
              {user ? (
                <>
                  <Link
                    href="/diary/new"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl bg-leaf-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    {t("nav.writeDiary")}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl border border-leaf-200 px-4 py-2.5 text-sm font-medium text-leaf-700"
                  >
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-leaf-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
