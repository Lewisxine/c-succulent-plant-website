import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import DiaryForm from "@/components/DiaryForm";

export const instant = false;

export default async function DiaryNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("diary");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6 text-center">
        <div className="text-4xl" aria-hidden>
          ✏️
        </div>
        <h1 className="mt-2 text-3xl font-bold text-leaf-800">
          {t("writeEntry")}
        </h1>
      </header>
      <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
        <DiaryForm />
      </div>
    </div>
  );
}
