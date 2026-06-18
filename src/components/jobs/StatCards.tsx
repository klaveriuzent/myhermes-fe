import type { StatCardData } from "../../hooks/useJobsData";

export default function StatCards({ cards }: { cards: StatCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-white/[0.03]"
        >
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-lg`}
          >
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-gray-900 dark:text-white sm:text-2xl">
              {card.value}
            </p>
            <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
