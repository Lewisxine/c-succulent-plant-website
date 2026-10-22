import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import DiaryImage from "@/components/DiaryImage";
import AccessDenied from "@/components/AccessDenied";
import { pickLocale, type PlantSubmission, type PlantStatus, type Difficulty } from "@/lib/plants";

export const instant = false;

const statusStyle: Record<PlantStatus, string> = {
  pending: "bg-sun-100 text-sun-700",
  approved: "bg-leaf-100 text-leaf-700",
  rejected: "bg-orange-100 text-orange-700",
};

const difficultyKey: Record<Difficulty, string> = {
  easy: "difficultyEasy",
  medium: "difficultyMedium",
  hard: "difficultyHard",
};

export default async function PlantEntryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("plants");
  const tm = await getTranslations("plantMine");
  const tc = await getTranslations("common");

  const supabase = await createClient();

  // 访问控制完全交给 Supabase RLS：
  // - status = 'approved' 的词条所有人可读
  // - 自己的词条（任意状态）本人可读
  // 查不到时统一显示 AccessDenied（不存在 / 未通过 / 不是自己的）
  const { data } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .single();

  const entry = (data ?? null) as PlantSubmission | null;

  if (!entry) {
    return <AccessDenied namespace="plants" />;
  }

  const statusLabel: Record<PlantStatus, string> = {
    pending: tm("statusPending"),
    approved: tm("statusApproved"),
    rejected: tm("statusRejected"),
  };

  // 作者名（profiles 表不存在时静默降级）
  let authorName: string | undefined;
  const { data: profileData } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", entry.created_by)
    .single();
  authorName = (profileData as { username?: string } | null)?.username;

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/${locale}/plants`}
        className="mb-6 inline-block rounded-full px-4 py-2 text-sm font-medium text-leaf-600 transition-colors hover:bg-leaf-100"
      >
        ← {tc("backToList")}
      </Link>

      <article className="overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-sm">
        {entry.image_url && (
          <div className="max-h-[480px] overflow-hidden bg-cream-100">
            <DiaryImage
              src={entry.image_url}
              alt={pickLocale(entry.name_zh, entry.name_en, locale)}
              className="h-full w-full object-cover"
              fallbackClassName="min-h-[280px] w-full"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-leaf-800 md:text-3xl">
            {pickLocale(entry.name_zh, entry.name_en, locale)}
          </h1>
          {entry.scientific_name && (
            <p className="mt-1 text-lg italic text-leaf-600/80">
              {entry.scientific_name}
              {entry.scientific_name_authority
                ? ` ${entry.scientific_name_authority}`
                : ""}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {(entry.family_zh || entry.family_en) && (
              <span className="rounded-full bg-sun-100 px-3 py-1 text-sm font-medium text-sun-700">
                {t("family")}：{pickLocale(entry.family_zh, entry.family_en, locale)}
              </span>
            )}
            {(entry.genus_zh || entry.genus_en) && (
              <span className="rounded-full bg-leaf-100 px-3 py-1 text-sm font-medium text-leaf-700">
                {t("genus")}：{pickLocale(entry.genus_zh, entry.genus_en, locale)}
              </span>
            )}
            <span className="rounded-full border border-leaf-200 px-3 py-1 text-sm text-leaf-700">
              🌱 {t(difficultyKey[entry.care_difficulty] ?? "difficultyMedium")}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle[entry.status]}`}
            >
              {statusLabel[entry.status]}
            </span>
            {entry.scientific_name &&
              (entry.scientific_name_verified ? (
                <span className="rounded-full bg-leaf-100 px-3 py-1 text-sm font-medium text-leaf-700">
                  {tm("nameVerified")}
                </span>
              ) : (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                  {tm("nameUnverified")}
                </span>
              ))}
          </div>

          {(entry.growth_habit_zh || entry.growth_habit_en) && (
            <div className="mt-6">
              <h2 className="font-bold text-leaf-800">{t("growthHabit")}</h2>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-leaf-700/90">
                {pickLocale(entry.growth_habit_zh, entry.growth_habit_en, locale)}
              </p>
            </div>
          )}

          {(entry.description_zh || entry.description_en) && (
            <div className="mt-6">
              <h2 className="font-bold text-leaf-800">{t("description")}</h2>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-leaf-700/90">
                {pickLocale(entry.description_zh, entry.description_en, locale)}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-leaf-100 pt-4 text-xs text-leaf-500/80">
            {authorName && (
              <span className="flex items-center gap-1">
                <span aria-hidden>👤</span>
                {authorName}
              </span>
            )}
            <span>{dateFormatter.format(new Date(entry.created_at))}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
