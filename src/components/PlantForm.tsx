"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { createPlantEntry } from "@/lib/actions";
import { CARE_DIFFICULTIES, type Difficulty } from "@/lib/plants";

export default function PlantForm() {
  const t = useTranslations("plantForm");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
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

    const formData = new FormData(e.currentTarget);
    formData.set("care_difficulty", difficulty);

    const result = await createPlantEntry(formData, locale);
    setSubmitting(false);

    if ("error" in result) {
      setError(t("errorSubmit"));
      return;
    }

    router.push("/plants/mine");
    router.refresh();
  }

  const inputClass =
    "w-full rounded-2xl border-2 border-leaf-200 bg-white px-4 py-3 text-leaf-800 placeholder:text-leaf-400 focus:border-leaf-400 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("nameLabel")}
        </label>
        <input
          name="name"
          required
          maxLength={80}
          placeholder={t("namePlaceholder")}
          className={inputClass}
        />
      </div>

      {/* Scientific name */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("scientificNameLabel")}
        </label>
        <input
          name="scientific_name"
          maxLength={120}
          placeholder={t("scientificNamePlaceholder")}
          className={inputClass}
        />
      </div>

      {/* Family + Genus */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-leaf-700">
            {t("familyLabel")}
          </label>
          <input
            name="family"
            required
            maxLength={60}
            placeholder={t("familyPlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-leaf-700">
            {t("genusLabel")}
          </label>
          <input
            name="genus"
            maxLength={60}
            placeholder={t("genusPlaceholder")}
            className={inputClass}
          />
        </div>
      </div>

      {/* Growth habit */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("growthHabitLabel")}
        </label>
        <textarea
          name="growth_habit"
          required
          rows={3}
          placeholder={t("growthHabitPlaceholder")}
          className={inputClass}
        />
      </div>

      {/* Difficulty */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("difficultyLabel")}
        </label>
        <div className="flex flex-wrap gap-2">
          {CARE_DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors ${
                difficulty === d.value
                  ? "border-sun-400 bg-sun-100 font-semibold text-leaf-800"
                  : "border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50"
              }`}
            >
              <span aria-hidden>{d.emoji}</span>
              {t(`difficulty.${d.value}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Cover image */}
      <div>
        <label
          htmlFor="plant-image"
          className="mb-2 block text-sm font-semibold text-leaf-700"
        >
          {t("imageLabel")}
        </label>

        {/*
          Keep the file input mounted at all times so the selected file is
          included in FormData on submit (see DiaryForm for the same fix).
        */}
        <input
          id="plant-image"
          ref={fileInputRef}
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
        />

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
          <label
            htmlFor="plant-image"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-leaf-300 bg-cream-100 px-4 py-10 text-leaf-500 transition-colors hover:bg-leaf-50"
          >
            <span className="text-4xl" aria-hidden>
              🪴
            </span>
            <span className="text-sm">{t("imageHint")}</span>
          </label>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-leaf-700">
          {t("descriptionLabel")}
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder={t("descriptionPlaceholder")}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <p className="rounded-2xl bg-leaf-50 px-4 py-3 text-xs text-leaf-600/80">
        🌐 {t("autoHint")}
      </p>

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
