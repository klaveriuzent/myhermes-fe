import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import JobRow from "./JobRow";
import JobCard from "./JobCard";
import JobSkeleton, { SkeletonRows } from "./JobSkeleton";
import type { Job } from "../../hooks/useJobsData";

const HEADINGS = ["Posisi", "Sumber & waktu", "AI match", "Kategori", "Tipe", ""];

interface JobTableProps {
  jobs: Job[];
  isLoading: boolean;
  errorMessage: string;
  selectedJobId: number | null;
  isMutating: boolean;
  currentPage: number;
  totalPages: number;
  pageStart: number;
  pageEnd: number;
  metaTotal: number;
  paginationItems: Array<number | "ellipsis">;
  onSelectJob: (id: number) => void;
  onToggleShortlist: (job: Job) => void;
  onPageChange: (page: number) => void;
}

/** Reusable pagination for both mobile & desktop */
function PaginationBar({
  currentPage,
  totalPages,
  paginationItems,
  onPageChange,
  jobsLength,
  metaTotal,
  pageStart,
  pageEnd,
  compact,
}: {
  currentPage: number;
  totalPages: number;
  paginationItems: Array<number | "ellipsis">;
  onPageChange: (page: number) => void;
  jobsLength: number;
  metaTotal: number;
  pageStart: number;
  pageEnd: number;
  compact?: boolean;
}) {
  const btnBase = compact
    ? "flex min-h-10 min-w-10 items-center justify-center rounded-lg text-theme-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
    : "flex min-h-11 min-w-11 items-center justify-center rounded-lg text-theme-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <span className="text-theme-xs text-gray-500 dark:text-gray-400">
        {jobsLength > 0
          ? `Menampilkan ${pageStart}-${pageEnd} dari ${metaTotal} lowongan`
          : "Tidak ada lowongan"}
      </span>
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
          className={`${btnBase} border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="m14.5 7-5 5 5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {paginationItems.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`e-${idx}`}
              className={`${btnBase} border-0 text-gray-400`}
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-label={`Halaman ${item}`}
              aria-current={currentPage === item ? "page" : undefined}
              className={`${btnBase} ${
                currentPage === item
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Halaman berikutnya"
          className={`${btnBase} border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="m9.5 7 5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function JobTable({
  jobs,
  isLoading,
  errorMessage,
  selectedJobId,
  isMutating,
  currentPage,
  totalPages,
  pageStart,
  pageEnd,
  metaTotal,
  paginationItems,
  onSelectJob,
  onToggleShortlist,
  onPageChange,
}: JobTableProps) {
  return (
    <>
      {/* ════════ MOBILE CARD LIST (< lg) ════════ */}
      <section className="block lg:hidden">
        {errorMessage && (
          <div className="mb-3 rounded-xl border border-error-100 bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:border-error-500/20 dark:bg-error-500/[0.06] dark:text-error-400">
            {errorMessage}
          </div>
        )}

        {isLoading && jobs.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex gap-3">
                  <div className="size-11 rounded-xl bg-gray-200 dark:bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/5 rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-3 w-2/5 rounded bg-gray-100 dark:bg-white/5" />
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-gray-100 dark:bg-white/5" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <svg
              className="mb-3 text-gray-300 dark:text-gray-600"
              width="48"
              height="48"
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
            <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
              Belum ada lowongan
            </p>
            <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
              Coba ubah filter atau refresh data.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJobId === job.id}
                isMutating={isMutating}
                onSelect={onSelectJob}
                onToggleShortlist={() => onToggleShortlist(job)}
              />
            ))}
          </div>
        )}

        {/* Mobile pagination */}
        <div className="mt-4 border-t border-gray-100 px-1 pb-3 pt-4 dark:border-gray-800">
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            paginationItems={paginationItems}
            onPageChange={onPageChange}
            jobsLength={jobs.length}
            metaTotal={metaTotal}
            pageStart={pageStart}
            pageEnd={pageEnd}
            compact
          />
        </div>
      </section>

      {/* ════════ DESKTOP TABLE (>= lg) ════════ */}
      <section className="hidden min-h-[680px] min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white lg:flex dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Error banner */}
        {errorMessage && (
          <div className="border-b border-error-100 bg-error-50 px-5 py-3 text-theme-sm text-error-600 dark:border-error-500/20 dark:bg-error-500/[0.06] dark:text-error-400">
            {errorMessage}
          </div>
        )}

        {/* Table area */}
        <div className="max-w-full flex-1 overflow-x-auto">
          {isLoading && jobs.length === 0 ? (
            <SkeletonRows />
          ) : (
            <Table className="table-fixed min-w-[900px]">
              <colgroup>
                <col className="w-[43%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[9%]" />
              </colgroup>
              <TableHeader className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]">
                <TableRow>
                  {HEADINGS.map((h) => (
                    <TableCell
                      key={h || "action"}
                      isHeader
                      className="px-4 py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {jobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    isSelected={selectedJobId === job.id}
                    isMutating={isMutating}
                    onSelect={onSelectJob}
                    onToggleShortlist={() => onToggleShortlist(job)}
                  />
                ))}
              </TableBody>
            </Table>
          )}

          {/* Empty / loading state */}
          {((jobs.length === 0 && !isLoading) ||
            (isLoading && jobs.length === 0)) && <JobSkeleton />}
        </div>

        {/* Desktop pagination */}
        <div className="mt-auto border-t border-gray-100 px-5 py-4 dark:border-gray-800">
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            paginationItems={paginationItems}
            onPageChange={onPageChange}
            jobsLength={jobs.length}
            metaTotal={metaTotal}
            pageStart={pageStart}
            pageEnd={pageEnd}
          />
        </div>
      </section>
    </>
  );
}
