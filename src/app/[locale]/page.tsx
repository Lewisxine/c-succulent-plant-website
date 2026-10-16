import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { succulents } from "@/lib/plants";
import PlantCard from "@/components/PlantCard";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const featured = succulents.slice(0, 6);

  const difficultyLabels = {
    easy: t("plants.difficultyEasy"),
    medium: t("plants.difficultyMedium"),
    hard: t("plants.difficultyHard"),
  };

  const features = [
    { emoji: "🪴", title: t("home.featurePlantsTitle"), desc: t("home.featurePlantsDesc") },
    { emoji: "📔", title: t("home.featureDiaryTitle"), desc: t("home.featureDiaryDesc") },
    { emoji: "🌍", title: t("home.featureLangTitle"), desc: t("home.featureLangDesc") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-leaf-100 via-cream to-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
          <span className="text-6xl" aria-hidden>
            🌵
          </span>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-leaf-800 md:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="text-lg font-medium text-sun-600">
            {t("home.heroSubtitle")}
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-leaf-700/80">
            {t("home.heroDescription")}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${locale}/plants`}
              className="rounded-full bg-leaf-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-leaf-600"
            >
              {t("home.ctaPlants")} →
            </Link>
            <Link
              href={`/${locale}/diary`}
              className="rounded-full bg-sun-300 px-6 py-3 font-semibold text-leaf-800 shadow-md transition-colors hover:bg-sun-400"
            >
              ✏️ {t("home.ctaDiary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured plants */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-leaf-800 md:text-3xl">
            {t("home.featuredTitle")}
          </h2>
          <p className="mt-2 text-leaf-600/70">{t("home.featuredSubtitle")}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {featured.map((plant) => (
            <PlantCard
              key={plant.slug}
              plant={plant}
              locale={locale}
              difficultyLabel={difficultyLabels[plant.difficulty]}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/plants`}
            className="inline-block rounded-full border-2 border-leaf-300 px-6 py-2.5 font-semibold text-leaf-600 transition-colors hover:bg-leaf-100"
          >
            {t("common.viewAll")} →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-cream-100">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="mb-8 text-center text-2xl font-bold text-leaf-800 md:text-3xl">
            {t("home.featuresTitle")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl bg-white p-6 text-center shadow-sm"
              >
                <div className="text-4xl" aria-hidden>
                  {f.emoji}
                </div>
                <h3 className="mt-3 text-lg font-bold text-leaf-800">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-leaf-600/80">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
