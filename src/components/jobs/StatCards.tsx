import type { StatCardData } from "../../hooks/useJobsData";

export default function StatCards({ cards }: { cards: StatCardData[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-0.5 rounded-xl border border-gray-200 bg-white px-3 py-3 dark:border-gray-700 dark:bg-white/[0.03] sm:px-4 sm:py-4"
        >
          <p className={`text-lg font-bold leading-none sm:text-2xl ${card.tone}`}>
            {card.value}
          </p>
          <p className="truncate text-theme-xs text-gray-500 dark:text-gray-400 sm:text-xs">
            {card.label}
          </p>
          <p className="hidden truncate text-theme-xs text-gray-400 dark:text-gray-500 sm:block">
            {card.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
