import { useEffect, useRef } from "react";
import {
  getCompanyColor,
  getInitials,
  matchCategoryBadge,
} from "../../hooks/useJobsData";
import type { Job } from "../../hooks/useJobsData";

interface JobBottomSheetProps {
  job: Job | null;
  visible: boolean;
  isMutating: boolean;
  onClose: () => void;
  onShortlist: () => void;
  onApplied: () => void;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-theme-xs text-gray-400">{label}</p>
      <p className="mt-0.5 text-theme-sm font-medium text-gray-700 dark:text-gray-200">
        {value || "-"}
      </p>
    </div>
  );
}

export default function JobBottomSheet({
  job,
  visible,
  isMutating,
  onClose,
  onShortlist,
  onApplied,
}: JobBottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [visible, onClose]);

  if (!job) return null;

  const badge = matchCategoryBadge[job.matchCategory];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:!hidden ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Detail ${job.title}`}
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 dark:bg-gray-900 lg:!hidden ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle bar */}
        <div className="sticky top-0 z-10 flex items-center justify-center bg-white px-4 pb-1 pt-2 dark:bg-gray-900">
          <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-3 top-2 z-20 flex min-h-10 min-w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 active:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6 6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="px-5 pb-6 pt-1">
          {/* Header */}
          <div className="flex items-start gap-3 pr-10">
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold ${getCompanyColor(job.id)}`}
            >
              {getInitials(job.company, job.title)}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`font-semibold text-base leading-tight ${badge.titleClass}`}>
                {job.title}
              </p>
              <p className="mt-0.5 text-theme-sm text-gray-500 dark:text-gray-400">
                {job.company || "-"}
              </p>
            </div>
          </div>

          {/* Suspicious alert */}
          {job.suspiciousFlag && (
            <div className="mt-3 rounded-xl border border-error-200 bg-error-50 p-3 dark:border-error-500/20 dark:bg-error-500/[0.05]">
              <p className="flex items-center gap-1.5 text-theme-xs font-semibold text-error-600 dark:text-error-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Lowongan mencurigakan
              </p>
              <p className="mt-1 text-theme-xs leading-5 text-gray-600 dark:text-gray-400">
                {job.suspiciousReason}
              </p>
            </div>
          )}

          {/* Match score bar */}
          <div className="mt-4 flex items-center gap-3">
            <span
              className={`text-lg font-bold ${
                job.matchScore >= 80
                  ? "text-success-600"
                  : job.matchScore >= 60
                    ? "text-warning-600"
                    : "text-error-600"
              }`}
            >
              {job.matchScore}%
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className={`h-full rounded-full ${
                  job.matchScore >= 80
                    ? "bg-success-500"
                    : job.matchScore >= 60
                      ? "bg-warning-500"
                      : "bg-error-500"
                }`}
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
            <span
              className={`shrink-0 rounded-md px-2.5 py-1 text-theme-sm font-semibold ${
                badge.color === "success"
                  ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400"
                  : badge.color === "warning"
                    ? "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400"
                    : "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400"
              }`}
            >
              {badge.label}
            </span>
          </div>

          {/* Detail fields — single column on mobile */}
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <DetailItem
                label="Lokasi"
                value={job.location !== "Unknown" ? job.location : "Tidak diketahui"}
              />
              <DetailItem label="Employment" value={job.employmentType} />
              <DetailItem label="Diposting" value={job.postedAt} />
              <DetailItem label="Sumber" value={job.source} />
              <DetailItem label="Rekomendasi" value={job.recommendationAction} />
              <DetailItem label="Tipe" value={job.remoteType} />
            </div>

            {(job.experienceRequired || job.educationRequired) && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {job.experienceRequired && (
                  <DetailItem label="Pengalaman" value={job.experienceRequired} />
                )}
                {job.educationRequired && (
                  <DetailItem label="Pendidikan" value={job.educationRequired} />
                )}
              </div>
            )}
          </div>

          {/* Source link */}
          <div className="mt-5">
            <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">
              Tautan sumber
            </p>
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 text-theme-sm font-medium text-gray-700 transition active:bg-gray-100 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300"
            >
              <span className="min-w-0 flex-1 truncate">{job.sourceUrl}</span>
              <svg
                className="shrink-0 text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M14 5h5v5m0-5-8 8m6 0v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Agent summary */}
          <div className="mt-5">
            <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">
              Ringkasan agent
            </p>
            <p className="mt-2 text-theme-sm leading-6 text-gray-600 dark:text-gray-300">
              {job.reasonMatch}
            </p>
          </div>

          {/* Matched skills */}
          {job.matchedSkills.length > 0 && (
            <div className="mt-5">
              <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">
                Skill cocok <span className="ml-1 text-success-500">●</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-success-50 px-3 py-1.5 text-theme-sm font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing skills */}
          {job.missingSkills.length > 0 && (
            <div className="mt-3">
              <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">
                Skill kurang <span className="ml-1 text-error-500">●</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-error-50 px-3 py-1.5 text-theme-sm font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Risk/gap note */}
          {job.riskOrGap && (
            <div className="mt-5 rounded-xl border border-brand-100 bg-brand-25 p-4 dark:border-brand-500/20 dark:bg-brand-500/[0.05]">
              <div className="flex items-center justify-between">
                <p className="text-theme-xs font-semibold text-gray-800 dark:text-white/90">
                  Catatan AI agent
                </p>
                <span className="text-theme-xs font-semibold text-success-600">
                  {job.matchScore}% match
                </span>
              </div>
              <p className="mt-2 text-theme-xs leading-5 text-gray-600 dark:text-gray-400">
                {job.riskOrGap}
              </p>
            </div>
          )}

          {/* Sticky action buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onShortlist}
              disabled={isMutating}
              className="flex min-h-12 flex-1 items-center justify-center rounded-xl border-2 border-gray-300 px-4 text-theme-sm font-semibold text-gray-700 transition active:scale-[0.97] active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:active:bg-white/5"
            >
              {job.userState === "shortlist" ? "Hapus shortlist" : "Shortlist"}
            </button>
            <button
              type="button"
              onClick={onApplied}
              disabled={isMutating}
              className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-gray-900 px-4 text-theme-sm font-semibold text-white transition active:scale-[0.97] active:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:active:bg-gray-100"
            >
              {job.userState === "applied" ? "Batalkan applied" : "Tandai applied"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
