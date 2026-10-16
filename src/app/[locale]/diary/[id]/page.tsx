import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { MOODS, GROWTH_STATUSES, type DiaryEntry } from "@/lib/diary";

export const instant = false;

function findEmoji(list: { value: string; emoji: string }[], value: string | null) {
  return list.find((x) => x.value === value)?.emoji;
}

export default async function DiaryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("diary");
  const tc = await getTranslations("common");

  const supabase = await createClient();
  const { data } = await supabase
    .from("diary_entries")
    .select("*")
    .eq("id", id)
    .single();

  const entry = data as DiaryEntry | null;
  if (!entry) notFound();

  const moodEmoji = findEmoji(MOODS, entry.mood);
  const statusEmoji = findEmoji(GROWTH_STATUSES, entry.growth_status);

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={`/${locale}/diary`}
        className="mb-6 inline-block rounded-full px-4 py-2 text-sm font-medium text-leaf-600 transition-colors hover:bg-leaf-100"
      >
        ← {tc("backToList")}
      </Link>

      <article className="overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-sm">
        {entry.image_url && (
          <div className="max-h-[480px] overflow-hidden bg-cream-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.image_url}
              alt={entry.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-leaf-600">
            {moodEmoji && (
              <span className="flex items-center gap-1 rounded-full bg-sun-100 px-3 py-1">
                {moodEmoji} {entry.mood && t(`moods.${entry.mood}`)}
              </span>
            )}
            {statusEmoji && (
              <span className="flex items-center gap-1 rounded-full bg-leaf-100 px-3 py-1">
                {statusEmoji} {entry.growth_status && t(`status.${entry.growth_status}`)}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-leaf-800 md:text-3xl">
            {entry.title}
          </h1>

          <p className="mt-2 text-xs text-leaf-500/80">
            {t("postedOn", { date: dateFormatter.format(new Date(entry.created_at)) })}
          </p>

          {entry.content && (
            <p className="mt-5 whitespace-pre-wrap leading-relaxed text-leaf-700/90">
              {entry.content}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
