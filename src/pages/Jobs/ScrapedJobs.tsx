import PageMeta from "../../components/common/PageMeta";
import { useJobsData, tabItems } from "../../hooks/useJobsData";
import StatCards from "../../components/jobs/StatCards";
import FilterBar from "../../components/jobs/FilterBar";
import JobTable from "../../components/jobs/JobTable";
import JobDetail from "../../components/jobs/JobDetail";
import JobToast from "../../components/jobs/JobToast";

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

  return (
    <>
      <PageMeta
        title="Scraped Jobs | Hermes"
        description="Hasil scraping lowongan kerja oleh AI agent"
      />

      {/* Header */}
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Hasil scraping lowongan
          </h1>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Review, kurasi, dan tindak lanjuti lowongan yang ditemukan oleh
            agent.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <StatCards cards={statCards} />

      {/* Tab bar */}
      <div className="mb-6">
        <div
          role="tablist"
          aria-label="Kategori lowongan"
          className="flex w-fit gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1 shadow-inner dark:border-gray-800 dark:bg-gray-900/60"
        >
          {tabItems.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`flex h-9 shrink-0 items-center rounded-lg px-4 text-theme-sm font-medium transition ${
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

      {/* Filter bar */}
      <div className="mb-4">
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
        {/* Table */}
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
          onSelectJob={selectJob}
          onToggleShortlist={(job) => updateJobState(job, "shortlist")}
          onPageChange={setCurrentPage}
        />

        {/* Detail sidebar */}
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

      {/* Toast notification */}
      {toast && <JobToast toast={toast} onClear={clearToast} />}
    </>
  );
}
