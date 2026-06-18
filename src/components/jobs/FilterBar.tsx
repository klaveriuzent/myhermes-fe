import { useRef, useEffect } from "react";
import { categoryOptions } from "../../hooks/useJobsData";

interface FilterBarProps {
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  isCategoryOpen: boolean;
  setIsCategoryOpen: (v: boolean) => void;
  jobsLength: number;
  onExport: () => void;
}

export default function FilterBar({
  query,
  setQuery,
  category,
  setCategory,
  isCategoryOpen,
  setIsCategoryOpen,
  jobsLength,
  onExport,
}: FilterBarProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [setIsCategoryOpen]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      {/* Search — full width */}
      <div className="relative min-w-0 flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari posisi, perusahaan..."
          className="h-11 w-full rounded-xl border border-gray-300 bg-transparent py-2.5 pl-10 pr-3 text-sm text-gray-800 outline-none transition focus:border-brand-300 focus:ring-3 focus:ring-brand-50 dark:border-gray-700 dark:text-white/90 placeholder:text-gray-400"
        />
      </div>

      {/* Category filter */}
      <div ref={dropdownRef} className="relative w-full md:w-auto">
        <svg
          className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
            category === "Semua kategori" ? "text-gray-400" : "text-brand-400"
          }`}
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 6h16M7 12h10m-7 6h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <button
          type="button"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          aria-label="Filter berdasarkan kategori"
          aria-haspopup="listbox"
          aria-expanded={isCategoryOpen}
          className={`h-11 w-full rounded-xl border bg-white py-2.5 pl-9 pr-9 text-left text-sm font-medium shadow-theme-xs outline-none transition focus:border-brand-300 focus:ring-3 focus:ring-brand-50 dark:bg-gray-900 md:w-44 ${
            category === "Semua kategori"
              ? "border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300"
              : "border-brand-200 bg-brand-25 text-gray-800 dark:border-brand-500/30 dark:bg-brand-500/[0.06] dark:text-white/90"
          }`}
        >
          {category}
        </button>
        <svg
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${
            isCategoryOpen ? "rotate-180" : ""
          }`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="m7 10 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {isCategoryOpen && (
          <div
            role="listbox"
            className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-theme-lg dark:border-gray-700 dark:bg-gray-900 md:w-56"
          >
            <p className="px-3 pb-2 pt-1.5 text-theme-xs font-medium uppercase tracking-wide text-gray-400">
              Filter kategori
            </p>
            {categoryOptions.map((opt) => {
              const selected = category === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setCategory(opt.label);
                    setIsCategoryOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    selected
                      ? "bg-brand-50 text-gray-900 dark:bg-brand-500/10 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${opt.dotClass}`}
                  />
                  <span className="flex-1 text-theme-sm font-medium">
                    {opt.label}
                  </span>
                  {selected && (
                    <svg
                      className="text-success-600"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="m5 12.5 4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Export — full width mobile */}
      <button
        type="button"
        onClick={onExport}
        disabled={jobsLength === 0}
        className="h-11 w-full rounded-xl border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5 md:w-auto md:px-5"
      >
        Export CSV
      </button>
    </div>
  );
}
