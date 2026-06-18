import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import JobRow from "./JobRow";
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
    <section className="flex min-h-[680px] min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
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
          (isLoading && jobs.length === 0)) && (
          <JobSkeleton />
        )}
      </div>

      {/* Pagination */}
      <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 px-5 py-4 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
        <span className="text-theme-xs text-gray-500 dark:text-gray-400">
          {jobs.length > 0
            ? `Menampilkan ${pageStart}-${pageEnd} dari ${metaTotal} lowongan`
            : "Tidak ada lowongan"}
        </span>
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Halaman sebelumnya"
            className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
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
                className="flex size-8 items-center justify-center text-theme-xs font-medium text-gray-400"
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
                className={`size-8 rounded-lg text-theme-xs font-medium transition ${
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
            className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
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
    </section>
  );
}
