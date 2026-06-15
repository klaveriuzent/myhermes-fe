import { useEffect, useMemo, useRef, useState } from "react";

import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

type MatchCategory = "High Match" | "Medium Match" | "Low Match";
type JobTab = "Scraped" | "Shortlist" | "Applied";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  remoteType: string;
  employmentType: string;
  salary: string;
  source: string;
  sourceUrl: string;
  scrapedAt: string;
  postedAt: string;
  matchScore: number;
  matchCategory: MatchCategory;
  recommendationAction: string;
  matchedSkills: string[];
  missingSkills: string[];
  reasonMatch: string;
  riskOrGap: string;
  suspiciousFlag: boolean;
  suspiciousReason: string;
  experienceRequired: string;
  educationRequired: string;
};

const COMPANY_COLORS = [
  "bg-blue-light-50 text-blue-light-700",
  "bg-success-50 text-success-700",
  "bg-theme-purple-500/10 text-theme-purple-500",
  "bg-orange-50 text-orange-700",
  "bg-pink-50 text-pink-700",
  "bg-cyan-50 text-cyan-700",
  "bg-warning-50 text-warning-700",
  "bg-error-50 text-error-700",
];

function getInitials(name: string, fallback?: string): string {
  if (!name || name === "Unknown") {
    return fallback ? fallback.charAt(0).toUpperCase() : "?";
  }
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function getCompanyColor(index: number): string {
  return COMPANY_COLORS[index % COMPANY_COLORS.length];
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari lalu`;
}

function parseTimestamp(ts: string | null): string {
  if (!ts) return "-";
  return timeAgo(new Date(ts));
}

const matchCategoryBadge: Record<
  MatchCategory,
  { color: "success" | "warning" | "error"; label: string; titleClass: string }
> = {
  "High Match": { color: "success", label: "High Match", titleClass: "text-success-600 dark:text-success-400" },
  "Medium Match": { color: "warning", label: "Medium Match", titleClass: "text-warning-600 dark:text-warning-400" },
  "Low Match": { color: "error", label: "Low Match", titleClass: "text-error-600 dark:text-error-400" },
};

const jobs: Job[] = [
  {
    id: 1, title: "Junior Backend Software Engineer", company: "", location: "Unknown", remoteType: "Unknown", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/4427474929/", scrapedAt: parseTimestamp("2026-06-15T15:28:35.977Z"),
    postedAt: parseTimestamp("2026-06-15T09:47:32.000Z"), matchScore: 72, matchCategory: "Medium Match", recommendationAction: "Simpan dulu",
    matchedSkills: ["JavaScript", "Git", "Linux", "Node.js", "TypeScript"], missingSkills: ["English", "C++", "Python", "scala", "java"],
    reasonMatch: "Skill cocok: JavaScript, Git, Linux, Node.js, TypeScript; Gap: English, C++, Python, scala, java; Baru diposting",
    riskOrGap: "English; C++; Python; scala; java", suspiciousFlag: false, suspiciousReason: "",
    experienceRequired: "", educationRequired: "",
  },
  {
    id: 2, title: "Backend Developer", company: "", location: "Unknown", remoteType: "Unknown", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "JobStreet",
    sourceUrl: "https://id.jobstreet.com/id/job/92716162?type=standard&ref=search-standalone",
    scrapedAt: parseTimestamp("2026-06-15T12:30:59.223Z"), postedAt: "-", matchScore: 100, matchCategory: "High Match", recommendationAction: "Butuh riset perusahaan",
    matchedSkills: ["API Development", "REST APIs", "Middleware", "Express.js", "ASP.NET", "Golang"], missingSkills: [],
    reasonMatch: "Skill cocok: API Development, REST APIs, Middleware, Express.js, ASP.NET, Golang; Baru diposting",
    riskOrGap: "", suspiciousFlag: true, suspiciousReason: "Nama perusahaan tidak jelas pada halaman lowongan",
    experienceRequired: "", educationRequired: "",
  },
  {
    id: 3, title: "Test Golang Backend Developer", company: "Test Company", location: "Jakarta", remoteType: "Remote", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/4427474928/", scrapedAt: parseTimestamp("2026-06-15T12:42:56.970Z"),
    postedAt: "-", matchScore: 91, matchCategory: "High Match", recommendationAction: "Apply sekarang",
    matchedSkills: ["Golang", "REST APIs", "API Development", "Middleware", "Express.js", "ASP.NET"], missingSkills: ["Software Testing", "QA"],
    reasonMatch: "Skill cocok: Golang, REST APIs, API Development, Middleware, Express.js, ASP.NET; Gap: Software Testing, QA; Remote work; Baru diposting",
    riskOrGap: "Software Testing; QA", suspiciousFlag: false, suspiciousReason: "",
    experienceRequired: "", educationRequired: "",
  },
  {
    id: 4, title: "前端开发实习生（Vibe Coding全栈方向）", company: "", location: "Unknown", remoteType: "Unknown", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/4428663696/", scrapedAt: parseTimestamp("2026-06-15T15:28:37.412Z"),
    postedAt: parseTimestamp("2026-06-15T03:03:19.000Z"), matchScore: 74, matchCategory: "Medium Match", recommendationAction: "Simpan dulu",
    matchedSkills: ["TypeScript", "Node.js", "Git", "Claude", "SQL", "JavaScript", "PostgreSQL", "React"], missingSkills: ["java", "mysql", "redis", "vue", "SEO"],
    reasonMatch: "Skill cocok: TypeScript, Node.js, Git, Claude, SQL, JavaScript, PostgreSQL, React; Gap: java, mysql, redis, vue, SEO; Baru diposting",
    riskOrGap: "java; mysql; redis; vue; SEO", suspiciousFlag: false, suspiciousReason: "",
    experienceRequired: "", educationRequired: "",
  },
  {
    id: 5, title: "Java Developer", company: "", location: "Unknown", remoteType: "Unknown", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/4427703642/", scrapedAt: parseTimestamp("2026-06-15T15:28:35.375Z"),
    postedAt: parseTimestamp("2026-06-15T13:00:49.000Z"), matchScore: 67, matchCategory: "Medium Match", recommendationAction: "Pertimbangkan",
    matchedSkills: ["JavaScript", "Git", "SQL", "TypeScript", "React"], missingSkills: ["Management", "microservices", "spring", "redis"],
    reasonMatch: "Skill cocok: JavaScript, Git, SQL, TypeScript, React; Gap: Management, microservices, spring, redis; Baru diposting",
    riskOrGap: "Management; microservices; spring; redis", suspiciousFlag: false, suspiciousReason: "",
    experienceRequired: "", educationRequired: "",
  },
  {
    id: 6, title: "Social Media Specialist", company: "Unknown", location: "Indonesia", remoteType: "Remote", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/4427490377/", scrapedAt: parseTimestamp("2026-06-15T12:04:28.612Z"),
    postedAt: parseTimestamp("2026-06-15T11:10:01.000Z"), matchScore: 62, matchCategory: "Medium Match", recommendationAction: "Pertimbangkan",
    matchedSkills: ["Git"], missingSkills: ["Performance Marketing", "Tiktok Marketing", "Management", "Community Engagement"],
    reasonMatch: "Skill cocok: Git; Gap: Performance Marketing, Tiktok Marketing, Management, Community Engagement; Remote work; Baru diposting",
    riskOrGap: "Performance Marketing; Tiktok Marketing; Management; Community Engagement", suspiciousFlag: false, suspiciousReason: "",
    experienceRequired: "2+ tahun", educationRequired: "S1 Ilmu Komputer / Informatika",
  },
  {
    id: 7, title: "Next Jr & Supabase Engineer", company: "", location: "Unknown", remoteType: "Hybrid", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/4427431885/", scrapedAt: parseTimestamp("2026-06-15T15:28:35.683Z"),
    postedAt: parseTimestamp("2026-06-14T15:42:40.000Z"), matchScore: 70, matchCategory: "Medium Match", recommendationAction: "Butuh riset perusahaan",
    matchedSkills: ["RAG", "Git"], missingSkills: ["Domain Management", "Vercel V0", "Next.js"],
    reasonMatch: "Skill cocok: RAG, Git; Gap: Domain Management, Vercel V0, Next.js; Hybrid; Baru diposting",
    riskOrGap: "Domain Management; Vercel V0; Next.js", suspiciousFlag: true, suspiciousReason: "Meminta biaya pendaftaran: 'transfer'",
    experienceRequired: "", educationRequired: "",
  },
  {
    id: 8, title: "Business Development Specialist", company: "Unknown", location: "Bandung, West Java, Indonesia", remoteType: "Remote", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/4427480618/", scrapedAt: parseTimestamp("2026-06-15T12:04:28.346Z"),
    postedAt: parseTimestamp("2026-06-15T08:45:33.000Z"), matchScore: 62, matchCategory: "Medium Match", recommendationAction: "Pertimbangkan",
    matchedSkills: ["SSIS"], missingSkills: ["Analyze Information", "Databases", "Market Research", "Communication", "Sales"],
    reasonMatch: "Skill cocok: SSIS; Gap: Analyze Information, Databases, Market Research, Communication, Sales; Remote work; Baru diposting",
    riskOrGap: "Analyze Information; Databases; Market Research; Communication; Sales", suspiciousFlag: false, suspiciousReason: "",
    experienceRequired: "2+ tahun", educationRequired: "S1 Ilmu Komputer / Informatika",
  },
  {
    id: 9, title: "Process Improvement & Reengineering Junior Officer", company: "", location: "Unknown", remoteType: "Unknown", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/4427484158/", scrapedAt: parseTimestamp("2026-06-15T15:28:39.172Z"),
    postedAt: parseTimestamp("2026-06-15T06:54:06.000Z"), matchScore: 64, matchCategory: "Medium Match", recommendationAction: "Pertimbangkan",
    matchedSkills: ["Automation"], missingSkills: ["DMAIC", "Business Process", "Data Analytics", "Communication"],
    reasonMatch: "Skill cocok: Automation; Gap: DMAIC, Business Process, Data Analytics, Communication; Baru diposting",
    riskOrGap: "DMAIC; Business Process; Data Analytics; Communication", suspiciousFlag: false, suspiciousReason: "",
    experienceRequired: "", educationRequired: "",
  },
  {
    id: 10, title: "Office Boy", company: "", location: "Unknown", remoteType: "Unknown", employmentType: "Full-time", salary: "Tidak dicantumkan", source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/4427484721/", scrapedAt: parseTimestamp("2026-06-15T15:28:37.124Z"),
    postedAt: parseTimestamp("2026-06-15T10:07:28.000Z"), matchScore: 58, matchCategory: "Low Match", recommendationAction: "Skip",
    matchedSkills: ["Git"], missingSkills: ["Editing", "Event Management", "Spanish", "Retail"],
    reasonMatch: "Skill cocok: Git; Gap: Editing, Event Management, Spanish, Retail; Baru diposting",
    riskOrGap: "Editing; Event Management; Spanish; Retail", suspiciousFlag: false, suspiciousReason: "",
    experienceRequired: "", educationRequired: "",
  },
];

const categoryOptions = [
  { label: "Semua kategori", dotClass: "bg-gray-400" },
  { label: "High Match", dotClass: "bg-success-500" },
  { label: "Medium Match", dotClass: "bg-warning-500" },
  { label: "Low Match", dotClass: "bg-error-500" },
];

const jobsPerPage = 5;

const statCards = [
  { label: "Total hasil scraping", value: "169", detail: "162 baru, 6 mencurigakan", tone: "text-gray-800 dark:text-white/90" },
  { label: "High Match", value: "2", detail: "Siap untuk dilamar", tone: "text-success-600" },
  { label: "Perlu review", value: "6", detail: "Mencurigakan / data tidak lengkap", tone: "text-warning-600" },
];

export default function ScrapedJobs() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [activeTab, setActiveTab] = useState<JobTab>("Scraped");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id);
  const [shortlisted, setShortlisted] = useState<number[]>([]);
  const [applied, setApplied] = useState<number[]>([]);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (!categoryDropdownRef.current?.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const filteredJobs = useMemo(
    () => jobs.filter((job) => {
      const matchesTab = activeTab === "Applied" ? applied.includes(job.id)
        : activeTab === "Shortlist" ? shortlisted.includes(job.id) && !applied.includes(job.id)
        : !shortlisted.includes(job.id) && !applied.includes(job.id);
      const matchesQuery = `${job.title} ${job.company} ${job.matchedSkills.join(" ")}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "Semua kategori" || job.matchCategory === category;
      return matchesTab && matchesQuery && matchesCategory;
    }),
    [activeTab, applied, query, shortlisted, category],
  );

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));
  const pageStart = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(pageStart, pageStart + jobsPerPage);
  const selectedJob =
    paginatedJobs.find((job) => job.id === selectedJobId) ?? paginatedJobs[0] ?? null;

  const toggleShortlist = (id: number) => {
    setCurrentPage(1);
    setApplied((cur) => cur.filter((item) => item !== id));
    setShortlisted((cur) => cur.includes(id) ? cur.filter((item) => item !== id) : [...cur, id]);
  };

  const toggleApplied = (id: number) => {
    setCurrentPage(1);
    setShortlisted((cur) => cur.filter((item) => item !== id));
    setApplied((cur) => cur.includes(id) ? cur.filter((item) => item !== id) : [...cur, id]);
  };

  const exportJobs = async () => {
    const XLSX = await import("xlsx");
    const rows = filteredJobs.map((job) => ({
      Posisi: job.title, Perusahaan: job.company || "-", Lokasi: job.location, "Tipe": job.remoteType,
      "Jenis employment": job.employmentType, Gaji: job.salary, Sumber: job.source, "Tautan sumber": job.sourceUrl,
      Diposting: job.postedAt, "Waktu scraping": job.scrapedAt, "AI match": `${job.matchScore}%`, Kategori: job.matchCategory,
      Rekomendasi: job.recommendationAction, "Skill cocok": job.matchedSkills.join(", "), "Skill kurang": job.missingSkills.join(", "),
      Alasan: job.reasonMatch, "Risk / Gap": job.riskOrGap,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [{ wch: 28 }, { wch: 20 }, { wch: 22 }, { wch: 14 }, { wch: 16 }, { wch: 20 }, { wch: 14 }, { wch: 50 }, { wch: 14 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 18 }, { wch: 36 }, { wch: 36 }, { wch: 60 }, { wch: 40 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);
    XLSX.writeFile(workbook, `hermes-${activeTab.toLowerCase()}-${category.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const tabItems: JobTab[] = ["Scraped", "Shortlist", "Applied"];

  return (
    <>
      <PageMeta title="Scraped Jobs | Hermes" description="Hasil scraping lowongan kerja oleh AI agent" />
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Hasil scraping lowongan</h1>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">Review, kurasi, dan tindak lanjuti lowongan yang ditemukan oleh agent.</p>
        </div>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${card.tone}`}>{card.value}</p>
            <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">{card.detail}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-h-[680px] min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-100 p-4 dark:border-gray-800 sm:p-5">
            <div className="flex flex-col gap-4">
              <div role="tablist" aria-label="Kategori lowongan" className="flex w-fit gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1 shadow-inner dark:border-gray-800 dark:bg-gray-900/60">
                {tabItems.map((tab) => (
                  <button key={tab} type="button" role="tab" aria-selected={activeTab === tab}
                    onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                    className={`flex h-9 shrink-0 items-center rounded-lg px-4 text-theme-sm font-medium transition ${activeTab === tab ? "bg-gray-900 text-white shadow-theme-xs ring-1 ring-gray-900 dark:bg-brand-400/15 dark:text-brand-300 dark:ring-brand-400/20" : "text-gray-500 hover:bg-white hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="relative min-w-0 flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <input value={query} onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }} placeholder="Cari posisi, perusahaan..."
                    className="h-10 w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-3 text-theme-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-50 dark:border-gray-700 dark:text-white/90"/>
                </div>
                <div ref={categoryDropdownRef} className="relative">
                  <svg className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${category === "Semua kategori" ? "text-gray-400" : "text-brand-400"}`} width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <button type="button" onClick={() => setIsCategoryOpen((cur) => !cur)} aria-label="Filter berdasarkan kategori" aria-haspopup="listbox" aria-expanded={isCategoryOpen}
                    className={`h-10 w-full rounded-lg border bg-white py-2 pl-9 pr-9 text-left text-theme-sm font-medium shadow-theme-xs outline-none transition focus:border-brand-300 focus:ring-3 focus:ring-brand-50 dark:bg-gray-900 sm:w-44 ${category === "Semua kategori" ? "border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300" : "border-brand-200 bg-brand-25 text-gray-800 dark:border-brand-500/30 dark:bg-brand-500/[0.06] dark:text-white/90"}`}>
                    {category}
                  </button>
                  <svg className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {isCategoryOpen && (
                    <div role="listbox" className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-theme-lg dark:border-gray-700 dark:bg-gray-900">
                      <p className="px-3 pb-2 pt-1.5 text-theme-xs font-medium uppercase tracking-wide text-gray-400">Filter kategori</p>
                      {categoryOptions.map((option) => {
                        const isSelected = category === option.label;
                        return (
                          <button key={option.label} type="button" role="option" aria-selected={isSelected}
                            onClick={() => { setCategory(option.label); setCurrentPage(1); setIsCategoryOpen(false); }}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${isSelected ? "bg-brand-50 text-gray-900 dark:bg-brand-500/10 dark:text-white" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"}`}>
                            <span className={`size-2 shrink-0 rounded-full ${option.dotClass}`}/>
                            <span className="flex-1 text-theme-sm font-medium">{option.label}</span>
                            {isSelected && <svg className="text-success-600" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button type="button" onClick={exportJobs} disabled={filteredJobs.length === 0}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5">
                  Export XLSX
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-full flex-1 overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]">
                <TableRow>
                  {["Posisi", "Sumber & waktu", "AI match", "Kategori", "Tipe", ""].map((heading) => (
                    <TableCell key={heading || "action"} isHeader className="px-5 py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{heading}</TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedJobs.map((job) => (
                  <TableRow key={job.id} className={`transition hover:bg-gray-50 dark:hover:bg-white/[0.02] ${selectedJob?.id === job.id ? "bg-brand-25 dark:bg-brand-500/[0.04]" : ""}`}>
                    <TableCell className="px-5 py-3">
                      <button onClick={() => setSelectedJobId(job.id)} className="flex min-h-[72px] min-w-72 items-center gap-3 text-left">
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-theme-sm font-semibold ${getCompanyColor(job.id)}`}>
                          {getInitials(job.company, job.title)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-gray-800 dark:text-white/90">{job.title}</span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-theme-xs text-gray-500 dark:text-gray-400">
                            <span>{job.company && job.company !== "Unknown" ? job.company : "Perusahaan tidak diketahui"}</span>
                            <span className="size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                            <span>{job.location !== "Unknown" ? job.location : "Lokasi tidak diketahui"}</span>
                            {job.remoteType !== "Unknown" && (
                              <>
                                <span className="size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                <span>{job.remoteType}</span>
                              </>
                            )}
                          </span>
                          {job.suspiciousFlag && (
                            <span className="mt-1.5 flex items-center">
                              <span className="inline-flex items-center gap-1 rounded-md bg-error-50 px-1.5 py-0.5 text-theme-xs font-medium text-error-600 dark:bg-error-500/10 dark:text-error-400">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                Mencurigakan
                              </span>
                            </span>
                          )}
                        </span>
                      </button>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <p className="text-theme-sm text-gray-700 dark:text-gray-300">{job.source}</p>
                      <p className="mt-1 text-theme-xs text-gray-400">Diambil {job.scrapedAt}</p>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 dark:text-white/90">{job.matchScore}%</span>
                        <span className="h-1.5 w-14 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <span className={`block h-full rounded-full ${job.matchScore >= 80 ? "bg-success-500" : job.matchScore >= 60 ? "bg-warning-500" : "bg-error-500"}`} style={{ width: `${job.matchScore}%` }}/>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4"><Badge color={matchCategoryBadge[job.matchCategory].color} size="sm">{matchCategoryBadge[job.matchCategory].label}</Badge></TableCell>
                    <TableCell className="px-5 py-4"><span className="rounded-md bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-400">{job.employmentType}</span></TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <button onClick={() => toggleShortlist(job.id)} aria-label="Shortlist lowongan"
                        className={`rounded-lg border p-2 ${shortlisted.includes(job.id) ? "border-warning-200 bg-warning-50 text-warning-600" : "border-gray-200 text-gray-400 hover:text-warning-600 dark:border-gray-700"}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={shortlisted.includes(job.id) ? "currentColor" : "none"}><path d="M12 17.3 5.8 21l1.65-7L2 9.3l7.2-.6L12 2l2.8 6.7 7.2.6-5.45 4.7 1.65 7L12 17.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredJobs.length === 0 && (
              <div className="flex min-h-72 flex-col items-center justify-center px-5 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M8 7V5.8A2.8 2.8 0 0 1 10.8 3h2.4A2.8 2.8 0 0 1 16 5.8V7m-9 0h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm-2 5h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                </span>
                <p className="mt-3 text-theme-sm font-medium text-gray-700 dark:text-gray-300">Belum ada lowongan</p>
                <p className="mt-1 max-w-xs text-theme-xs leading-5 text-gray-500 dark:text-gray-400">
                  Tidak ada data di tab {activeTab} yang cocok dengan pencarian atau filter aktif.
                </p>
              </div>
            )}
          </div>
          <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-theme-xs text-gray-500 dark:text-gray-400">
              {filteredJobs.length > 0 ? `Menampilkan ${pageStart + 1}-${Math.min(pageStart + jobsPerPage, filteredJobs.length)} dari ${filteredJobs.length} lowongan` : "Tidak ada lowongan"}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Halaman sebelumnya"
                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m14.5 7-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} type="button" onClick={() => setCurrentPage(page)} aria-label={`Halaman ${page}`} aria-current={currentPage === page ? "page" : undefined}
                  className={`size-8 rounded-lg text-theme-xs font-medium transition ${currentPage === page ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"}`}>
                  {page}
                </button>
              ))}
              <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Halaman berikutnya"
                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m9.5 7 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </section>
        {selectedJob ? (
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] xl:sticky xl:top-24">
          <div className="flex items-center gap-3">
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-theme-sm font-semibold ${getCompanyColor(selectedJob.id)}`}>{getInitials(selectedJob.company, selectedJob.title)}</span>
            <div><p className={`font-semibold ${matchCategoryBadge[selectedJob.matchCategory].titleClass}`}>{selectedJob.title}</p><p className="text-theme-xs text-gray-500 dark:text-gray-400">{selectedJob.company || "-"}</p></div>
          </div>
          {selectedJob.suspiciousFlag && (
            <div className="mt-3 rounded-lg border border-error-200 bg-error-50 p-3 dark:border-error-500/20 dark:bg-error-500/[0.05]">
              <p className="flex items-center gap-1.5 text-theme-xs font-semibold text-error-600 dark:text-error-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>Lowongan mencurigakan</p>
              <p className="mt-1 text-theme-xs leading-5 text-gray-600 dark:text-gray-400">{selectedJob.suspiciousReason}</p>
            </div>
          )}
          <div className="my-5 grid grid-cols-2 gap-3">
            <Detail label="Lokasi" value={selectedJob.location !== "Unknown" ? selectedJob.location : "Tidak diketahui"}/><Detail label="Tipe" value={selectedJob.remoteType}/>
            <Detail label="Employment" value={selectedJob.employmentType}/><Detail label="Diposting" value={selectedJob.postedAt}/>
            <Detail label="Sumber" value={selectedJob.source}/><Detail label="Rekomendasi" value={selectedJob.recommendationAction}/>
          </div>
          {(selectedJob.experienceRequired || selectedJob.educationRequired) && (
            <div className="mb-5 grid grid-cols-2 gap-3">
              {selectedJob.experienceRequired && <Detail label="Pengalaman" value={selectedJob.experienceRequired}/>}
              {selectedJob.educationRequired && <Detail label="Pendidikan" value={selectedJob.educationRequired}/>}
            </div>
          )}
          <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
            <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">Tautan sumber</p>
            <a href={selectedJob.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-theme-sm font-medium text-gray-700 transition hover:border-brand-200 hover:bg-brand-25 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
              <span className="min-w-0 flex-1 truncate">{selectedJob.sourceUrl}</span>
              <svg className="shrink-0 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 5h5v5m0-5-8 8m6 0v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="mt-5">
            <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">Ringkasan agent</p>
            <p className="mt-2 text-theme-sm leading-6 text-gray-600 dark:text-gray-300">{selectedJob.reasonMatch}</p>
          </div>
          {selectedJob.matchedSkills.length > 0 && (
            <div className="mt-5">
              <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">Skill cocok<span className="ml-1 text-success-500">●</span></p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedJob.matchedSkills.map((skill) => (<span key={skill} className="rounded-md bg-success-50 px-2.5 py-1 text-theme-xs font-medium text-success-700 dark:bg-success-500/10 dark:text-success-400">{skill}</span>))}
              </div>
            </div>
          )}
          {selectedJob.missingSkills.length > 0 && (
            <div className="mt-3">
              <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">Skill kurang<span className="ml-1 text-error-500">●</span></p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedJob.missingSkills.map((skill) => (<span key={skill} className="rounded-md bg-error-50 px-2.5 py-1 text-theme-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400">{skill}</span>))}
              </div>
            </div>
          )}
          {selectedJob.riskOrGap && (
            <div className="mt-5 rounded-xl border border-brand-100 bg-brand-25 p-4 dark:border-brand-500/20 dark:bg-brand-500/[0.05]">
              <div className="flex items-center justify-between"><p className="text-theme-xs font-semibold text-gray-800 dark:text-white/90">Catatan AI agent</p><span className="text-theme-xs font-semibold text-success-600">{selectedJob.matchScore}% match</span></div>
              <p className="mt-2 text-theme-xs leading-5 text-gray-600 dark:text-gray-400">{selectedJob.riskOrGap}</p>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button onClick={() => toggleShortlist(selectedJob.id)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-theme-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
              {shortlisted.includes(selectedJob.id) ? "Hapus shortlist" : "Shortlist"}
            </button>
            <button onClick={() => toggleApplied(selectedJob.id)} className="flex-1 rounded-lg bg-gray-900 px-3 py-2.5 text-theme-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900">
              {applied.includes(selectedJob.id) ? "Batalkan applied" : "Tandai applied"}
            </button>
          </div>
        </aside>
        ) : (
          <aside className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6 text-center dark:border-gray-700 dark:bg-white/[0.02] xl:sticky xl:top-24">
            <div>
              <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Detail lowongan belum tersedia</p>
              <p className="mt-1 text-theme-xs leading-5 text-gray-500 dark:text-gray-400">
                Pilih tab atau ubah filter untuk menampilkan detail lowongan.
              </p>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-white/[0.03]">
      <p className="text-theme-xs text-gray-400">{label}</p>
      <p className="mt-1 text-theme-sm font-medium text-gray-700 dark:text-gray-300">{value || "-"}</p>
    </div>
  );
}
