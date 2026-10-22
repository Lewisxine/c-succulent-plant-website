import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import PlantsExplorer from "@/components/PlantsExplorer";
import DiaryImage from "@/components/DiaryImage";
import { pickLocale, type PlantSubmission, type Difficulty } from "@/lib/plants";

export const instant = false;

const difficultyKey: Record<Difficulty, string> = {
  easy: "difficultyEasy",
  medium: "difficultyMedium",
  hard: "difficultyHard",
};

export default async function PlantsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("plants");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 审核通过的用户投稿（plants 表不存在时静默跳过）
  let submissions: PlantSubmission[] = [];
  let submissionsReady = false;
  const { data: submissionData, error: submissionError } = await supabase
    .from("plants")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (!submissionError && submissionData) {
    submissions = submissionData as PlantSubmission[];
    submissionsReady = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <div className="text-4xl" aria-hidden>
          🪴
        </div>
        <h1 className="mt-2 text-3xl font-bold text-leaf-800">{t("title")}</h1>
        <p className="mt-2 text-leaf-600/70">{t("subtitle")}</p>
      </header>

      {/* 投稿入口（带登录状态校验） */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {user ? (
          <Link
            href={`/${locale}/plants/new`}
            className="rounded-full bg-leaf-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-leaf-600"
          >
            ➕ {t("addEntry")}
          </Link>
        ) : (
          <Link
            href={`/${locale}/login`}
            className="rounded-full bg-leaf-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-leaf-600"
          >
            🔒 {t("loginToAdd")}
          </Link>
        )}
        {user && (
          <Link
            href={`/${locale}/plants/mine`}
            className="rounded-full border border-leaf-200 px-6 py-3 font-medium text-leaf-700 transition-colors hover:bg-leaf-100"
          >
            🗂️ {t("myEntries")}
          </Link>
        )}
      </div>

      <PlantsExplorer locale={locale} />

      {/* 社区投稿（审核通过后展示） */}
      {submissionsReady && (
        <section className="mt-14">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-leaf-800">
              {t("communityTitle")}
            </h2>
            <p className="mt-1 text-leaf-600/70">{t("communitySubtitle")}</p>
          </div>

          {submissions.length === 0 ? (
            <div className="rounded-3xl bg-white py-12 text-center shadow-sm">
              <div className="text-4xl" aria-hidden>
                🌱
              </div>
              <p className="mt-3 text-leaf-600">{t("communityEmpty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {submissions.map((s) => (
                <Link
                  key={s.id}
                  href={`/${locale}/plants/entry/${s.id}`}
                  className="group overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden bg-cream-100">
                    {s.image_url ? (
                      <DiaryImage
                        src={s.image_url}
                        alt={pickLocale(s.name_zh, s.name_en, locale)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        fallbackClassName="h-full w-full"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-5xl">
                        🪴
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="truncate text-lg font-bold text-leaf-800">
                      {pickLocale(s.name_zh, s.name_en, locale)}
                    </h3>
                    {s.scientific_name && (
                      <p className="truncate text-sm italic text-leaf-600/70">
                        {s.scientific_name}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {(s.family_zh || s.family_en) && (
                        <span className="truncate rounded-full bg-leaf-50 px-2.5 py-1 text-xs text-leaf-600">
                          {t("family")}：{pickLocale(s.family_zh, s.family_en, locale)}
                        </span>
                      )}
                      <span className="shrink-0 rounded-full bg-sun-100 px-2.5 py-1 text-xs font-semibold text-sun-700">
                        {t(difficultyKey[s.care_difficulty] ?? "difficultyMedium")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
