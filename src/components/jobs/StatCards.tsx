import type { StatCardData } from "../../hooks/useJobsData";

export default function StatCards({ cards }: { cards: StatCardData[] }) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {card.label}
          </p>
          <p className={`mt-2 text-2xl font-semibold ${card.tone}`}>
            {card.value}
          </p>
          <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">
            {card.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
