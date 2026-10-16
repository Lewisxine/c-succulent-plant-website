import Link from "next/link";
import { localized } from "@/lib/i18n";
import type { Succulent } from "@/lib/plants";

const difficultyColor = {
  easy: "bg-leaf-100 text-leaf-700",
  medium: "bg-sun-100 text-sun-700",
  hard: "bg-orange-100 text-orange-700",
} as const;

export default function PlantCard({
  plant,
  locale,
  difficultyLabel,
}: {
  plant: Succulent;
  locale: string;
  difficultyLabel: string;
}) {
  return (
    <Link
      href={`/${locale}/plants/${plant.slug}`}
      className="group overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden bg-cream-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={plant.image}
          alt={localized(plant.commonName, locale)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-leaf-800">
              {localized(plant.commonName, locale)}
            </h3>
            <p className="truncate text-sm italic text-leaf-600/70">
              {plant.scientificName}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyColor[plant.difficulty]}`}
          >
            {difficultyLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
