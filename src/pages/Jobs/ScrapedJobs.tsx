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

type JobStatus = "Terverifikasi" | "Perlu review";
type JobTab = "Scraped" | "Shortlist" | "Applied";

type Job = {
  id: number;
  title: string;
  company: string;
  initials: string;
  companyColor: string;
  location: string;
  workMode: string;
  salary: string;
  source: string;
  scrapedAt: string;
  postedAt: string;
  matchScore: number;
  status: JobStatus;
  skills: string[];
  summary: string;
  agentNote: string;
  url: string;
};

const jobs: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Nusantara Digital",
    initials: "ND",
    companyColor: "bg-blue-light-50 text-blue-light-700",
    location: "Jakarta Selatan",
    workMode: "Hybrid",
    salary: "Rp25 - 35 jt",
    source: "LinkedIn",
    scrapedAt: "10 menit lalu",
    postedAt: "Hari ini",
    matchScore: 94,
    status: "Terverifikasi",
    skills: ["React", "TypeScript", "Design System"],
    summary:
      "Memimpin pengembangan frontend untuk produk B2B dan menjaga kualitas design system lintas squad.",
    agentNote:
      "Requirement sangat relevan dengan profil target. Salary dan lokasi berhasil diekstrak dengan confidence tinggi.",
    url: "linkedin.com/jobs/nd-frontend",
  },
  {
    id: 2,
    title: "Backend Engineer (Go)",
    company: "Finara Teknologi",
    initials: "FT",
    companyColor: "bg-success-50 text-success-700",
    location: "Remote, Indonesia",
    workMode: "Remote",
    salary: "Rp20 - 30 jt",
    source: "Glints",
    scrapedAt: "24 menit lalu",
    postedAt: "Hari ini",
    matchScore: 91,
    status: "Terverifikasi",
    skills: ["Golang", "PostgreSQL", "Microservices"],
    summary:
      "Mengembangkan service pembayaran ber-volume tinggi menggunakan Go, PostgreSQL, dan event-driven architecture.",
    agentNote:
      "Deskripsi lengkap dan URL aktif. Agent menemukan indikasi role ini menerima kandidat seluruh Indonesia.",
    url: "glints.com/id/opportunities/finara-go",
  },
  {
    id: 3,
    title: "Product Designer",
    company: "RuangKarya",
    initials: "RK",
    companyColor: "bg-theme-purple-500/10 text-theme-purple-500",
    location: "Bandung",
    workMode: "On-site",
    salary: "Tidak dicantumkan",
    source: "JobStreet",
    scrapedAt: "42 menit lalu",
    postedAt: "Kemarin",
    matchScore: 86,
    status: "Perlu review",
    skills: ["Figma", "Research", "Prototyping"],
    summary:
      "Mendesain pengalaman end-to-end untuk platform kolaborasi kreator dan melakukan user research rutin.",
    agentNote:
      "Salary tidak tersedia dan seniority ambigu. Perlu validasi manual sebelum didistribusikan.",
    url: "jobstreet.co.id/ruangkarya-designer",
  },
  {
    id: 4,
    title: "AI / ML Engineer",
    company: "Cerdas AI Labs",
    initials: "CA",
    companyColor: "bg-orange-50 text-orange-700",
    location: "Jakarta Pusat",
    workMode: "Hybrid",
    salary: "Rp28 - 40 jt",
    source: "Kalibrr",
    scrapedAt: "1 jam lalu",
    postedAt: "2 hari lalu",
    matchScore: 82,
    status: "Terverifikasi",
    skills: ["Python", "LLM", "MLOps"],
    summary:
      "Membangun pipeline dan agent berbasis LLM untuk otomasi proses bisnis pada skala enterprise.",
    agentNote:
      "Semua field utama berhasil diparsing. Posisi memiliki kata kunci prioritas untuk pipeline AI.",
    url: "kalibrr.com/c/jobs/cerdas-ai",
  },
  {
    id: 5,
    title: "Software Engineer",
    company: "Finara Teknologi",
    initials: "FT",
    companyColor: "bg-success-50 text-success-700",
    location: "Remote, Indonesia",
    workMode: "Remote",
    salary: "Rp20 - 30 jt",
    source: "LinkedIn",
    scrapedAt: "2 jam lalu",
    postedAt: "Hari ini",
    matchScore: 78,
    status: "Terverifikasi",
    skills: ["Golang", "PostgreSQL", "Docker"],
    summary:
      "Mengembangkan layanan backend pembayaran dan berkolaborasi dengan tim platform.",
    agentNote:
      "Posisi berasal dari tim berbeda dan memiliki fokus platform engineering yang lebih kuat.",
    url: "linkedin.com/jobs/finara-engineer",
  },
  {
    id: 6,
    title: "Mobile Engineer (Flutter)",
    company: "Kelana Mobility",
    initials: "KM",
    companyColor: "bg-blue-light-50 text-blue-light-700",
    location: "Jakarta Selatan",
    workMode: "Hybrid",
    salary: "Rp18 - 27 jt",
    source: "Glints",
    scrapedAt: "2 jam lalu",
    postedAt: "Kemarin",
    matchScore: 89,
    status: "Terverifikasi",
    skills: ["Flutter", "Dart", "Firebase"],
    summary:
      "Mengembangkan aplikasi mobilitas konsumen dan meningkatkan stabilitas serta performa aplikasi.",
    agentNote:
      "Informasi salary, lokasi, dan requirement teknis berhasil diekstrak secara lengkap.",
    url: "glints.com/id/opportunities/kelana-flutter",
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "Awan Infrastruktur",
    initials: "AI",
    companyColor: "bg-success-50 text-success-700",
    location: "Remote, Indonesia",
    workMode: "Remote",
    salary: "Rp24 - 34 jt",
    source: "LinkedIn",
    scrapedAt: "3 jam lalu",
    postedAt: "2 hari lalu",
    matchScore: 88,
    status: "Terverifikasi",
    skills: ["Kubernetes", "AWS", "Terraform"],
    summary:
      "Mengelola cloud infrastructure dan membangun platform deployment untuk tim engineering.",
    agentNote:
      "Role sangat relevan untuk kandidat DevOps senior dan menerima pelamar dari seluruh Indonesia.",
    url: "linkedin.com/jobs/awan-devops",
  },
  {
    id: 8,
    title: "Data Analyst",
    company: "Insight Nusantara",
    initials: "IN",
    companyColor: "bg-theme-purple-500/10 text-theme-purple-500",
    location: "Surabaya",
    workMode: "On-site",
    salary: "Tidak dicantumkan",
    source: "JobStreet",
    scrapedAt: "4 jam lalu",
    postedAt: "3 hari lalu",
    matchScore: 76,
    status: "Perlu review",
    skills: ["SQL", "Tableau", "Python"],
    summary:
      "Mengolah data operasional menjadi insight dan dashboard untuk mendukung keputusan bisnis.",
    agentNote:
      "Salary dan level seniority belum tersedia sehingga perlu pemeriksaan manual.",
    url: "jobstreet.co.id/insight-data-analyst",
  },
  {
    id: 9,
    title: "QA Automation Engineer",
    company: "Mutu Digital",
    initials: "MD",
    companyColor: "bg-orange-50 text-orange-700",
    location: "Yogyakarta",
    workMode: "Hybrid",
    salary: "Rp15 - 22 jt",
    source: "Kalibrr",
    scrapedAt: "5 jam lalu",
    postedAt: "3 hari lalu",
    matchScore: 84,
    status: "Terverifikasi",
    skills: ["Playwright", "API Testing", "CI/CD"],
    summary:
      "Membangun automation test suite untuk aplikasi web dan API di dalam delivery pipeline.",
    agentNote:
      "Lowongan memiliki requirement dan benefit yang lengkap serta URL sumber masih aktif.",
    url: "kalibrr.com/c/jobs/mutu-qa",
  },
  {
    id: 10,
    title: "Technical Product Manager",
    company: "Solusi Bersama",
    initials: "SB",
    companyColor: "bg-blue-light-50 text-blue-light-700",
    location: "Tangerang",
    workMode: "Hybrid",
    salary: "Rp22 - 32 jt",
    source: "LinkedIn",
    scrapedAt: "6 jam lalu",
    postedAt: "4 hari lalu",
    matchScore: 81,
    status: "Perlu review",
    skills: ["Product Strategy", "API", "Analytics"],
    summary:
      "Mengelola roadmap produk integrasi dan bekerja erat dengan tim engineering serta bisnis.",
    agentNote:
      "Deskripsi lengkap, tetapi pengalaman minimum memiliki dua nilai berbeda pada halaman sumber.",
    url: "linkedin.com/jobs/solusi-product-manager",
  },
];

const statusColor: Record<JobStatus, "success" | "warning"> = {
  Terverifikasi: "success",
  "Perlu review": "warning",
};

const statusOptions = [
  { label: "Semua status", dotClass: "bg-gray-400" },
  {
    label: "Terverifikasi",
    dotClass: "bg-success-500",
  },
  {
    label: "Perlu review",
    dotClass: "bg-warning-500",
  },
];

const jobsPerPage = 5;

const statCards = [
  { label: "Total hasil scraping", value: "1.284", detail: "+186 hari ini", tone: "text-gray-800 dark:text-white/90" },
  { label: "Lowongan baru", value: "186", detail: "Dalam 24 jam terakhir", tone: "text-success-600" },
  { label: "Perlu direview", value: "23", detail: "Data belum lengkap", tone: "text-warning-600" },
];

export default function ScrapedJobs() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua status");
  const [activeTab, setActiveTab] = useState<JobTab>("Scraped");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id);
  const [shortlisted, setShortlisted] = useState<number[]>([1]);
  const [applied, setApplied] = useState<number[]>([4]);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (!statusDropdownRef.current?.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const matchesTab =
          activeTab === "Applied"
            ? applied.includes(job.id)
            : activeTab === "Shortlist"
              ? shortlisted.includes(job.id) && !applied.includes(job.id)
              : !shortlisted.includes(job.id) && !applied.includes(job.id);
        const matchesQuery = `${job.title} ${job.company} ${job.skills.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus = status === "Semua status" || job.status === status;
        return matchesTab && matchesQuery && matchesStatus;
      }),
    [activeTab, applied, query, shortlisted, status],
  );

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));
  const pageStart = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(pageStart, pageStart + jobsPerPage);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? jobs[0];

  const toggleShortlist = (id: number) => {
    setCurrentPage(1);
    setApplied((current) => current.filter((item) => item !== id));
    setShortlisted((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleApplied = (id: number) => {
    setCurrentPage(1);
    setShortlisted((current) => current.filter((item) => item !== id));
    setApplied((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const exportJobs = async () => {
    const XLSX = await import("xlsx");
    const rows = filteredJobs.map((job) => ({
      Posisi: job.title,
      Perusahaan: job.company,
      Lokasi: job.location,
      "Tipe kerja": job.workMode,
      Gaji: job.salary,
      Sumber: job.source,
      "Tautan sumber": `https://${job.url}`,
      Diposting: job.postedAt,
      "Waktu scraping": job.scrapedAt,
      "AI match": `${job.matchScore}%`,
      Status: job.status,
      Skills: job.skills.join(", "),
      Ringkasan: job.summary,
      "Catatan AI agent": job.agentNote,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 28 },
      { wch: 24 },
      { wch: 22 },
      { wch: 14 },
      { wch: 20 },
      { wch: 14 },
      { wch: 42 },
      { wch: 14 },
      { wch: 18 },
      { wch: 12 },
      { wch: 16 },
      { wch: 36 },
      { wch: 60 },
      { wch: 70 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);

    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(
      workbook,
      `hermes-${activeTab.toLowerCase()}-${normalizedStatus}-${date}.xlsx`,
    );
  };

  const tabItems: JobTab[] = ["Scraped", "Shortlist", "Applied"];

  return (
    <>
      <PageMeta
        title="Scraped Jobs | Hermes"
        description="Hasil scraping lowongan kerja oleh AI agent"
      />

      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Hasil scraping lowongan
          </h1>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Review, kurasi, dan tindak lanjuti lowongan yang ditemukan oleh agent.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${card.tone}`}>{card.value}</p>
            <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-h-[680px] min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-100 px-4 pb-4 pt-4 dark:border-gray-800 sm:px-5 sm:pb-5 sm:pt-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari posisi, perusahaan..."
                    className="h-10 w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-3 text-theme-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-50 dark:border-gray-700 dark:text-white/90 sm:w-64"
                  />
                </div>
                <div ref={statusDropdownRef} className="relative">
                  <svg
                    className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                      status === "Semua status" ? "text-gray-400" : "text-brand-400"
                    }`}
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M4 6h16M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setIsStatusOpen((current) => !current)}
                    aria-label="Filter berdasarkan status"
                    aria-haspopup="listbox"
                    aria-expanded={isStatusOpen}
                    className={`h-10 w-full rounded-lg border bg-white py-2 pl-9 pr-9 text-left text-theme-sm font-medium shadow-theme-xs outline-none transition focus:border-brand-300 focus:ring-3 focus:ring-brand-50 dark:bg-gray-900 sm:w-44 ${
                      status === "Semua status"
                        ? "border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                        : "border-brand-200 bg-brand-25 text-gray-800 dark:border-brand-500/30 dark:bg-brand-500/[0.06] dark:text-white/90"
                    }`}
                  >
                    {status}
                  </button>
                  <svg
                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${
                      isStatusOpen ? "rotate-180" : ""
                    }`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {isStatusOpen && (
                    <div
                      role="listbox"
                      className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-theme-lg dark:border-gray-700 dark:bg-gray-900"
                    >
                      <p className="px-3 pb-2 pt-1.5 text-theme-xs font-medium uppercase tracking-wide text-gray-400">
                        Filter status
                      </p>
                      {statusOptions.map((option) => {
                        const isSelected = status === option.label;

                        return (
                          <button
                            key={option.label}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setStatus(option.label);
                              setCurrentPage(1);
                              setIsStatusOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                              isSelected
                                ? "bg-brand-50 text-gray-900 dark:bg-brand-500/10 dark:text-white"
                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                            }`}
                          >
                            <span className={`size-2 shrink-0 rounded-full ${option.dotClass}`} />
                            <span className="flex-1 text-theme-sm font-medium">{option.label}</span>
                            {isSelected && (
                              <svg className="text-success-600" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={exportJobs}
                  disabled={filteredJobs.length === 0}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  Export XLSX
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-full flex-1 overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]">
                <TableRow>
                  {["Posisi", "Sumber & waktu", "AI match", "Status", ""].map((heading) => (
                    <TableCell
                      key={heading || "action"}
                      isHeader
                      className="px-5 py-3 text-start text-theme-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedJobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className={`transition hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
                      selectedJob.id === job.id ? "bg-brand-25 dark:bg-brand-500/[0.04]" : ""
                    }`}
                  >
                    <TableCell className="px-5 py-4">
                      <button onClick={() => setSelectedJobId(job.id)} className="flex min-w-64 items-start gap-3 text-left">
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-theme-sm font-semibold ${job.companyColor}`}>
                          {job.initials}
                        </span>
                        <span>
                          <span className="block font-medium text-gray-800 dark:text-white/90">{job.title}</span>
                          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                            {job.company} · {job.location} · {job.workMode}
                          </span>
                          <span className="mt-1 block text-theme-xs font-medium text-gray-700 dark:text-gray-300">{job.salary}</span>
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
                          <span className="block h-full rounded-full bg-success-500" style={{ width: `${job.matchScore}%` }} />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge color={statusColor[job.status]} size="sm">{job.status}</Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <button
                        onClick={() => toggleShortlist(job.id)}
                        aria-label="Shortlist lowongan"
                        className={`rounded-lg border p-2 ${
                          shortlisted.includes(job.id)
                            ? "border-warning-200 bg-warning-50 text-warning-600"
                            : "border-gray-200 text-gray-400 hover:text-warning-600 dark:border-gray-700"
                        }`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={shortlisted.includes(job.id) ? "currentColor" : "none"}>
                          <path d="M12 17.3 5.8 21l1.65-7L2 9.3l7.2-.6L12 2l2.8 6.7 7.2.6-5.45 4.7 1.65 7L12 17.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredJobs.length === 0 && (
              <div className="px-5 py-14 text-center text-theme-sm text-gray-500">
                Tidak ada lowongan di tab {activeTab} yang cocok dengan filter.
              </div>
            )}
          </div>
          <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-theme-xs text-gray-500 dark:text-gray-400">
              {filteredJobs.length > 0
                ? `Menampilkan ${pageStart + 1}-${Math.min(pageStart + jobsPerPage, filteredJobs.length)} dari ${filteredJobs.length} lowongan`
                : "Tidak ada lowongan"}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="m14.5 7-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Halaman ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`size-8 rounded-lg text-theme-xs font-medium transition ${
                    currentPage === page
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="m9.5 7 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-theme-sm font-semibold ${selectedJob.companyColor}`}>
                {selectedJob.initials}
              </span>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white/90">{selectedJob.title}</p>
                <p className="text-theme-xs text-gray-500 dark:text-gray-400">{selectedJob.company}</p>
              </div>
            </div>
            <Badge color={statusColor[selectedJob.status]} size="sm">{selectedJob.status}</Badge>
          </div>

          <div className="my-5 grid grid-cols-2 gap-3">
            <Detail label="Lokasi" value={selectedJob.location} />
            <Detail label="Tipe kerja" value={selectedJob.workMode} />
            <Detail label="Diposting" value={selectedJob.postedAt} />
            <Detail label="Sumber" value={selectedJob.source} />
          </div>

          <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
            <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">Tautan sumber</p>
            <a
              href={`https://${selectedJob.url}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-theme-sm font-medium text-gray-700 transition hover:border-brand-200 hover:bg-brand-25 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300"
            >
              <span className="min-w-0 flex-1 truncate">{selectedJob.url}</span>
              <svg className="shrink-0 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14 5h5v5m0-5-8 8m6 0v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="mt-5">
            <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">Ringkasan agent</p>
            <p className="mt-2 text-theme-sm leading-6 text-gray-600 dark:text-gray-300">{selectedJob.summary}</p>
          </div>

          <div className="mt-5">
            <p className="text-theme-xs font-medium uppercase tracking-wide text-gray-400">Skill terdeteksi</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedJob.skills.map((skill) => (
                <span key={skill} className="rounded-md bg-gray-100 px-2.5 py-1 text-theme-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-brand-100 bg-brand-25 p-4 dark:border-brand-500/20 dark:bg-brand-500/[0.05]">
            <div className="flex items-center justify-between">
              <p className="text-theme-xs font-semibold text-gray-800 dark:text-white/90">Catatan AI agent</p>
              <span className="text-theme-xs font-semibold text-success-600">{selectedJob.matchScore}% match</span>
            </div>
            <p className="mt-2 text-theme-xs leading-5 text-gray-600 dark:text-gray-400">{selectedJob.agentNote}</p>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => toggleShortlist(selectedJob.id)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-theme-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              {shortlisted.includes(selectedJob.id) ? "Hapus shortlist" : "Shortlist"}
            </button>
            <button
              onClick={() => toggleApplied(selectedJob.id)}
              className="flex-1 rounded-lg bg-gray-900 px-3 py-2.5 text-theme-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
            >
              {applied.includes(selectedJob.id) ? "Batalkan applied" : "Tandai applied"}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-white/[0.03]">
      <p className="text-theme-xs text-gray-400">{label}</p>
      <p className="mt-1 text-theme-sm font-medium text-gray-700 dark:text-gray-300">{value}</p>
    </div>
  );
}
