import {
  getCompanyColor,
  getInitials,
  matchCategoryBadge,
} from "../../hooks/useJobsData";
import { DetailSkeleton } from "./JobSkeleton";
import type { Job } from "../../hooks/useJobsData";

interface JobDetailProps {
  job: Job | null;
  isLoading: boolean;
  isMutating: boolean;
  onShortlist: () => void;
  onApplied: () => void;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-white/[0.03]">
      <p className="text-theme-xs text-gray-400">{label}</p>
      <p className="mt-1 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
        {value || "-"}
      </p>
    </div>
  );
}

export default function JobDetail({
  job,
  isLoading,
  isMutating,
  onShortlist,
  onApplied,
}: JobDetailProps) {
  if (isLoading && !job) return <DetailSkeleton />;

  if (!job) {
    return (
      <aside className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6 text-center dark:border-gray-700 dark:bg-white/[0.02] xl:sticky xl:top-24">
        <div>
          <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
            Detail lowongan belum tersedia
          </p>
          <p className="mt-1 text-theme-xs leading-5 text-gray-500 dark:text-gray-400">
            Pilih tab atau ubah filter untuk menampilkan detail lowongan.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] xl:sticky xl:top-24 transition-opacity duration-200">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-theme-sm font-semibold ${getCompanyColor(job.id)}`}
        >
          {getInitials(job.company, job.title)}
        </span>
        <div>
          <p
            className={`font-semibold ${matchCategoryBadge[job.matchCategory].titleClass}`}
          >
            {job.title}
          </p>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">
            {job.company || "-"}
          </p>
        </div>
      </div>

      {/* Suspicious alert */}
      {job.suspiciousFlag && (
        <div className="mt-3 rounded-lg border border-error-200 bg-error-50 p-3 dark:border-error-500/20 dark:bg-error-500/[0.05]">
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

      {/* Detail grid */}
      <div className="my-5 grid grid-cols-2 gap-3">
        <Detail
          label="Lokasi"
          value={job.location !== "Unknown" ? job.location : "Tidak diketahui"}
        />
        <Detail label="Tipe" value={job.remoteType} />
        <Detail label="Employment" value={job.employmentType} />
        <Detail label="Diposting" value={job.postedAt} />
        <Detail label="Sumber" value={job.source} />
        <Detail label="Rekomendasi" value={job.recommendationAction} />
      </div>

      {/* Experience / Education */}
      {(job.experienceRequired || job.educationRequired) && (
        <div className="mb-5 grid grid-cols-2 gap-3">
          {job.experienceRequired && (
            <Detail label="Pengalaman" value={job.experienceRequired} />
          )}
          {job.educationRequired && (
            <Detail label="Pendidikan" value={job.educationRequired} />
          )}
        </div>
      )}

      {/* Source link */}
      <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
        <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">
          Tautan sumber
        </p>
        <a
          href={job.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-theme-sm font-medium text-gray-700 transition hover:border-brand-200 hover:bg-brand-25 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300"
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
            Skill cocok
            <span className="ml-1 text-success-500">●</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.matchedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-success-50 px-2.5 py-1 text-theme-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400"
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
            Skill kurang
            <span className="ml-1 text-error-500">●</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.missingSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-error-50 px-2.5 py-1 text-theme-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400"
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

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={onShortlist}
          disabled={isMutating}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-theme-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
        >
          {job.userState === "shortlist" ? "Hapus shortlist" : "Shortlist"}
        </button>
        <button
          onClick={onApplied}
          disabled={isMutating}
          className="flex-1 rounded-lg bg-gray-900 px-3 py-2.5 text-theme-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900"
        >
          {job.userState === "applied" ? "Batalkan applied" : "Tandai applied"}
        </button>
      </div>
    </aside>
  );
}
