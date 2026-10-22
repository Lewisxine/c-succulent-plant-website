"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { createDiaryEntry } from "@/lib/actions";
import { MOODS, GROWTH_STATUSES } from "@/lib/diary";

export default function DiaryForm() {
  const t = useTranslations("diary");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [mood, setMood] = useState("happy");
  const [status, setStatus] = useState("growing");
  const [isPublic, setIsPublic] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
  }

  function removeFile() {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("mood", mood);
    formData.set("growth_status", status);
    formData.set("is_public", isPublic ? "true" : "false");

    const result = await createDiaryEntry(formData, locale);
    setSubmitting(false);

    if ("error" in result) {
      setError(t("errorUpload"));
      return;
    }

    router.push("/diary");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("titleLabel")}
        </label>
        <input
          name="title"
          required
          maxLength={80}
          placeholder={t("titlePlaceholder")}
          className="w-full rounded-2xl border-2 border-leaf-200 bg-white px-4 py-3 text-leaf-800 placeholder:text-leaf-400 focus:border-leaf-400 focus:outline-none"
        />
      </div>

      {/* Image */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("imageLabel")}
        </label>
        {preview ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-leaf-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="preview"
              className="max-h-72 w-full object-cover"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-red-600 shadow"
            >
              {t("imageRemove")}
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-leaf-300 bg-cream-100 px-4 py-10 text-leaf-500 transition-colors hover:bg-leaf-50">
            <span className="text-4xl" aria-hidden>
              📷
            </span>
            <span className="text-sm">{t("imageHint")}</span>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Mood */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("moodLabel")}
        </label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors ${
                mood === m.value
                  ? "border-sun-400 bg-sun-100 font-semibold text-leaf-800"
                  : "border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50"
              }`}
            >
              <span aria-hidden>{m.emoji}</span>
              {t(`moods.${m.value}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Growth status */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("statusLabel")}
        </label>
        <div className="flex flex-wrap gap-2">
          {GROWTH_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(s.value)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors ${
                status === s.value
                  ? "border-leaf-400 bg-leaf-100 font-semibold text-leaf-800"
                  : "border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50"
              }`}
            >
              <span aria-hidden>{s.emoji}</span>
              {t(`status.${s.value}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("contentLabel")}
        </label>
        <textarea
          name="content"
          rows={5}
          placeholder={t("contentPlaceholder")}
          className="w-full rounded-2xl border-2 border-leaf-200 bg-white px-4 py-3 text-leaf-800 placeholder:text-leaf-400 focus:border-leaf-400 focus:outline-none"
        />
      </div>

      {/* Visibility */}
      <div>
        <span className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("visibilityLabel")}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isPublic}
          onClick={() => setIsPublic((v) => !v)}
          className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
            isPublic
              ? "border-leaf-400 bg-leaf-50"
              : "border-leaf-200 bg-white hover:bg-leaf-50"
          }`}
        >
          <span className="flex items-center gap-2 text-sm text-leaf-700">
            <span aria-hidden>{isPublic ? "🌍" : "🔒"}</span>
            {t(isPublic ? "visibilityPublic" : "visibilityPrivate")}
          </span>
          <span
            className={`relative inline-flex h-6 w-11 flex-none shrink-0 rounded-full transition-colors ${
              isPublic ? "bg-leaf-500" : "bg-leaf-200"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                isPublic ? "translate-x-5" : ""
              }`}
            />
          </span>
        </button>
        <p className="mt-1.5 text-xs text-leaf-500/80">{t("visibilityHint")}</p>
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-leaf-500 px-6 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-leaf-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
