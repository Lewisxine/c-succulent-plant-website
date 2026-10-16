import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const sections = [
    { icon: "🖼️", title: t("imageSourceTitle"), body: t("imageSourceDesc") },
    { icon: "📚", title: t("dataTitle"), body: t("dataDesc") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8 text-center">
        <div className="text-4xl" aria-hidden>
          🌿
        </div>
        <h1 className="mt-2 text-3xl font-bold text-leaf-800">{t("title")}</h1>
      </header>

      <p className="rounded-3xl border border-leaf-100 bg-white p-6 leading-relaxed text-leaf-700/90 shadow-sm">
        {t("intro")}
      </p>

      <div className="mt-6 grid gap-4">
        {sections.map((s) => (
          <div
            key={s.title}
            className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>
                {s.icon}
              </span>
              <h2 className="font-bold text-leaf-800">{s.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-leaf-700/80">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
