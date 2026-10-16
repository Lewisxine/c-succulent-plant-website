import { setRequestLocale, getTranslations } from "next-intl/server";
import PlantsExplorer from "@/components/PlantsExplorer";

export default async function PlantsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("plants");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <div className="text-4xl" aria-hidden>
          🪴
        </div>
        <h1 className="mt-2 text-3xl font-bold text-leaf-800">{t("title")}</h1>
        <p className="mt-2 text-leaf-600/70">{t("subtitle")}</p>
      </header>
      <PlantsExplorer locale={locale} />
    </div>
  );
}
