"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { deleteDiaryEntry } from "@/lib/actions";

export default function DeleteDiaryButton({
  diaryId,
  locale,
}: {
  diaryId: string;
  locale: string;
}) {
  const t = useTranslations("diary");
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const result = await deleteDiaryEntry(diaryId, locale);
    setDeleting(false);

    if ("error" in result) {
      setError(t("deleteError"));
      return;
    }

    router.push("/diary");
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-leaf-700">
          {t("deleteConfirm")}
        </span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? t("deleting") : t("deleteConfirmYes")}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="rounded-full border border-leaf-200 px-4 py-2 text-sm font-medium text-leaf-700 transition-colors hover:bg-leaf-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("deleteCancel")}
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
    >
      🗑 {t("delete")}
    </button>
  );
}
