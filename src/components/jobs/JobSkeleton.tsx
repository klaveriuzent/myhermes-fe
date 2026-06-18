export default function JobSkeleton() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-5 py-14 text-center">
      <span className="flex size-12 animate-pulse items-center justify-center rounded-xl bg-gray-200 dark:bg-white/10">
        <svg
          className="text-gray-300 dark:text-gray-600"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M8 7V5.8A2.8 2.8 0 0 1 10.8 3h2.4A2.8 2.8 0 0 1 16 5.8V7m-9 0h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm-2 5h14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <p className="mt-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
        Memuat lowongan
      </p>
      <p className="mt-1 max-w-xs text-theme-xs leading-5 text-gray-500 dark:text-gray-400">
        Mengambil data terbaru dari server.
      </p>
    </div>
  );
}

export function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 px-4 py-4">
          <div className="size-10 shrink-0 rounded-xl bg-gray-200 dark:bg-white/10" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-3/5 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-3 w-2/5 rounded bg-gray-100 dark:bg-white/5" />
          </div>
          <div className="h-4 w-12 rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-5 w-20 rounded-full bg-gray-100 dark:bg-white/5" />
          <div className="h-5 w-16 rounded bg-gray-100 dark:bg-white/5" />
          <div className="size-8 rounded-lg bg-gray-100 dark:bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <aside className="flex min-h-64 animate-pulse items-center justify-center rounded-2xl border border-gray-200 bg-white/60 p-6 dark:border-gray-700 dark:bg-white/[0.02] xl:sticky xl:top-24">
      <div className="w-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-gray-200 dark:bg-white/10" />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-3 w-24 rounded bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-50 p-3 dark:bg-white/[0.03]">
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-white/10" />
              <div className="mt-2 h-4 w-24 rounded bg-gray-100 dark:bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
