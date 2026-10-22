import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";

export const instant = false;

interface ProfileRow {
  nickname: string | null;
  succulent_years: number | null;
  avatar_url: string | null;
  bio: string | null;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("profile");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data } = await supabase
    .from("profiles")
    .select("nickname, succulent_years, avatar_url, bio")
    .eq("id", user.id)
    .single();

  const profile = (data ?? null) as ProfileRow | null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6 text-center">
        <div className="text-4xl" aria-hidden>
          👤
        </div>
        <h1 className="mt-2 text-3xl font-bold text-leaf-800">{t("title")}</h1>
        <p className="mt-1 text-leaf-600/70">{t("subtitle")}</p>
      </header>

      <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm">
        <ProfileForm
          initialNickname={profile?.nickname ?? null}
          initialSucculentYears={profile?.succulent_years ?? null}
          initialAvatarUrl={profile?.avatar_url ?? null}
          initialBio={profile?.bio ?? null}
        />
      </div>
    </div>
  );
}
