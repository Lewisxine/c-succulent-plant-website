import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="mt-16 border-t border-leaf-100 bg-leaf-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-10 text-center">
        <span className="text-2xl" aria-hidden>
          🌱
        </span>
        <p className="font-semibold text-leaf-700">{t("footer.tagline")}</p>
        <p className="text-sm text-leaf-600/70">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
