"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function AccessDenied({ namespace = "diary" }: { namespace?: string }) {
  const t = useTranslations(namespace);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="text-5xl" aria-hidden>
        🔒
      </div>
      <h1 className="mt-4 text-2xl font-bold text-leaf-800">
        {t("accessDenied")}
      </h1>
      <p className="mt-2 text-leaf-600/70">{t("accessDeniedHint")}</p>
      <p className="mt-4 text-sm text-leaf-500/80">{t("redirectingHome")}</p>
    </div>
  );
}
