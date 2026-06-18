import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "./useDebounce";

// ── Types ────────────────────────────────────────────────────────────

export type MatchCategory = "High Match" | "Medium Match" | "Low Match";
export type JobTab = "Scraped" | "Shortlist" | "Applied";

export interface BackendJob {
  id: number;
  job_title: string;
  company: string;
  location: string;
  remote_type: string;
  employment_type: string;
  salary_range: string;
  source: string;
  source_url: string;
  scraped_at?: string;
  posted_at?: string;
  match_score: number;
  match_category: string;
  recommendation_action: string;
  matched_skills: string[];
  missing_skills: string[];
  reason_match: string;
  risk_or_gap: string;
  suspicious_flag: boolean;
  suspicious_reason: string;
  experience_required: string;
  education_required: string;
  user_state?: string;
  user_note?: string;
  applied_at?: string;
}

export interface Job {
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
  userState: "" | "shortlist" | "applied";
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface JobsResponse {
  data: BackendJob[];
  meta: PaginationMeta;
}

interface StatsResponse {
  data: {
    scraped: number;
    shortlist: number;
    applied: number;
    high_match: number;
    suspicious: number;
    total_active: number;
  };
}

export interface StatCardData {
  label: string;
  value: string;
  detail: string;
  tone: string;
}

export interface ToastState {
  message: string;
  type: "success" | "error";
}

// ── Constants ────────────────────────────────────────────────────────

const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  "https://api.myhermesservice.online/api"
).replace(/\/+$/, "");

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

export const categoryOptions = [
  { label: "Semua kategori", dotClass: "bg-gray-400" },
  { label: "High Match", dotClass: "bg-success-500" },
  { label: "Medium Match", dotClass: "bg-warning-500" },
  { label: "Low Match", dotClass: "bg-error-500" },
];

const jobsPerPage = 5;

export const matchCategoryBadge: Record<
  MatchCategory,
  { color: "success" | "warning" | "error"; label: string; titleClass: string }
> = {
  "High Match": {
    color: "success",
    label: "High Match",
    titleClass: "text-success-600 dark:text-success-400",
  },
  "Medium Match": {
    color: "warning",
    label: "Medium Match",
    titleClass: "text-warning-600 dark:text-warning-400",
  },
  "Low Match": {
    color: "error",
    label: "Low Match",
    titleClass: "text-error-600 dark:text-error-400",
  },
};

// ── Pure helpers ─────────────────────────────────────────────────────

export function getInitials(name: string, fallback?: string): string {
  if (!name || name === "Unknown") {
    return fallback ? fallback.charAt(0).toUpperCase() : "?";
  }
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function getCompanyColor(index: number): string {
  return COMPANY_COLORS[index % COMPANY_COLORS.length];
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (Number.isNaN(mins)) return "-";
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  return `${days} hari lalu`;
}

export function parseTimestamp(timestamp?: string): string {
  if (!timestamp) return "-";
  return timeAgo(new Date(timestamp));
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export function normalizeMatchCategory(value: string): MatchCategory {
  if (value === "High Match" || value === "Low Match") return value;
  return "Medium Match";
}

export function mapJob(job: BackendJob): Job {
  return {
    id: job.id,
    title: job.job_title,
    company: job.company,
    location: job.location,
    remoteType: job.remote_type,
    employmentType: job.employment_type,
    salary: job.salary_range || "Tidak dicantumkan",
    source: job.source,
    sourceUrl: job.source_url,
    scrapedAt: parseTimestamp(job.scraped_at),
    postedAt: parseTimestamp(job.posted_at),
    matchScore: job.match_score,
    matchCategory: normalizeMatchCategory(job.match_category),
    recommendationAction: job.recommendation_action,
    matchedSkills: job.matched_skills ?? [],
    missingSkills: job.missing_skills ?? [],
    reasonMatch: job.reason_match,
    riskOrGap: job.risk_or_gap,
    suspiciousFlag: job.suspicious_flag,
    suspiciousReason: job.suspicious_reason,
    experienceRequired: job.experience_required,
    educationRequired: job.education_required,
    userState:
      job.user_state === "shortlist" || job.user_state === "applied"
        ? job.user_state
        : "",
  };
}

export const tabItems: JobTab[] = ["Scraped", "Shortlist", "Applied"];

function tabToQuery(tab: JobTab): string {
  return tab.toLowerCase();
}

function buildPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set([1, totalPages, currentPage]);
  for (let p = currentPage - 1; p <= currentPage + 1; p += 1) {
    if (p > 1 && p < totalPages) pages.add(p);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  sorted.forEach((page, idx) => {
    const prev = sorted[idx - 1];
    if (prev && page - prev > 1) items.push("ellipsis");
    items.push(page);
  });
  return items;
}

async function parseError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { error?: { message?: string } };
    return body.error?.message || fallback;
  } catch {
    return fallback;
  }
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useJobsData() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [category, setCategory] = useState("Semua kategori");
  const [activeTab, setActiveTab] = useState<JobTab>("Scraped");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: jobsPerPage,
    total: 0,
    total_pages: 1,
  });
  const [stats, setStats] = useState<StatsResponse["data"]>({
    scraped: 0,
    shortlist: 0,
    applied: 0,
    high_match: 0,
    suspicious: 0,
    total_active: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // ── Close dropdown on outside click ──

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!categoryDropdownRef.current?.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // ── Load jobs ──

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const params = new URLSearchParams({
        tab: tabToQuery(activeTab),
        page: String(currentPage),
        limit: String(jobsPerPage),
      });
      if (debouncedQuery.trim()) params.set("search", debouncedQuery.trim());
      if (category !== "Semua kategori") params.set("category", category);

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/jobs?${params}`, {
          credentials: "include",
          signal: controller.signal,
        });
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        if (!response.ok) {
          throw new Error(await parseError(response, "Gagal memuat data jobs."));
        }

        const body = (await response.json()) as JobsResponse;
        const mapped = body.data.map(mapJob);
        setJobs(mapped);
        setMeta(body.meta);
        setSelectedJobId((cur) => {
          if (cur && mapped.some((j) => j.id === cur)) return cur;
          return mapped[0]?.id ?? null;
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setJobs([]);
          setMeta({ page: 1, limit: jobsPerPage, total: 0, total_pages: 1 });
          setSelectedJobId(null);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Gagal memuat data jobs.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [activeTab, category, currentPage, navigate, debouncedQuery]);

  // ── Load stats ──

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs/stats`, {
          credentials: "include",
        });
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        if (!response.ok) return;
        const body = (await response.json()) as StatsResponse;
        if (!cancelled) setStats(body.data);
      } catch {
        if (!cancelled)
          setStats({
            scraped: 0,
            shortlist: 0,
            applied: 0,
            high_match: 0,
            suspicious: 0,
            total_active: 0,
          });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate, jobs]);

  // ── Derived state ──

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) ?? jobs[0] ?? null,
    [jobs, selectedJobId],
  );

  const totalPages = Math.max(1, meta.total_pages || 1);
  const pageStart = jobs.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const pageEnd = jobs.length > 0 ? pageStart + jobs.length - 1 : 0;
  const paginationItems = buildPaginationItems(currentPage, totalPages);

  const statCards: StatCardData[] = [
    {
      label: "Total hasil scraping",
      value: String(stats.total_active),
      detail: `${stats.scraped} baru, ${stats.suspicious} mencurigakan`,
      tone: "text-gray-800 dark:text-white/90",
    },
    {
      label: "High Match",
      value: String(stats.high_match),
      detail: "Siap untuk dilamar",
      tone: "text-success-600",
    },
    {
      label: "Tersimpan",
      value: String(stats.shortlist + stats.applied),
      detail: `${stats.shortlist} shortlist, ${stats.applied} applied`,
      tone: "text-warning-600",
    },
  ];

  // ── Actions ──

  async function refreshCurrentPage() {
    const params = new URLSearchParams({
      tab: tabToQuery(activeTab),
      page: String(currentPage),
      limit: String(jobsPerPage),
    });
    if (query.trim()) params.set("search", query.trim());
    if (category !== "Semua kategori") params.set("category", category);

    const response = await fetch(`${API_BASE_URL}/jobs?${params}`, {
      credentials: "include",
    });
    if (!response.ok) return;
    const body = (await response.json()) as JobsResponse;
    const mapped = body.data.map(mapJob);
    setJobs(mapped);
    setMeta(body.meta);
    setSelectedJobId((cur) => {
      if (cur && mapped.some((j) => j.id === cur)) return cur;
      return mapped[0]?.id ?? null;
    });
  }

  async function updateJobState(
    job: Job,
    nextState: "shortlist" | "applied",
  ) {
    if (isMutating) return;
    setIsMutating(true);
    setErrorMessage("");

    const isDeleting = job.userState === nextState;
    try {
      const response = await fetch(
        `${API_BASE_URL}/jobs/${job.id}/state`,
        {
          method: isDeleting ? "DELETE" : "PUT",
          credentials: "include",
          headers: isDeleting
            ? undefined
            : { "Content-Type": "application/json" },
          body: isDeleting
            ? undefined
            : JSON.stringify({ state: nextState }),
        },
      );
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) {
        throw new Error(
          await parseError(response, "Gagal menyimpan status lowongan."),
        );
      }
      await refreshCurrentPage();
      const label = nextState === "shortlist" ? "Shortlist" : "Applied";
      setToast({
        message: isDeleting
          ? `Dihapus dari ${label.toLowerCase()}`
          : `Ditandai ${label.toLowerCase()}`,
        type: "success",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan status lowongan.",
      );
      setToast({
        message: "Gagal menyimpan status",
        type: "error",
      });
    } finally {
      setIsMutating(false);
    }
  }

  function exportJobs() {
    const params = new URLSearchParams({
      tab: tabToQuery(activeTab),
      limit: "1000",
    });
    if (query.trim()) params.set("search", query.trim());
    if (category !== "Semua kategori") params.set("category", category);
    window.location.href = `${API_BASE_URL}/jobs/export?${params}`;
  }

  function clearToast() {
    setToast(null);
  }

  function selectJob(id: number) {
    setSelectedJobId(id);
  }

  return {
    // state
    jobs,
    meta,
    stats,
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
    categoryDropdownRef,
    toast,
    // derived
    totalPages,
    pageStart,
    pageEnd,
    paginationItems,
    statCards,
    // setters
    setActiveTab: (tab: JobTab) => {
      setActiveTab(tab);
      setCurrentPage(1);
    },
    setQuery,
    setCategory: (cat: string) => {
      setCategory(cat);
      setCurrentPage(1);
    },
    setCurrentPage,
    setIsCategoryOpen,
    // actions
    updateJobState,
    exportJobs,
    clearToast,
    selectJob,
  };
}
