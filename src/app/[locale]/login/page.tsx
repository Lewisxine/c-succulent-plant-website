import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import LoginForm from "@/components/LoginForm";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default function LoginPage({ params }: LoginPageProps) {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent params={params} />
    </Suspense>
  );
}

async function LoginPageContent({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("login");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <header className="mb-6 text-center">
        <div className="text-5xl" aria-hidden>
          🌵
        </div>
        <h1 className="mt-2 text-3xl font-bold text-leaf-800">{t("title")}</h1>
        <p className="mt-1 text-leaf-600/70">{t("subtitle")}</p>
      </header>
      <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}

function LoginPageFallback() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <header className="mb-6 text-center">
        <div className="text-5xl" aria-hidden>
          🌵
        </div>
        <div className="mx-auto mt-2 h-8 w-40 animate-pulse rounded-full bg-leaf-100" />
        <div className="mx-auto mt-1 h-4 w-56 animate-pulse rounded-full bg-leaf-100/70" />
      </header>
      <div className="space-y-4 rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
        <div className="h-10 animate-pulse rounded-full bg-leaf-100" />
        <div className="h-12 animate-pulse rounded-2xl bg-leaf-100/70" />
        <div className="h-12 animate-pulse rounded-2xl bg-leaf-100/70" />
        <div className="h-12 animate-pulse rounded-full bg-leaf-100/70" />
      </div>
    </div>
  );
}
