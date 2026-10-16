import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getSucculent, succulents, type LightLevel } from "@/lib/plants";
import { localized } from "@/lib/i18n";
import { routing } from "@/i18n/routing";

const lightKey: Record<LightLevel, string> = {
  full: "lightFull",
  partial: "lightPartial",
  low: "lightLow",
};

const difficultyKey = {
  easy: "difficultyEasy",
  medium: "difficultyMedium",
  hard: "difficultyHard",
} as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    succulents.map((s) => ({ locale, slug: s.slug }))
  );
}

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const plant = getSucculent(slug);
  if (!plant) notFound();

  const t = await getTranslations("plants");
  const tc = await getTranslations("common");

  const infoSections = [
    { icon: "🏠", title: t("environment"), body: localized(plant.environment, locale) },
    { icon: "🌡️", title: t("temperature"), body: localized(plant.temperature, locale) },
    { icon: "💧", title: t("watering"), body: localized(plant.watering, locale) },
    { icon: "🔁", title: t("growthCycle"), body: localized(plant.growthCycle, locale) },
    { icon: "🧤", title: t("care"), body: localized(plant.care, locale) },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href={`/${locale}/plants`}
        className="mb-6 inline-block rounded-full px-4 py-2 text-sm font-medium text-leaf-600 transition-colors hover:bg-leaf-100"
      >
        ← {tc("backToList")}
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-3xl border border-leaf-100 bg-cream-100 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plant.image}
            alt={localized(plant.commonName, locale)}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Core info */}
        <div>
          <h1 className="text-3xl font-bold text-leaf-800 md:text-4xl">
            {localized(plant.commonName, locale)}
          </h1>
          <p className="mt-1 text-lg italic text-leaf-600/80">
            {plant.scientificName}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-sun-100 px-3 py-1 text-sm font-medium text-sun-700">
              {t("family")}：{localized(plant.family, locale)}
            </span>
            <span className="rounded-full bg-leaf-100 px-3 py-1 text-sm font-medium text-leaf-700">
              {t("genus")}：{plant.genus}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-leaf-200 px-3 py-1 text-sm text-leaf-700">
              ☀️ {t(lightKey[plant.light])}
            </span>
            <span className="rounded-full border border-leaf-200 px-3 py-1 text-sm text-leaf-700">
              🌱 {t(difficultyKey[plant.difficulty])}
            </span>
          </div>

          <p className="mt-5 leading-relaxed text-leaf-700/90">
            {localized(plant.description, locale)}
          </p>
        </div>
      </div>

      {/* Info sections */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {infoSections.map((section) => (
          <div
            key={section.title}
            className="rounded-3xl border border-leaf-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>
                {section.icon}
              </span>
              <h2 className="font-bold text-leaf-800">{section.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-leaf-700/80">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
