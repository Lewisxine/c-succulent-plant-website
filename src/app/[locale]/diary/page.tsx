import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { MOODS, GROWTH_STATUSES, type DiaryEntry } from "@/lib/diary";

export const instant = false;

function findEmoji(list: { value: string; emoji: string }[], value: string | null) {
  return list.find((x) => x.value === value)?.emoji;
}

export default async function DiaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("diary");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diary_entries")
    .select("*")
    .order("created_at", { ascending: false });

  const entries = (data ?? []) as DiaryEntry[];
  const tableMissing = error?.message?.toLowerCase().includes("does not exist");

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <div className="text-4xl" aria-hidden>
            📔
          </div>
          <h1 className="mt-1 text-3xl font-bold text-leaf-800">{t("title")}</h1>
          <p className="mt-1 text-leaf-600/70">{t("subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/diary/new`}
          className="rounded-full bg-leaf-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-leaf-600"
        >
          ✏️ {t("writeEntry")}
        </Link>
      </header>

      {tableMissing ? (
        <div className="rounded-3xl border border-sun-200 bg-sun-50 p-8 text-center">
          <div className="text-4xl" aria-hidden>
            🛠️
          </div>
          <p className="mt-3 text-leaf-700">{t("emptySetup")}</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-3xl bg-white py-16 text-center shadow-sm">
          <div className="text-5xl" aria-hidden>
            🌵
          </div>
          <p className="mt-4 text-leaf-600">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {entries.map((entry) => {
            const moodEmoji = findEmoji(MOODS, entry.mood);
            const statusEmoji = findEmoji(GROWTH_STATUSES, entry.growth_status);
            return (
              <Link
                key={entry.id}
                href={`/${locale}/diary/${entry.id}`}
                className="group overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {entry.image_url && (
                  <div className="aspect-[4/3] overflow-hidden bg-cream-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.image_url}
                      alt={entry.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-leaf-600">
                    {moodEmoji && <span>{moodEmoji}</span>}
                    {statusEmoji && <span>{statusEmoji}</span>}
                  </div>
                  <h2 className="mt-2 line-clamp-1 text-lg font-bold text-leaf-800">
                    {entry.title}
                  </h2>
                  {entry.content && (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-leaf-700/80">
                      {entry.content}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-leaf-500/80">
                    {dateFormatter.format(new Date(entry.created_at))}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
