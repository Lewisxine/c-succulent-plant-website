import Link from "next/link";
import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import DiaryImage from "@/components/DiaryImage";
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

export default async function PlantMinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("plantMine");
  const tp = await getTranslations("plants");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  const entries = (data ?? []) as PlantSubmission[];
  const tableMissing = error?.message?.toLowerCase().includes("does not exist");

  const statusLabel: Record<PlantStatus, string> = {
    pending: t("statusPending"),
    approved: t("statusApproved"),
    rejected: t("statusRejected"),
  };

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <div className="text-4xl" aria-hidden>
            🗂️
          </div>
          <h1 className="mt-1 text-3xl font-bold text-leaf-800">{t("title")}</h1>
          <p className="mt-1 text-leaf-600/70">{t("subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/plants/new`}
          className="rounded-full bg-leaf-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-leaf-600"
        >
          ➕ {t("addNew")}
        </Link>
      </header>

      {tableMissing ? (
        <div className="rounded-3xl border border-sun-200 bg-sun-50 p-8 text-center">
          <div className="text-4xl" aria-hidden>
            🛠️
          </div>
          <p className="mt-3 text-leaf-700">{tp("communitySubtitle")}</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-3xl bg-white py-16 text-center shadow-sm">
          <div className="text-5xl" aria-hidden>
            🌱
          </div>
          <p className="mt-4 text-leaf-600">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-sm"
            >
              {entry.image_url && (
                <div className="aspect-[4/3] overflow-hidden bg-cream-100">
                  <DiaryImage
                    src={entry.image_url}
                    alt={pickLocale(entry.name_zh, entry.name_en, locale)}
                    className="h-full w-full object-cover"
                    fallbackClassName="h-full w-full"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="line-clamp-1 text-lg font-bold text-leaf-800">
                    {pickLocale(entry.name_zh, entry.name_en, locale)}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[entry.status]}`}
                  >
                    {statusLabel[entry.status]}
                  </span>
                </div>
                {entry.scientific_name && (
                  <p className="mt-0.5 line-clamp-1 text-sm italic text-leaf-600/70">
                    {entry.scientific_name}
                    {entry.scientific_name_authority
                      ? ` ${entry.scientific_name_authority}`
                      : ""}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-leaf-600">
                  {(entry.family_zh || entry.family_en) && (
                    <span className="rounded-full bg-leaf-50 px-2.5 py-1">
                      {tp("family")}：{pickLocale(entry.family_zh, entry.family_en, locale)}
                    </span>
                  )}
                  <span className="rounded-full bg-leaf-50 px-2.5 py-1">
                    {tp(difficultyKey[entry.care_difficulty] ?? "difficultyMedium")}
                  </span>
                  {entry.scientific_name &&
                    (entry.scientific_name_verified ? (
                      <span className="rounded-full bg-leaf-100 px-2.5 py-1 text-leaf-700">
                        {t("nameVerified")}
                      </span>
                    ) : (
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-orange-700">
                        {t("nameUnverified")}
                      </span>
                    ))}
                </div>
                <p className="mt-3 text-xs text-leaf-500/80">
                  {dateFormatter.format(new Date(entry.created_at))}
                </p>
                {entry.status === "pending" && (
                  <p className="mt-2 rounded-xl bg-sun-50 px-3 py-2 text-xs text-sun-700">
                    {t("statusHint")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
