"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { analyticsService } from "@/services/recruitment-services";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/careers/ui/tabs";
import StatCard from "@/components/careers/StatCard";
import {
  Briefcase,
  Users,
  Eye,
  Calendar,
  Loader2,
  FileDown,
  TrendingUp,
  Activity,
  Target,
  CalendarDays,
} from "lucide-react";
import { useToast } from "@/components/careers/ui/use-toast";

import type {
  AnalyticsPeriod,
  AnalyticsOverview,
  GrowthTrends,
  JobAnalytics,
  ApplicationAnalytics,
  CandidateAnalytics,
  TopPerformers,
  JobSelectorItem,
  JobDrilldownAnalytics,
} from "@/types/recruitment/analytics.types";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Colour palette
const COLORS = [
  "#6366f1",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#ec4899",
  "#eab308",
  "#14b8a6",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

// ─── Helper: format trend sign for StatCard
function fmtTrend(pct: number): string {
  if (pct === 0) return "No change";
  return `${pct > 0 ? "+" : ""}${pct}% vs previous period`;
}

function trendType(pct: number): "positive" | "negative" | "neutral" {
  if (pct > 0) return "positive";
  if (pct < 0) return "negative";
  return "neutral";
}

// ─── Recharts custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold mb-1 text-neutral-700 dark:text-neutral-200">
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Empty state
const NoData = () => (
  <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
    No data available for this period
  </div>
);

// ─── Skeleton card
const SkeletonCard = ({ h = "h-64" }: { h?: string }) => (
  <div
    className={`${h} rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse`}
  />
);

// ─── Simple horizontal bar list
function HBarList({
  data,
  colorFn,
}: {
  data: { label: string; count: number }[];
  colorFn?: (i: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-28 shrink-0 text-xs text-neutral-500 truncate text-right">
            {d.label}
          </span>
          <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-full h-5 overflow-hidden">
            <div
              className="h-5 rounded-full transition-all duration-500 flex items-center pl-2"
              style={{
                width: `${Math.round((d.count / max) * 100)}%`,
                backgroundColor: colorFn
                  ? colorFn(i)
                  : COLORS[i % COLORS.length],
              }}
            />
          </div>
          <span className="w-8 shrink-0 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Date-range picker (inline, shown when period === "custom")
function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (s: string, e: string) => void;
}) {
  const todayStr = new Date().toISOString().split("T")[0];
  return (
    <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1">
      <CalendarDays className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
      <input
        type="date"
        value={startDate}
        max={endDate || todayStr}
        onChange={(e) => onChange(e.target.value, endDate)}
        className="text-xs bg-transparent outline-none text-neutral-700 dark:text-neutral-200 cursor-pointer w-[110px]"
      />
      <span className="text-neutral-400 text-xs">→</span>
      <input
        type="date"
        value={endDate}
        min={startDate}
        max={todayStr}
        onChange={(e) => onChange(startDate, e.target.value)}
        className="text-xs bg-transparent outline-none text-neutral-700 dark:text-neutral-200 cursor-pointer w-[110px]"
      />
    </div>
  );
}

// ─── Download helper
function downloadBlob(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// ─── Main Page────
export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // ── Period & date-range state ──
  const [period, setPeriod] = useState<AnalyticsPeriod>("last_30_days");
  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [customEnd, setCustomEnd] = useState<string>(
    () => new Date().toISOString().split("T")[0],
  );

  // ── Data state ──
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [growthTrends, setGrowthTrends] = useState<GrowthTrends | null>(null);
  const [jobData, setJobData] = useState<JobAnalytics | null>(null);
  const [appData, setAppData] = useState<ApplicationAnalytics | null>(null);
  const [candData, setCandData] = useState<CandidateAnalytics | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformers | null>(
    null,
  );

  // ── Job drilldown selector + analytics ──
  const [jobSelector, setJobSelector] = useState<JobSelectorItem[]>([]);
  const [loadingJobSelector, setLoadingJobSelector] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [drilldownGroupBy, setDrilldownGroupBy] = useState<"day" | "hour">(
    "day",
  );
  const [jobDrilldown, setJobDrilldown] =
    useState<JobDrilldownAnalytics | null>(null);
  const [loadingJobDrilldown, setLoadingJobDrilldown] = useState(false);

  // ── Loading state ──
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingGrowth, setLoadingGrowth] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [loadingCands, setLoadingCands] = useState(false);
  const [loadingTopPerf, setLoadingTopPerf] = useState(true);
  const [exporting, setExporting] = useState(false);

  // ── Tab state & lazy-load tracking ──
  const [activeTab, setActiveTab] = useState("overview");
  const activatedTabsRef = useRef<Set<string>>(new Set(["overview"]));

  // ── Auth guard ──
  useEffect(() => {
    if (
      !user ||
      !["HR_MANAGER", "MODERATOR", "SUPER_ADMIN"].includes(user.role)
    ) {
      router.push("/recruitment-portal/dashboard");
    }
  }, [user, router]);

  // ── Derived params (pass startDate/endDate only for custom) ──
  const getDateParams = useCallback((): [
    string | undefined,
    string | undefined,
  ] => {
    if (period === "custom") return [customStart, customEnd];
    return [undefined, undefined];
  }, [period, customStart, customEnd]);

  //────────────────
  // Fetchers
  //────────────────
  const fetchOverview = useCallback(async () => {
    const [s, e] = getDateParams();
    try {
      setLoadingOverview(true);
      const res = await analyticsService.getOverview(period, s, e);
      if (res.success) setOverview(res.data ?? null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load overview stats",
        variant: "destructive",
      });
    } finally {
      setLoadingOverview(false);
    }
  }, [period, getDateParams, toast]);

  const fetchGrowthTrends = useCallback(async () => {
    const [s, e] = getDateParams();
    try {
      setLoadingGrowth(true);
      const res = await analyticsService.getGrowthTrends(period, s, e);
      if (res.success) setGrowthTrends(res.data ?? null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load growth trends",
        variant: "destructive",
      });
    } finally {
      setLoadingGrowth(false);
    }
  }, [period, getDateParams, toast]);

  const fetchJobAnalytics = useCallback(async () => {
    const [s, e] = getDateParams();
    try {
      setLoadingJobs(true);
      const res = await analyticsService.getJobAnalytics(period, s, e);
      if (res.success) setJobData(res.data ?? null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load job analytics",
        variant: "destructive",
      });
    } finally {
      setLoadingJobs(false);
    }
  }, [period, getDateParams, toast]);

  const fetchAppAnalytics = useCallback(async () => {
    const [s, e] = getDateParams();
    try {
      setLoadingApps(true);
      const res = await analyticsService.getApplicationAnalytics(period, s, e);
      if (res.success) setAppData(res.data ?? null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load application analytics",
        variant: "destructive",
      });
    } finally {
      setLoadingApps(false);
    }
  }, [period, getDateParams, toast]);

  const fetchCandAnalytics = useCallback(async () => {
    const [s, e] = getDateParams();
    try {
      setLoadingCands(true);
      const res = await analyticsService.getCandidateAnalytics(period, s, e);
      if (res.success) setCandData(res.data ?? null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load candidate analytics",
        variant: "destructive",
      });
    } finally {
      setLoadingCands(false);
    }
  }, [period, getDateParams, toast]);

  const fetchTopPerformers = useCallback(async () => {
    try {
      setLoadingTopPerf(true);
      const res = await analyticsService.getTopPerformers();
      if (res.success) setTopPerformers(res.data ?? null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load top performers",
        variant: "destructive",
      });
    } finally {
      setLoadingTopPerf(false);
    }
  }, [toast]);

  // job selector list for drilldown dropdown
  const fetchJobSelector = useCallback(async () => {
    try {
      setLoadingJobSelector(true);
      const res = await analyticsService.getJobSelector(500);
      if (res.success && res.data?.jobs) {
        setJobSelector(res.data.jobs);

        // Auto select first job if none selected
        if (!selectedJobId && res.data.jobs.length) {
          setSelectedJobId(res.data.jobs[0].id);
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load jobs list",
        variant: "destructive",
      });
    } finally {
      setLoadingJobSelector(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  // per job drilldown fetch
  const fetchJobDrilldown = useCallback(async () => {
    if (!selectedJobId) return;
    const [s, e] = getDateParams();

    try {
      setLoadingJobDrilldown(true);
      const res = await analyticsService.getJobDrilldown(
        selectedJobId,
        period,
        s,
        e,
        drilldownGroupBy,
      );
      if (res.success) setJobDrilldown(res.data ?? null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load job drilldown analytics",
        variant: "destructive",
      });
    } finally {
      setLoadingJobDrilldown(false);
    }
  }, [selectedJobId, period, drilldownGroupBy, getDateParams, toast]);

  //────────────────
  // LAZY LOAD LOGIC
  //────────────────
  useEffect(() => {
    // Clear stale data (period-sensitive)
    setOverview(null);
    setGrowthTrends(null);
    setJobData(null);
    setAppData(null);
    setCandData(null);
    setJobDrilldown(null);

    // Always fetch overview + growth + top performers
    fetchOverview();
    fetchGrowthTrends();
    fetchTopPerformers();

    // Re-fetch other tabs only if they were previously activated
    if (activatedTabsRef.current.has("jobs")) fetchJobAnalytics();
    if (activatedTabsRef.current.has("applications")) fetchAppAnalytics();
    if (activatedTabsRef.current.has("candidates")) fetchCandAnalytics();

    // Per-job drilldown should refresh on period change IF jobs tab was activated and a job is selected
    if (activatedTabsRef.current.has("jobs") && selectedJobId) {
      fetchJobDrilldown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, customStart, customEnd]);

  // Also refetch drilldown when groupBy changes (only if jobs tab has been activated)
  useEffect(() => {
    if (activatedTabsRef.current.has("jobs") && selectedJobId) {
      fetchJobDrilldown();
    }
  }, [drilldownGroupBy, selectedJobId, fetchJobDrilldown]);

  // When a tab is clicked for the first time, lazily load its data
  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      const alreadyActivated = activatedTabsRef.current.has(tab);
      activatedTabsRef.current.add(tab);

      if (!alreadyActivated) {
        switch (tab) {
          case "jobs":
            fetchJobAnalytics();
            fetchJobSelector();
            break;
          case "applications":
            fetchAppAnalytics();
            break;
          case "candidates":
            fetchCandAnalytics();
            break;
        }
      }
    },
    [
      fetchJobAnalytics,
      fetchAppAnalytics,
      fetchCandAnalytics,
      fetchJobSelector,
    ],
  );

  //────────────────
  // EXCEL EXPORT
  //────────────────
  const handleExport = async () => {
    try {
      setExporting(true);
      const [s, e] = getDateParams();

      const { blob, fileName } = await analyticsService.exportReportXlsx(
        period,
        s,
        e,
      );
      downloadBlob(blob, fileName);

      toast({
        title: "Report Downloaded",
        description: `${fileName} saved successfully`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // ── Derived: main growth chart data
  const growthChartData = growthTrends
    ? growthTrends.labels.map((label, i) => ({
        label,
        Jobs: growthTrends.series.jobs[i] ?? 0,
        Applications: growthTrends.series.applications[i] ?? 0,
        Candidates: growthTrends.series.candidates[i] ?? 0,
      }))
    : [];

  // ── Derived: per-day activity chart data
  const dailyChartData = growthTrends?.perDayBreakdown
    ? growthTrends.perDayBreakdown.labels.map((label, i) => ({
        label,
        Jobs: growthTrends.perDayBreakdown.series.jobs[i] ?? 0,
        Applications: growthTrends.perDayBreakdown.series.applications[i] ?? 0,
        Registrations: growthTrends.perDayBreakdown.series.candidates[i] ?? 0,
      }))
    : [];

  // ── Derived: job drilldown chart data
  const jobDrilldownChartData = useMemo(() => {
    if (!jobDrilldown?.overTime?.labels?.length) return [];
    return jobDrilldown.overTime.labels.map((label, i) => ({
      label,
      Applications: jobDrilldown.overTime.values[i] ?? 0,
    }));
  }, [jobDrilldown]);

  // ── Derived: stat cards
  const statCards = overview
    ? [
        {
          title: "Total Jobs Posted",
          value: overview.totalJobs.toLocaleString(),
          icon: Briefcase,
          change: fmtTrend(overview.trends.jobs),
          changeType: trendType(overview.trends.jobs),
          iconColor: "text-indigo-600",
        },
        {
          title: "Total Applications",
          value: overview.totalApplications.toLocaleString(),
          icon: Activity,
          change: fmtTrend(overview.trends.applications),
          changeType: trendType(overview.trends.applications),
          iconColor: "text-blue-600",
        },
        {
          title: "New Candidates",
          value: overview.totalCandidates.toLocaleString(),
          icon: Users,
          change: fmtTrend(overview.trends.candidates),
          changeType: trendType(overview.trends.candidates),
          iconColor: "text-green-600",
        },
        {
          title: "Total Job Views",
          value: overview.totalViews.toLocaleString(),
          icon: Eye,
          change: `${overview.activeJobs} active jobs`,
          changeType: "neutral" as const,
          iconColor: "text-orange-600",
        },
        {
          title: "Application Rate",
          value: `${overview.successRate}%`,
          icon: Target,
          change: `${overview.pendingModeration} pending review`,
          changeType: "neutral" as const,
          iconColor: "text-purple-600",
        },
        {
          title: "Avg. Time to Hire",
          value: `${overview.avgTimeToHire} days`,
          icon: Calendar,
          change: `${overview.activeEmployers} active employers`,
          changeType: "neutral" as const,
          iconColor: "text-teal-600",
        },
      ]
    : [];

  const isInitialLoading = loadingOverview && !overview;

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const dailyLabel =
    growthTrends?.perDayBreakdown?.groupBy === "hour"
      ? "Hourly Activity (Today)"
      : "Daily Activity";

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* ── Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Analytics &amp; Insights
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-1">
            Track performance metrics and trends
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Period selector */}
            <Select
              value={period}
              onValueChange={(v) => {
                activatedTabsRef.current = new Set(["overview", activeTab]);
                setPeriod(v as AnalyticsPeriod);
              }}
            >
              <SelectTrigger className="w-full sm:w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="last_7_days">Last 7 days</SelectItem>
                <SelectItem value="last_30_days">Last 30 days</SelectItem>
                <SelectItem value="last_90_days">Last 90 days</SelectItem>
                <SelectItem value="this_year">This year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            {/* Export button (backend XLSX) */}
            <Button
              onClick={handleExport}
              variant="outline"
              disabled={exporting}
              className="w-full sm:w-auto"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">Export Excel</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>

          {/* Custom date range picker — only shown when period === "custom" */}
          {period === "custom" && (
            <DateRangePicker
              startDate={customStart}
              endDate={customEnd}
              onChange={(s, e) => {
                if (s) setCustomStart(s);
                if (e) setCustomEnd(e);
              }}
            />
          )}
        </div>
      </div>

      {/* ── KPI Stat Cards ── */}
      {loadingOverview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 50} />
          ))}
        </div>
      )}

      {/* ── Tabs── */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4 sm:space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="text-xs sm:text-sm">
            Jobs
          </TabsTrigger>
          <TabsTrigger value="applications" className="text-xs sm:text-sm">
            Applications
          </TabsTrigger>
          <TabsTrigger value="candidates" className="text-xs sm:text-sm">
            Candidates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* ── Daily / Hourly Activity Chart ─ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-indigo-500" />
                {loadingGrowth ? "Daily Activity" : dailyLabel}
                <span className="text-xs font-normal text-neutral-500 ml-1">
                  — counts per{" "}
                  {growthTrends?.perDayBreakdown?.groupBy === "hour"
                    ? "hour"
                    : "day"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingGrowth ? (
                <SkeletonCard h="h-[300px]" />
              ) : dailyChartData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={dailyChartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: string) =>
                        v.length > 10 ? v.slice(11, 16) : v.slice(5)
                      }
                    />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="Jobs"
                      fill="#6366f1"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      dataKey="Applications"
                      fill="#f97316"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      dataKey="Registrations"
                      fill="#22c55e"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <NoData />
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Daily Summary Table ─ */}
          {!loadingGrowth && dailyChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-orange-400" />
                  {dailyLabel} — Breakdown Table
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left py-2 px-3 font-semibold text-neutral-500">
                          {growthTrends?.perDayBreakdown?.groupBy === "hour"
                            ? "Hour"
                            : "Date"}
                        </th>
                        <th className="text-right py-2 px-3 font-semibold text-indigo-600">
                          Jobs
                        </th>
                        <th className="text-right py-2 px-3 font-semibold text-orange-500">
                          Applications
                        </th>
                        <th className="text-right py-2 px-3 font-semibold text-green-600">
                          Registrations
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyChartData.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                        >
                          <td className="py-1.5 px-3 text-neutral-600 dark:text-neutral-300 font-mono">
                            {row.label}
                          </td>
                          <td className="py-1.5 px-3 text-right font-semibold text-indigo-600">
                            {row.Jobs}
                          </td>
                          <td className="py-1.5 px-3 text-right font-semibold text-orange-500">
                            {row.Applications}
                          </td>
                          <td className="py-1.5 px-3 text-right font-semibold text-green-600">
                            {row.Registrations}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                        <td className="py-2 px-3 font-semibold text-neutral-600 dark:text-neutral-300">
                          Total
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-indigo-600">
                          {dailyChartData.reduce((s, r) => s + r.Jobs, 0)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-orange-500">
                          {dailyChartData.reduce(
                            (s, r) => s + r.Applications,
                            0,
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-green-600">
                          {dailyChartData.reduce(
                            (s, r) => s + r.Registrations,
                            0,
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Top Performing Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Top Performing Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTopPerf ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonCard key={i} h="h-14" />
                    ))}
                  </div>
                ) : topPerformers?.topJobs?.length ? (
                  <div className="space-y-3">
                    {topPerformers.topJobs.slice(0, 7).map((job, index) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="text-xl sm:text-2xl font-bold text-neutral-300 shrink-0">
                            #{index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs sm:text-sm text-foreground truncate">
                              {job.title}
                            </p>
                            <p className="text-[10px] sm:text-xs text-neutral-500 truncate">
                              {job.company.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs sm:text-sm font-semibold text-green-600">
                            {job.applicationCount}
                          </p>
                          <p className="text-[10px] sm:text-xs text-neutral-500">
                            applications
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-neutral-500 py-8 text-sm">
                    No data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Top Employers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Top Employers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTopPerf ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonCard key={i} h="h-14" />
                    ))}
                  </div>
                ) : topPerformers?.topEmployers?.length ? (
                  <div className="space-y-3">
                    {topPerformers.topEmployers
                      .slice(0, 7)
                      .map((employer, index) => (
                        <div
                          key={employer.id}
                          className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <span className="text-xl sm:text-2xl font-bold text-neutral-300 shrink-0">
                              #{index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm text-foreground truncate">
                                {employer.name}
                              </p>
                              <p className="text-[10px] sm:text-xs text-neutral-500">
                                {employer._count.jobs} active jobs
                              </p>
                            </div>
                          </div>
                          <TrendingUp className="h-4 w-4 text-indigo-500 shrink-0" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-neutral-500 py-8 text-sm">
                    No data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Growth Trends Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Growth Trends
                {growthTrends && (
                  <span className="text-xs font-normal text-neutral-400 ml-2">
                    grouped by {growthTrends.groupBy}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingGrowth ? (
                <SkeletonCard h="h-[300px]" />
              ) : growthChartData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={growthChartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorJobs"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorApps"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorCands"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: string) =>
                        v.length > 10
                          ? v.slice(11, 16)
                          : v.length > 8
                            ? v.slice(5)
                            : v
                      }
                    />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Jobs"
                      stroke="#6366f1"
                      fill="url(#colorJobs)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Applications"
                      stroke="#f97316"
                      fill="url(#colorApps)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Candidates"
                      stroke="#22c55e"
                      fill="url(#colorCands)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <NoData />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Categories */}
          {topPerformers?.topCategories?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Top Job Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HBarList
                  data={topPerformers.topCategories.map((c) => ({
                    label: c.name,
                    count: c.jobCount,
                  }))}
                />
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4 sm:space-y-6">
          {/* Per Job Drilldown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center justify-between gap-2">
                <span>Per Job Analytics</span>
                <span className="text-xs font-normal text-neutral-500">
                  Select a job to see applications per hour/day
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Select
                    value={selectedJobId || undefined}
                    onValueChange={(v) => {
                      setSelectedJobId(v);
                      setTimeout(() => fetchJobDrilldown(), 0);
                    }}
                    disabled={loadingJobSelector}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          loadingJobSelector
                            ? "Loading jobs..."
                            : "Select a job"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {jobSelector.length ? (
                        jobSelector.map((j) => (
                          <SelectItem key={j.id} value={j.id}>
                            {(j.companyName ? `${j.companyName} — ` : "") +
                              j.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="__none" disabled>
                          No jobs available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select
                    value={drilldownGroupBy}
                    onValueChange={(v) =>
                      setDrilldownGroupBy(v as "day" | "hour")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Group by day</SelectItem>
                      <SelectItem value="hour">Group by hour</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Tip: “hour” works best with “Today”.
                  </p>
                </div>
              </div>

              {loadingJobDrilldown ? (
                <SkeletonCard h="h-[260px]" />
              ) : jobDrilldown ? (
                <>
                  {/* Mini KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Card className="p-3 text-center">
                      <p className="text-lg font-bold text-indigo-600">
                        {jobDrilldown.totals.applications}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Applications
                      </p>
                    </Card>
                    <Card className="p-3 text-center">
                      <p className="text-lg font-bold text-green-600">
                        {jobDrilldown.rates.acceptanceRate}%
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Acceptance rate
                      </p>
                    </Card>
                    <Card className="p-3 text-center">
                      <p className="text-lg font-bold text-red-500">
                        {jobDrilldown.rates.withdrawalRate}%
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Withdrawal rate
                      </p>
                    </Card>
                    <Card className="p-3 text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {jobDrilldown.totals.reviewed}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Reviewed
                      </p>
                    </Card>
                  </div>

                  {/* Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">
                        Applications Over Time — {jobDrilldown.job.title}
                        <span className="text-xs font-normal text-neutral-500 ml-2">
                          ({jobDrilldown.period.groupBy})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {jobDrilldownChartData.length ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <AreaChart
                            data={jobDrilldownChartData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient
                                id="jobAppsFill"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#6366f1"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#6366f1"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                            />
                            <XAxis
                              dataKey="label"
                              tick={{ fontSize: 10 }}
                              tickFormatter={(v: string) =>
                                v.length > 10 ? v.slice(11, 16) : v.slice(5)
                              }
                            />
                            <YAxis
                              tick={{ fontSize: 11 }}
                              allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="Applications"
                              stroke="#6366f1"
                              fill="url(#jobAppsFill)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[260px] flex items-center justify-center">
                          <NoData />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Breakdown table */}
                  {jobDrilldownChartData.length ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base">
                          Breakdown Table
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                                <th className="text-left py-2 px-3 font-semibold text-neutral-500">
                                  {jobDrilldown.overTime.groupBy === "hour"
                                    ? "Hour"
                                    : "Date"}
                                </th>
                                <th className="text-right py-2 px-3 font-semibold text-indigo-600">
                                  Applications
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {jobDrilldownChartData.map((row, i) => (
                                <tr
                                  key={i}
                                  className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                                >
                                  <td className="py-1.5 px-3 text-neutral-600 dark:text-neutral-300 font-mono">
                                    {row.label}
                                  </td>
                                  <td className="py-1.5 px-3 text-right font-semibold text-indigo-600">
                                    {row.Applications}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                                <td className="py-2 px-3 font-semibold text-neutral-600 dark:text-neutral-300">
                                  Total
                                </td>
                                <td className="py-2 px-3 text-right font-bold text-indigo-600">
                                  {jobDrilldownChartData.reduce(
                                    (s, r) => s + r.Applications,
                                    0,
                                  )}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null}

                  {/* Funnel by status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">
                        Application Funnel (This Job)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {jobDrilldown.byStatus.length ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <BarChart
                            layout="vertical"
                            data={jobDrilldown.byStatus}
                            margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                              horizontal={false}
                            />
                            <XAxis
                              type="number"
                              tick={{ fontSize: 11 }}
                              allowDecimals={false}
                            />
                            <YAxis
                              type="category"
                              dataKey="label"
                              tick={{ fontSize: 11 }}
                              width={90}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                              dataKey="count"
                              name="Applications"
                              radius={[0, 4, 4, 0]}
                            >
                              {jobDrilldown.byStatus.map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={COLORS[i % COLORS.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[260px] flex items-center justify-center">
                          <NoData />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-sm text-neutral-500">
                  Select a job to load drilldown analytics.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Existing jobs analytics blocks */}
          {loadingJobs ? (
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : jobData ? (
            <>
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Jobs by Status – Pie */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Jobs by Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {jobData.byStatus.length ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={jobData.byStatus}
                            dataKey="count"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label={({ name, percent }) =>
                              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                          >
                            {jobData.byStatus.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v, n) => [v, n]} />
                          <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 11 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <NoData />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Jobs by Type – Bar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Jobs by Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {jobData.byType.length ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart
                          data={jobData.byType}
                          margin={{ top: 5, right: 10, left: 0, bottom: 40 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="label"
                            tick={{ fontSize: 10 }}
                            angle={-30}
                            textAnchor="end"
                          />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            allowDecimals={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="count"
                            name="Jobs"
                            radius={[4, 4, 0, 0]}
                          >
                            {jobData.byType.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <NoData />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Jobs by Experience Level */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      By Experience Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {jobData.byExperienceLevel.length ? (
                      <HBarList data={jobData.byExperienceLevel} />
                    ) : (
                      <div className="h-40 flex items-center justify-center">
                        <NoData />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Remote vs On-site – Pie */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Remote vs On-site
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {jobData.remoteVsOnsite.length ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={jobData.remoteVsOnsite}
                            dataKey="count"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                          >
                            {jobData.remoteVsOnsite.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 11 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-40 flex items-center justify-center">
                        <NoData />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {jobData.byCategory.length ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Jobs by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HBarList data={jobData.byCategory} />
                  </CardContent>
                </Card>
              ) : null}

              {jobData.topByViews.length ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Top Jobs by Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {jobData.topByViews.map((job, index) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-lg font-bold text-neutral-300 shrink-0">
                              #{index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm truncate">
                                {job.title}
                              </p>
                              <p className="text-[10px] text-neutral-500">
                                {job.companyName}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4 shrink-0 text-right">
                            <div>
                              <p className="text-xs font-semibold text-blue-600">
                                {job.views.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-neutral-500">
                                views
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-600">
                                {job.applicationCount}
                              </p>
                              <p className="text-[10px] text-neutral-500">
                                apps
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </>
          ) : (
            <Card>
              <CardContent className="h-64 flex items-center justify-center">
                <NoData />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4 sm:space-y-6">
          {loadingApps ? (
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : appData ? (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {appData.avgDailyReviews}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Avg daily reviews
                  </p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {appData.withdrawalRate}%
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Withdrawal rate
                  </p>
                </Card>
                <Card className="p-4 text-center col-span-2 sm:col-span-1">
                  <p className="text-2xl font-bold text-green-600">
                    {appData.byStatus.find((s) => s.label === "ACCEPTED")
                      ?.count ?? 0}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Accepted</p>
                </Card>
              </div>

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Funnel by status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Application Funnel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appData.byStatus.length ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                          layout="vertical"
                          data={appData.byStatus}
                          margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            tick={{ fontSize: 11 }}
                            allowDecimals={false}
                          />
                          <YAxis
                            type="category"
                            dataKey="label"
                            tick={{ fontSize: 11 }}
                            width={70}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="count"
                            name="Applications"
                            radius={[0, 4, 4, 0]}
                          >
                            {appData.byStatus.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <NoData />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Applications over time */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Applications Over Time
                      {appData.overTime.groupBy && (
                        <span className="text-xs font-normal text-neutral-400 ml-2">
                          by {appData.overTime.groupBy}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appData.overTime.labels.length ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <AreaChart
                          data={appData.overTime.labels.map((label, i) => ({
                            label,
                            Applications: appData.overTime.values[i] ?? 0,
                          }))}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorApps2"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f97316"
                                stopOpacity={0.35}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f97316"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="label"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(v: string) =>
                              v.length > 10
                                ? v.slice(11, 16)
                                : v.length > 8
                                  ? v.slice(5)
                                  : v
                            }
                          />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            allowDecimals={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="Applications"
                            stroke="#f97316"
                            fill="url(#colorApps2)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <NoData />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {appData.topHiringJobs.length ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Top Hiring Jobs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {appData.topHiringJobs.map((job, index) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-lg font-bold text-neutral-300 shrink-0">
                              #{index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm truncate">
                                {job.title}
                              </p>
                              <p className="text-[10px] text-neutral-500">
                                {job.companyName}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-semibold text-green-600">
                              {job.applicationCount}
                            </p>
                            <p className="text-[10px] text-neutral-500">
                              applications
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </>
          ) : (
            <Card>
              <CardContent className="h-64 flex items-center justify-center">
                <NoData />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4 sm:space-y-6">
          {loadingCands ? (
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : candData ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {candData.totalAllTime.toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Total candidates (all time)
                  </p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {candData.profileCompletionRate}%
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Profile completion rate
                  </p>
                </Card>
                <Card className="p-4 text-center col-span-2 sm:col-span-1">
                  <p className="text-2xl font-bold text-blue-600">
                    {candData.emailVerification.find(
                      (e) => e.label === "Verified",
                    )?.count ?? 0}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Verified email
                  </p>
                </Card>
              </div>

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Registrations over time */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Candidate Registrations Over Time
                      {candData.registrationsOverTime.groupBy && (
                        <span className="text-xs font-normal text-neutral-400 ml-2">
                          by {candData.registrationsOverTime.groupBy}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {candData.registrationsOverTime.labels.length ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <AreaChart
                          data={candData.registrationsOverTime.labels.map(
                            (label, i) => ({
                              label,
                              Candidates:
                                candData.registrationsOverTime.values[i] ?? 0,
                            }),
                          )}
                          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorCands2"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#22c55e"
                                stopOpacity={0.35}
                              />
                              <stop
                                offset="95%"
                                stopColor="#22c55e"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="label"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(v: string) =>
                              v.length > 10
                                ? v.slice(11, 16)
                                : v.length > 8
                                  ? v.slice(5)
                                  : v
                            }
                          />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            allowDecimals={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="Candidates"
                            stroke="#22c55e"
                            fill="url(#colorCands2)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <NoData />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Top Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {candData.topSkills.length ? (
                      <HBarList data={candData.topSkills.slice(0, 10)} />
                    ) : (
                      <div className="h-40 flex items-center justify-center">
                        <NoData />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Domains */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Top Domains
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {candData.topDomains.length ? (
                      <HBarList data={candData.topDomains.slice(0, 10)} />
                    ) : (
                      <div className="h-40 flex items-center justify-center">
                        <NoData />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Candidate status breakdown */}
                {candData.byStatus.length ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">
                        By Account Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={candData.byStatus}
                            dataKey="count"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                          >
                            {candData.byStatus.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 11 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                ) : null}

                {/* Email verification breakdown */}
                {candData.emailVerification.length ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">
                        Email Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={candData.emailVerification}
                            dataKey="count"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                          >
                            {candData.emailVerification.map((_, i) => (
                              <Cell
                                key={i}
                                fill={i === 0 ? "#22c55e" : "#e5e7eb"}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: 11 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="h-64 flex items-center justify-center">
                <NoData />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
