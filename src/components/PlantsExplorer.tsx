"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { succulents, type Difficulty } from "@/lib/plants";
import { localized } from "@/lib/i18n";
import PlantCard from "./PlantCard";

const difficultyKey = {
  easy: "difficultyEasy",
  medium: "difficultyMedium",
  hard: "difficultyHard",
} as const;

export default function PlantsExplorer({ locale }: { locale: string }) {
  const t = useTranslations("plants");
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"all" | Difficulty>("all");

  const filtered = succulents.filter((p) => {
    const hay = `${p.scientificName} ${localized(p.commonName, locale)} ${localized(p.family, locale)}`.toLowerCase();
    const matchesQuery = hay.includes(query.trim().toLowerCase());
    const matchesDifficulty = difficulty === "all" || p.difficulty === difficulty;
    return matchesQuery && matchesDifficulty;
  });

  const filters: { value: "all" | Difficulty; label: string }[] = [
    { value: "all", label: t("filterAll") },
    { value: "easy", label: t("filterEasy") },
    { value: "medium", label: t("filterMedium") },
    { value: "hard", label: t("filterHard") },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-full border-2 border-leaf-200 bg-white px-5 py-3 text-leaf-800 placeholder:text-leaf-400 focus:border-leaf-400 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setDifficulty(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                difficulty === f.value
                  ? "bg-leaf-500 text-white shadow-sm"
                  : "bg-white text-leaf-700 border border-leaf-200 hover:bg-leaf-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-leaf-600/70">
        {t("count", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white py-16 text-center text-leaf-600 shadow-sm">
          <div className="text-4xl" aria-hidden>
            🥀
          </div>
          <p className="mt-3">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <PlantCard
              key={p.slug}
              plant={p}
              locale={locale}
              difficultyLabel={t(difficultyKey[p.difficulty])}
            />
          ))}
        </div>
      )}
    </div>
  );
}
