// ─── Period
export type AnalyticsPeriod =
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "this_year"
  | "custom";

// ─── Shared primitives
export interface LabelCount {
  label: string;
  count: number;
}

export interface TimeSeriesData {
  groupBy: "hour" | "day" | "week" | "month";
  labels: string[];
  values: number[];
}

// ─── Overview / KPI Stats
export interface AnalyticsOverview {
  // Period-scoped
  totalJobs: number;
  totalApplications: number;
  totalCandidates: number;
  totalViews: number;
  // All-time
  activeJobs: number;
  activeEmployers: number;
  pendingModeration: number;
  // Derived
  avgTimeToHire: number;
  successRate: number;
  // Period-over-period % changes
  trends: {
    jobs: number;
    applications: number;
    candidates: number;
  };
}

// ─── Per-day breakdown (always daily or hourly for "today")
export interface PerDayBreakdown {
  groupBy: "hour" | "day";
  labels: string[];
  series: {
    jobs: number[];
    applications: number[];
    candidates: number[];
  };
}

// ─── Growth Trends
export interface GrowthTrends {
  groupBy: "hour" | "day" | "week" | "month";
  labels: string[];
  series: {
    jobs: number[];
    applications: number[];
    candidates: number[];
  };
  // Always per-day (or hourly for today) — used for "Daily Activity" chart
  perDayBreakdown: PerDayBreakdown;
}

// ─── Job Analytics
export interface TopJobByViews {
  id: string;
  title: string;
  views: number;
  applicationCount: number;
  companyName: string;
}

export interface JobAnalytics {
  byStatus: LabelCount[];
  byType: LabelCount[];
  byExperienceLevel: LabelCount[];
  byCategory: LabelCount[];
  remoteVsOnsite: LabelCount[];
  topByViews: TopJobByViews[];
  featured: number;
  sponsored: number;
}

// ─── Application Analytics
export interface TopHiringJob {
  id: string;
  title: string;
  applicationCount: number;
  companyName: string;
}

export interface ApplicationAnalytics {
  byStatus: LabelCount[];
  overTime: TimeSeriesData;
  topHiringJobs: TopHiringJob[];
  avgDailyReviews: number;
  withdrawalRate: number;
}

// ─── Candidate Analytics
export interface CandidateAnalytics {
  registrationsOverTime: TimeSeriesData;
  topSkills: LabelCount[];
  topDomains: LabelCount[];
  emailVerification: LabelCount[];
  byStatus: LabelCount[];
  profileCompletionRate: number;
  totalAllTime: number;
}

// ─── Top Performers
export interface TopPerformingJob {
  id: string;
  title: string;
  applicationCount: number;
  views: number;
  company: {
    name: string;
    logo?: string;
  };
}

export interface TopPerformingEmployer {
  id: string;
  name: string;
  logo?: string;
  _count: {
    jobs: number;
  };
}

export interface TopPerformingCategory {
  id: string;
  name: string;
  jobCount: number;
}

export interface TopPerformers {
  topJobs: TopPerformingJob[];
  topEmployers: TopPerformingEmployer[];
  topCategories: TopPerformingCategory[];
}

// ─── Export Report (rich payload for Excel generation) — kept for JSON export
export interface DailyActivityRow {
  date: string;
  jobs: number;
  applications: number;
  registrations: number;
}

export interface AnalyticsExportReport {
  generatedAt: string;
  period: { start: string; end: string };
  summary: {
    totalJobs: number;
    totalApplications: number;
    totalCandidates: number;
    totalEmployers: number;
  };
  jobs: {
    byStatus: LabelCount[];
    byType: LabelCount[];
    byCategory: LabelCount[];
  };
  applications: { byStatus: LabelCount[] };
  dailyActivity: DailyActivityRow[];
  topJobs: Array<{
    title: string;
    company: string;
    applicationCount: number;
    views: number;
  }>;
  topCategories: Array<{
    category: string;
    jobCount: number;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Job Selector (for per-job analytics dropdown)
// ─────────────────────────────────────────────────────────────────────────────
export interface JobSelectorItem {
  id: string;
  title: string;
  status: string;
  createdAt?: string | null;
  applicationCount: number;
  views: number;
  companyName?: string | null;
}

export interface JobSelectorResponse {
  jobs: JobSelectorItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-Job Analytics Drilldown
// ─────────────────────────────────────────────────────────────────────────────
export interface JobDrilldownAnalytics {
  job: {
    id: string;
    title: string;
    status: string;
    companyName?: string | null;
    views: number;
    applicationCount: number;
    createdAt?: string | null;
  };
  period: {
    start: string;
    end: string;
    groupBy: "hour" | "day" | "week" | "month";
  };
  byStatus: LabelCount[];
  overTime: TimeSeriesData;
  totals: {
    applications: number;
    reviewed: number;
    accepted: number;
    withdrawn: number;
  };
  rates: {
    acceptanceRate: number;
    withdrawalRate: number;
  };
}
