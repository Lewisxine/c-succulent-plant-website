import { setRequestLocale, getTranslations } from "next-intl/server";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
