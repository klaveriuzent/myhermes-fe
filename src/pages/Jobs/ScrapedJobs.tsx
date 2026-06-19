import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useJobsData, tabItems } from "../../hooks/useJobsData";
import StatCards from "../../components/jobs/StatCards";
import FilterBar from "../../components/jobs/FilterBar";
import JobTable from "../../components/jobs/JobTable";
import JobDetail from "../../components/jobs/JobDetail";
import JobBottomSheet from "../../components/jobs/JobBottomSheet";
import JobToast from "../../components/jobs/JobToast";

const QUICK_FILTERS = [
  { label: "High Match", key: "High Match" as const },
  { label: "Remote", key: "remote" as const },
  { label: "Terbaru", key: "newest" as const },
  { label: "Tersimpan", key: "shortlist" as const },
];

export default function ScrapedJobs() {
  const {
    jobs,
    meta,
    selectedJob,
    selectedJobId,
    isLoading,
    isMutating,
    errorMessage,
    activeTab,
    query,
    category,
    currentPage,
    isCategoryOpen,
    toast,
    totalPages,
    pageStart,
    pageEnd,
    paginationItems,
    statCards,
    setActiveTab,
    setQuery,
    setCategory,
    setCurrentPage,
    setIsCategoryOpen,
    updateJobState,
    exportJobs,
    clearToast,
    selectJob,
  } = useJobsData();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  function handleSelectJob(id: number) {
    selectJob(id);
    setSheetOpen(true);
  }

  function handleQuickFilter(label: string) {
    if (activeQuickFilter === label) {
      setActiveQuickFilter(null);
      if (label === "High Match") setCategory("Semua kategori");
    } else {
      setActiveQuickFilter(label);
      if (label === "High Match") setCategory("High Match");
      // Remote / Newest / Tersimpan would need additional query params or tab switching
      // For now, tab switch for saved and query for remote could work
      if (label === "Tersimpan") setActiveTab("Shortlist");
      if (label === "Remote") setQuery("remote");
      if (label === "Terbaru") setQuery("newest");
    }
  }

  return (
    <>
      <PageMeta
        title="Scraped Jobs | Hermes"
        description="Hasil scraping lowongan kerja oleh AI agent"
      />

      {/* Header — responsive typography */}
      <div className="mb-4 px-0">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Hasil scraping lowongan
        </h1>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
          Review, kurasi, dan tindak lanjuti lowongan yang ditemukan oleh agent.
        </p>
      </div>

      {/* Stat cards — compact mobile grid */}
      <div className="mb-4">
        <StatCards cards={statCards} />
      </div>

      {/* Tabs — full width, 40px tall mobile */}
      <div className="mb-3">
        <div
          role="tablist"
          aria-label="Kategori lowongan"
          className="grid w-full grid-cols-3 gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 shadow-inner dark:border-gray-800 dark:bg-gray-900/60"
        >
          {tabItems.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`flex min-h-10 items-center justify-center rounded-lg px-2 text-xs font-medium transition active:scale-[0.97] sm:text-sm ${
                activeTab === tab
                  ? "bg-gray-900 text-white shadow-theme-xs ring-1 ring-gray-900 dark:bg-brand-400/15 dark:text-brand-300 dark:ring-brand-400/20"
                  : "text-gray-500 hover:bg-white hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Quick filter chips — mobile only */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
        {QUICK_FILTERS.map((qf) => (
          <button
            key={qf.label}
            type="button"
            onClick={() => handleQuickFilter(qf.label)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-[0.97] ${
              activeQuickFilter === qf.label
                ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-gray-600"
            }`}
          >
            {qf.label}
          </button>
        ))}
      </div>

      {/* Sticky filter bar on mobile — safe z-index, backdrop blur */}
      <div className="sticky top-0 z-20 mb-3 bg-white/90 pb-2 pt-0 backdrop-blur-md dark:bg-gray-950/90 lg:static lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <FilterBar
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          isCategoryOpen={isCategoryOpen}
          setIsCategoryOpen={setIsCategoryOpen}
          jobsLength={jobs.length}
          onExport={exportJobs}
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Table / Card list */}
        <JobTable
          jobs={jobs}
          isLoading={isLoading}
          errorMessage={errorMessage}
          selectedJobId={selectedJobId}
          isMutating={isMutating}
          currentPage={currentPage}
          totalPages={totalPages}
          pageStart={pageStart}
          pageEnd={pageEnd}
          metaTotal={meta.total}
          paginationItems={paginationItems}
          onSelectJob={handleSelectJob}
          onToggleShortlist={(job) => updateJobState(job, "shortlist")}
          onPageChange={setCurrentPage}
        />

        {/* Desktop sidebar (>= xl) */}
        <JobDetail
          job={selectedJob}
          isLoading={isLoading}
          isMutating={isMutating}
          onShortlist={() =>
            selectedJob && updateJobState(selectedJob, "shortlist")
          }
          onApplied={() =>
            selectedJob && updateJobState(selectedJob, "applied")
          }
        />
      </div>

      {/* Mobile bottom sheet (< lg) */}
      <JobBottomSheet
        job={isLoading ? null : selectedJob}
        visible={!!selectedJob && !isLoading && sheetOpen}
        isMutating={isMutating}
        onClose={() => setSheetOpen(false)}
        onShortlist={() =>
          selectedJob && updateJobState(selectedJob, "shortlist")
        }
        onApplied={() =>
          selectedJob && updateJobState(selectedJob, "applied")
        }
      />

      {/* Toast notification */}
      {toast && <JobToast toast={toast} onClear={clearToast} />}
    </>
  );
}
