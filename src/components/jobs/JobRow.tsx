import {
  getCompanyColor,
  getInitials,
  matchCategoryBadge,
  truncateText,
} from "../../hooks/useJobsData";
import Badge from "../ui/badge/Badge";
import type { Job } from "../../hooks/useJobsData";

interface JobRowProps {
  job: Job;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onToggleShortlist: () => void;
  isMutating: boolean;
}

export default function JobRow({
  job,
  isSelected,
  onSelect,
  onToggleShortlist,
  isMutating,
}: JobRowProps) {
  return (
    <tr
      className={`transition hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
        isSelected ? "bg-brand-25 dark:bg-brand-500/[0.04]" : ""
      }`}
    >
      <td className="px-4 py-3">
        <button
          onClick={() => onSelect(job.id)}
          className="flex min-h-[72px] w-full min-w-0 items-center gap-3 text-left"
        >
          {/* Avatar */}
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-theme-sm font-semibold ${getCompanyColor(job.id)}`}
          >
            {getInitials(job.company, job.title)}
          </span>
          {/* Info */}
          <span className="min-w-0 flex-1 overflow-hidden">
            <span className="block truncate font-medium text-gray-800 dark:text-white/90">
              {truncateText(job.title, 20)}
            </span>
            <span className="mt-1 flex min-w-0 items-center gap-2 overflow-hidden text-theme-xs text-gray-500 dark:text-gray-400">
              <span className="min-w-0 max-w-[140px] truncate">
                {job.company && job.company !== "Unknown"
                  ? job.company
                  : "Perusahaan tidak diketahui"}
              </span>
              <span className="size-1 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="min-w-0 max-w-[160px] truncate">
                {job.location !== "Unknown"
                  ? job.location
                  : "Lokasi tidak diketahui"}
              </span>
              {job.remoteType !== "Unknown" && (
                <>
                  <span className="size-1 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="shrink-0 truncate">{job.remoteType}</span>
                </>
              )}
            </span>
            {job.suspiciousFlag && (
              <span className="mt-1.5 flex items-center">
                <span className="inline-flex items-center gap-1 rounded-md bg-error-50 px-1.5 py-0.5 text-theme-xs font-medium text-error-600 dark:bg-error-500/10 dark:text-error-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Mencurigakan
                </span>
              </span>
            )}
          </span>
        </button>
      </td>

      <td className="px-4 py-4">
        <p className="text-theme-sm text-gray-700 dark:text-gray-300">
          {job.source}
        </p>
        <p className="mt-1 text-theme-xs text-gray-400">Diambil {job.scrapedAt}</p>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 dark:text-white/90">
            {job.matchScore}%
          </span>
          <span className="h-1.5 w-14 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <span
              className={`block h-full rounded-full ${
                job.matchScore >= 80
                  ? "bg-success-500"
                  : job.matchScore >= 60
                    ? "bg-warning-500"
                    : "bg-error-500"
              }`}
              style={{ width: `${job.matchScore}%` }}
            />
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <Badge color={matchCategoryBadge[job.matchCategory].color} size="sm">
          {matchCategoryBadge[job.matchCategory].label}
        </Badge>
      </td>

      <td className="px-4 py-4">
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-400">
          {job.employmentType}
        </span>
      </td>

      <td className="px-4 py-4 text-right">
        <button
          onClick={onToggleShortlist}
          disabled={isMutating}
          aria-label="Shortlist lowongan"
          className={`rounded-xl border-2 p-2.5 disabled:cursor-not-allowed disabled:opacity-50 ${
            job.userState === "shortlist"
              ? "border-warning-200 bg-warning-50 text-warning-600"
              : "border-gray-200 text-gray-400 hover:text-warning-600 dark:border-gray-700"
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
      </td>
    </tr>
  );
}
