import {
  getCompanyColor,
  getInitials,
  matchCategoryBadge,
} from "../../hooks/useJobsData";
import type { Job } from "../../hooks/useJobsData";

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  isMutating: boolean;
  onSelect: (id: number) => void;
  onToggleShortlist: () => void;
}

export default function JobCard({
  job,
  isSelected,
  isMutating,
  onSelect,
  onToggleShortlist,
}: JobCardProps) {
  const badge = matchCategoryBadge[job.matchCategory];

  return (
    <button
      type="button"
      onClick={() => onSelect(job.id)}
      className={`w-full rounded-2xl border px-3.5 py-3 text-left transition active:scale-[0.98] ${
        isSelected
          ? "border-brand-300 bg-brand-25 shadow-theme-sm dark:border-brand-500/40 dark:bg-brand-500/[0.06]"
          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-white/[0.03] dark:hover:border-gray-600"
      }`}
    >
      {/* Top row: avatar + title + shortlist star */}
      <div className="flex items-start gap-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${getCompanyColor(job.id)}`}
        >
          {getInitials(job.company, job.title)}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`line-clamp-2 text-sm font-semibold leading-snug ${
              badge ? badge.titleClass : "text-gray-800 dark:text-white/90"
            }`}
          >
            {job.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
            {job.company && job.company !== "Unknown"
              ? job.company
              : "Perusahaan tidak diketahui"}
            {job.company && job.company !== "Unknown" && (
              <>
                <span className="mx-1 inline-block size-1 rounded-full bg-gray-300 align-middle dark:bg-gray-600" />
                {job.location !== "Unknown" ? job.location : "Lokasi tidak diketahui"}
              </>
            )}
          </p>
        </div>

        {/* Shortlist star */}
        <div className="shrink-0 self-start" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onToggleShortlist}
            disabled={isMutating}
            aria-label={
              job.userState === "shortlist"
                ? "Hapus shortlist"
                : "Tambah shortlist"
            }
            className={`flex size-10 items-center justify-center rounded-xl border-2 transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 ${
              job.userState === "shortlist"
                ? "border-warning-200 bg-warning-50 text-warning-600"
                : "border-gray-200 text-gray-300 hover:border-warning-200 hover:text-warning-400 dark:border-gray-600 dark:text-gray-500"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={job.userState === "shortlist" ? "currentColor" : "none"}
            >
              <path
                d="M12 17.3 5.8 21l1.65-7L2 9.3l7.2-.6L12 2l2.8 6.7 7.2.6-5.45 4.7 1.65 7L12 17.3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Meta row: source + posted — compact */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-theme-xs text-gray-400">
        <span className="inline-flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path
              d="M9 12h6m-3-3v6m-7 4h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          {job.source}
        </span>
        <span className="inline-block size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        <span>Diambil {job.scrapedAt}</span>
      </div>

      {/* Score row: score | progress bar | match badge — single line */}
      <div className="mt-2.5 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5">
          <span
            className={`text-sm font-bold leading-none ${
              job.matchScore >= 80
                ? "text-success-600"
                : job.matchScore >= 60
                  ? "text-warning-600"
                  : "text-error-600"
            }`}
          >
            {job.matchScore}%
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className={`h-full rounded-full transition-all ${
                job.matchScore >= 80
                  ? "bg-success-500"
                  : job.matchScore >= 60
                    ? "bg-warning-500"
                    : "bg-error-500"
              }`}
              style={{ width: `${job.matchScore}%` }}
            />
          </div>
        </div>
        {badge && (
          <span
            className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-theme-xs font-semibold ${
              badge.color === "success"
                ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400"
                : badge.color === "warning"
                  ? "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400"
                  : "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400"
            }`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Tags row */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-theme-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-400">
          {job.employmentType}
        </span>
        {job.remoteType && job.remoteType !== "Unknown" && (
          <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-theme-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-400">
            {job.remoteType}
          </span>
        )}
        {job.suspiciousFlag && (
          <span className="inline-flex items-center gap-1 rounded-md bg-error-50 px-1.5 py-0.5 text-theme-xs font-medium text-error-600 dark:bg-error-500/10 dark:text-error-400">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Mencurigakan
          </span>
        )}
      </div>
    </button>
  );
}
