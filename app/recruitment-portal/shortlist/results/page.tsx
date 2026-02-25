"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  Loader2,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  Phone,
  RefreshCw,
  X,
  AlertTriangle,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { shortlistService } from "@/services/recruitment-services";
import {
  type ShortlistResult,
  type StaleCheckResult,
  type DegreeLevel,
  type ExportMode,
} from "@/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { Input } from "@/components/careers/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/careers/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/careers/ui/alert";
import { Switch } from "@/components/careers/ui/switch";
import { Label } from "@/components/careers/ui/label";

/* ----------------------------- helpers ----------------------------- */

const formatScore = (value: any): string => {
  if (value === null || value === undefined) return "0.0";
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(1) : "0.0";
};

const parsePositiveIntOrNull = (value: string): number | null => {
  if (!value) return null;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || Number.isNaN(n) || n <= 0) return null;
  return n;
};

function initials(first?: string, last?: string) {
  const a = (first?.trim()?.[0] ?? "").toUpperCase();
  const b = (last?.trim()?.[0] ?? "").toUpperCase();
  return a + b || "??";
}

function scoreTone(score: number) {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "poor";
}

function getScoreBadgeClass(score: number) {
  if (score >= 80) return "bg-green-600 text-white";
  if (score >= 60) return "bg-blue-600 text-white";
  if (score >= 40) return "bg-amber-600 text-white";
  return "bg-red-600 text-white";
}

function getRankBadgeClass(rankValue: number) {
  if (rankValue === 1)
    return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
  if (rankValue === 2)
    return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
  if (rankValue === 3)
    return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
  return "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100";
}

function KV(props: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
        {props.label}
      </span>
      <span className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 text-right">
        {props.value ?? "—"}
      </span>
    </div>
  );
}

function InputWithIcon(props: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel: string;
}) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 pointer-events-none">
        <span className="[&>svg]:h-4 [&>svg]:w-4 flex items-center justify-center">
          {props.icon}
        </span>
      </div>
      <Input
        aria-label={props.ariaLabel}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="h-10 w-full pl-10 pr-3 text-sm"
      />
    </div>
  );
}

function isAdminRole(role?: string) {
  return Boolean(
    role && ["SUPER_ADMIN", "HR_MANAGER", "MODERATOR"].includes(role),
  );
}

/* ------------------------------ page ------------------------------ */

export default function ShortlistResultsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [results, setResults] = useState<ShortlistResult[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [jobInfo, setJobInfo] = useState<any>(null);
  const [staleCheck, setStaleCheck] = useState<StaleCheckResult | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [topN, setTopN] = useState<string>("");

  const [includeDisqualified, setIncludeDisqualified] = useState(true);

  // Export settings
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportMode, setExportMode] = useState<ExportMode>("all");
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel | "all">("all");

  const [selectedResult, setSelectedResult] = useState<ShortlistResult | null>(
    null,
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Admin scoring form state
  const [savingAdminScore, setSavingAdminScore] = useState(false);
  const [adminScores, setAdminScores] = useState({
    manualTotalScore: "" as string,
    manualEducationScore: "" as string,
    manualExperienceScore: "" as string,
    manualSkillsScore: "" as string,
    manualClearanceScore: "" as string,
    manualProfessionalScore: "" as string,
  });
  const [overrideDisq, setOverrideDisq] = useState(false);

  const topNNumber = useMemo(() => parsePositiveIntOrNull(topN), [topN]);

  const fetchResults = useCallback(async () => {
    if (!jobId) return;

    try {
      setLoading(true);

      const response = await shortlistService.getResults(jobId, {
        status: statusFilter !== "all" ? statusFilter : undefined,
        includeDisqualified,
      });

      if (response.success && response.data) {
        setResults(response.data.results ?? []);
        setStats(response.data.stats ?? null);
        setJobInfo({ job: response.data.job, company: response.data.company });
        setStaleCheck(response.data.stale ?? null);
      } else {
        toast.error(response?.message || "Failed to load results");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, [jobId, statusFilter, includeDisqualified]);

  useEffect(() => {
    const allowed =
      user &&
      ["EMPLOYER", "HR_MANAGER", "MODERATOR", "SUPER_ADMIN"].includes(
        user.role,
      );

    if (!allowed) {
      router.push("/careers-portal");
      return;
    }

    if (!jobId) {
      toast.error("Job ID is required");
      router.push("/recruitment-portal/shortlist");
      return;
    }

    void fetchResults();
  }, [user, router, jobId, fetchResults]);

  const handleRegenerate = useCallback(async () => {
    if (!jobId) return;

    try {
      setRegenerating(true);
      const result = await shortlistService.generate(jobId);
      if (result.success && result.data) {
        toast.success(
          `Shortlist regenerated with ${result.data.count} candidates`,
        );
        await fetchResults();
      } else {
        toast.error(result?.message || "Failed to regenerate shortlist");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to regenerate shortlist");
    } finally {
      setRegenerating(false);
    }
  }, [jobId, fetchResults]);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return results.filter((r) => {
      const matchesSearch =
        q.length === 0 ||
        `${r.firstName ?? ""} ${r.lastName ?? ""}`.toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q);

      const effTotal = Number(r.effectiveTotalScore ?? r.totalScore ?? 0);

      const matchesScore =
        scoreFilter === "all" ||
        (scoreFilter === "high" && effTotal >= 80) ||
        (scoreFilter === "medium" && effTotal >= 60 && effTotal < 80) ||
        (scoreFilter === "low" && effTotal < 60);

      return matchesSearch && matchesScore;
    });
  }, [results, searchQuery, scoreFilter]);

  const displayResults = useMemo(() => {
    const sorted = [...filteredResults].sort((a, b) => {
      // ranked first, disqualified last
      const ar = a.candidateRank ?? Number.POSITIVE_INFINITY;
      const br = b.candidateRank ?? Number.POSITIVE_INFINITY;
      if (ar !== br) return ar - br;

      const as = Number(a.effectiveTotalScore ?? a.totalScore ?? 0);
      const bs = Number(b.effectiveTotalScore ?? b.totalScore ?? 0);
      return bs - as;
    });

    return topNNumber ? sorted.slice(0, topNNumber) : sorted;
  }, [filteredResults, topNNumber]);

  const isFiltering =
    Boolean(searchQuery.trim()) ||
    scoreFilter !== "all" ||
    statusFilter !== "all" ||
    Boolean(topN) ||
    !includeDisqualified;

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setScoreFilter("all");
    setStatusFilter("all");
    setTopN("");
    setIncludeDisqualified(true);
  }, []);

  const openDetails = useCallback((r: ShortlistResult) => {
    setSelectedResult(r);
    setShowDetailsDialog(true);

    setAdminScores({
      manualTotalScore:
        r.manualTotalScore == null ? "" : String(r.manualTotalScore),
      manualEducationScore:
        r.manualEducationScore == null ? "" : String(r.manualEducationScore),
      manualExperienceScore:
        r.manualExperienceScore == null ? "" : String(r.manualExperienceScore),
      manualSkillsScore:
        r.manualSkillsScore == null ? "" : String(r.manualSkillsScore),
      manualClearanceScore:
        r.manualClearanceScore == null ? "" : String(r.manualClearanceScore),
      manualProfessionalScore:
        r.manualProfessionalScore == null
          ? ""
          : String(r.manualProfessionalScore),
    });

    setOverrideDisq(Boolean(r.overrideDisqualification));
  }, []);

  const saveAdminScoring = useCallback(async () => {
    if (!jobId || !selectedResult) return;

    try {
      setSavingAdminScore(true);

      const toNumOrNull = (v: string) => {
        const t = v.trim();
        if (!t) return null;
        const n = Number(t);
        if (!Number.isFinite(n)) return null;
        return n;
      };

      const res = await shortlistService.setAdminScores(
        jobId,
        selectedResult.id,
        {
          manualTotalScore: toNumOrNull(adminScores.manualTotalScore),
          manualEducationScore: toNumOrNull(adminScores.manualEducationScore),
          manualExperienceScore: toNumOrNull(adminScores.manualExperienceScore),
          manualSkillsScore: toNumOrNull(adminScores.manualSkillsScore),
          manualClearanceScore: toNumOrNull(adminScores.manualClearanceScore),
          manualProfessionalScore: toNumOrNull(
            adminScores.manualProfessionalScore,
          ),
        },
      );

      if (!res.success) {
        toast.error(res.message || "Failed to save admin scores");
        return;
      }

      toast.success("Admin scores saved. Ranking updated.");
      await fetchResults();

      const updated = (results || []).find((x) => x.id === selectedResult.id);
      if (updated) setSelectedResult(updated);
    } catch (e: any) {
      toast.error(e.message || "Failed to save admin scores");
    } finally {
      setSavingAdminScore(false);
    }
  }, [jobId, selectedResult, adminScores, fetchResults, results]);

  const toggleOverrideDisq = useCallback(
    async (next: boolean) => {
      if (!jobId || !selectedResult) return;

      try {
        setOverrideDisq(next);
        const res = await shortlistService.setOverrideDisqualification(
          jobId,
          selectedResult.id,
          next,
        );
        if (!res.success) {
          toast.error(res.message || "Failed to update override");
          setOverrideDisq(!next);
          return;
        }
        toast.success("Disqualification override updated. Ranking updated.");
        await fetchResults();
      } catch (e: any) {
        toast.error(e.message || "Failed to update override");
        setOverrideDisq(!next);
      }
    },
    [jobId, selectedResult, fetchResults],
  );

  const handleExport = useCallback(async () => {
    if (!jobId) return;

    try {
      setExporting(true);

      const loadingToast = toast.loading("Preparing export...");

      await shortlistService.exportExcel(jobId, {
        topN: topNNumber ?? undefined,
        exportMode,
        degreeLevel: degreeLevel === "all" ? undefined : degreeLevel,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      toast.dismiss(loadingToast);
      toast.success("Excel exported successfully!");
      setShowExportDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to export");
    } finally {
      setExporting(false);
    }
  }, [jobId, topNNumber, exportMode, degreeLevel, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Header Section */}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left Header Content */}
          <div className="w-full lg:w-auto min-w-0 flex-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-2 shrink-0"
            >
              <Link href="/recruitment-portal/shortlist" className="w-fit">
                <ArrowLeft className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">Back to Shortlist</span>
              </Link>
            </Button>

            <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white wrap-break-word">
              Shortlist Results
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 wrap-break-word">
              {jobInfo?.job?.title} • {jobInfo?.company?.name}
              {topNNumber ? ` • Showing Top ${topNNumber}` : ""}
            </p>

            {isFiltering ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {searchQuery.trim() ? (
                  <Badge variant="secondary" className="gap-1 max-w-full">
                    <Search className="h-3 w-3 shrink-0" />
                    <span className="truncate">{searchQuery.trim()}</span>
                  </Badge>
                ) : null}

                {statusFilter !== "all" ? (
                  <Badge variant="secondary" className="gap-1">
                    <Filter className="h-3 w-3 shrink-0" />
                    <span className="capitalize">{statusFilter}</span>
                  </Badge>
                ) : null}

                {scoreFilter !== "all" ? (
                  <Badge variant="secondary" className="capitalize">
                    {scoreFilter}
                  </Badge>
                ) : null}

                {!includeDisqualified ? (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3 shrink-0" />
                    Hide Disqualified
                  </Badge>
                ) : null}

                {topNNumber ? (
                  <Badge variant="secondary" className="gap-1">
                    <Trophy className="h-3 w-3 shrink-0" />
                    Top {topNNumber}
                  </Badge>
                ) : null}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 px-2 text-neutral-700 dark:text-neutral-200"
                >
                  <X className="h-4 w-4 mr-1 shrink-0" />
                  Clear
                </Button>
              </div>
            ) : null}
          </div>

          {/* Right Header Buttons */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={regenerating || loading}
              size="sm"
              className="w-full sm:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 shrink-0 ${
                  regenerating ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Regenerate</span>
              <span className="sm:hidden">Regenerate</span>
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/recruitment-portal/shortlist/criteria?jobId=${jobId}`,
                )
              }
              size="sm"
              className="w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2 shrink-0" />
              <span className="hidden sm:inline">Edit Criteria</span>
              <span className="sm:hidden">Criteria</span>
            </Button>

            <Button
              onClick={() => setShowExportDialog(true)}
              disabled={exporting || loading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2 shrink-0" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stale Detection Alert */}
      {staleCheck?.isStale && (
        <Alert className="w-full border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <AlertTitle className="text-amber-900 dark:text-amber-100 ml-2">
            Outdated Results Detected
          </AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200 ml-6">
            <p className="mb-3">{staleCheck.reason}</p>
            {staleCheck.criteriaUpdatedAt &&
              staleCheck.shortlistGeneratedAt && (
                <p className="text-xs mb-3 wrap-break-word">
                  Criteria updated:{" "}
                  {new Date(staleCheck.criteriaUpdatedAt).toLocaleString()} •
                  Last generated:{" "}
                  {new Date(staleCheck.shortlistGeneratedAt).toLocaleString()}
                </p>
              )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white border-amber-700 mt-2"
            >
              {regenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Regenerate Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters + Summary Section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Filters Card - Takes 2/3 on large screens */}
        <div className="w-full lg:col-span-2">
          <Card className="w-full shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0" />
                Filters
              </CardTitle>
            </CardHeader>

            <CardContent className="w-full space-y-4">
              {/* Filter Inputs Grid */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                {/* Search Input */}
                <div className="w-full">
                  <InputWithIcon
                    icon={<Search />}
                    ariaLabel="Search candidates"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                </div>

                {/* Top N Input */}
                <div className="w-full">
                  <Input
                    aria-label="Top N candidates"
                    className="h-10 w-full"
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    placeholder="Top N (blank = all)"
                    value={topN}
                    onChange={(e) => setTopN(e.target.value)}
                  />
                  <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    Shows best-ranked N in this view and export.
                  </p>
                </div>

                {/* Score Filter */}
                <div className="w-full">
                  <Select value={scoreFilter} onValueChange={setScoreFilter}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Filter by score" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scores</SelectItem>
                      <SelectItem value="high">High (80-100)</SelectItem>
                      <SelectItem value="medium">Medium (60-79)</SelectItem>
                      <SelectItem value="low">Low (&lt;60)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="w-full">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REVIEWED">Reviewed</SelectItem>
                      <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                      <SelectItem value="INTERVIEW">Interview</SelectItem>
                      <SelectItem value="OFFERED">Offered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Disqualified Toggle */}
              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 min-w-0">
                  <XCircle className="h-4 w-4 text-neutral-500 shrink-0" />
                  <Label className="text-sm whitespace-nowrap">
                    Show disqualified candidates
                  </Label>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <Switch
                    checked={includeDisqualified}
                    onCheckedChange={setIncludeDisqualified}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card - Takes 1/3 on large screens */}
        <div className="w-full">
          <Card className="w-full shadow-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0" />
                Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="w-full space-y-3">
              {/* Stats Grid */}
              <div className="w-full grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Total",
                    value: stats?.total ?? 0,
                    icon: (
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    ),
                    box: "bg-blue-100 dark:bg-blue-900/30",
                  },
                  {
                    label: "Top Score",
                    value: formatScore(stats?.topScore),
                    icon: (
                      <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ),
                    box: "bg-green-100 dark:bg-green-900/30",
                  },
                  {
                    label: "Average",
                    value: formatScore(stats?.averageScore),
                    icon: (
                      <SlidersHorizontal className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    ),
                    box: "bg-purple-100 dark:bg-purple-900/30",
                  },
                  {
                    label: "Qualified",
                    value: stats?.qualified ?? 0,
                    icon: (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ),
                    box: "bg-green-100 dark:bg-green-900/30",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                          {s.label}
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white truncate tabular-nums">
                          {s.value}
                        </p>
                      </div>
                      <div
                        className={`shrink-0 p-2 rounded-lg ${s.box} flex items-center justify-center`}
                      >
                        {s.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="w-full pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
                <KV label="Filtered results" value={displayResults.length} />
                <KV
                  label="Show disqualified"
                  value={includeDisqualified ? "Yes" : "No"}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results List Section */}
      <div className="w-full space-y-3">
        {displayResults.length > 0 ? (
          displayResults.map((r, index) => {
            const effTotal = Number(r.effectiveTotalScore ?? r.totalScore ?? 0);
            const tone = scoreTone(effTotal);
            const isDisq =
              Boolean(
                r.isEffectivelyDisqualified ?? r.hasDisqualifyingFactor,
              ) && !Boolean(r.overrideDisqualification);

            const rankValue = Number(r.candidateRank ?? index + 1);

            return (
              <Card
                key={r.id}
                className="w-full shadow-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openDetails(r)}
              >
                <CardContent className="w-full pt-4 sm:pt-5 px-4 sm:px-6">
                  <div className="w-full flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Left Block - Candidate Info */}
                    <div className="w-full lg:w-auto flex-1 flex items-start gap-3 min-w-0">
                      {/* Rank Badge */}
                      <div
                        className={`shrink-0 h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow ${
                          isDisq
                            ? "bg-red-600 text-white"
                            : getRankBadgeClass(rankValue)
                        }`}
                        title={isDisq ? "Disqualified" : `Rank #${rankValue}`}
                      >
                        {isDisq ? (
                          <XCircle className="h-5 w-5" />
                        ) : rankValue === 1 ? (
                          <Trophy className="h-5 w-5" />
                        ) : (
                          <span className="text-xs sm:text-sm tabular-nums">
                            #{rankValue}
                          </span>
                        )}
                      </div>

                      {/* Initials Avatar */}
                      <div className="shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-linear-to-br from-primary-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {initials(r.firstName, r.lastName)}
                      </div>

                      {/* Candidate Details */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate">
                          {r.firstName} {r.lastName}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate">
                          {r.title || "No title specified"}
                        </p>

                        {/* Badges */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {r.hasAllMandatory ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1 shrink-0" />
                              All Met
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-amber-700 dark:text-amber-400 text-xs"
                            >
                              Some Missing
                            </Badge>
                          )}

                          {isDisq ? (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs">
                              <XCircle className="h-3 w-3 mr-1 shrink-0" />
                              Disqualified
                            </Badge>
                          ) : null}

                          {r.auditFlag ? (
                            <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs">
                              <ShieldCheck className="h-3 w-3 mr-1 shrink-0" />
                              Audited
                            </Badge>
                          ) : null}

                          <Badge
                            variant="secondary"
                            className="text-xs capitalize"
                          >
                            {tone}
                          </Badge>
                        </div>

                        {isDisq && r.disqualificationReasons?.length ? (
                          <p className="mt-2 text-[11px] text-red-600 dark:text-red-400 line-clamp-2 wrap-break-word">
                            Reason: {r.disqualificationReasons.join("; ")}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Right Block - Contact & Score Info */}
                    <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4 lg:items-center lg:justify-end">
                      {/* Contact Info */}
                      <div className="w-full sm:w-auto flex flex-col gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="h-4 w-4 shrink-0" />
                          <span className="truncate">{r.email}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {r.phone || "No phone"}
                          </span>
                        </div>
                      </div>

                      {/* Score & Details Button */}
                      <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mb-1">
                            Effective Total
                          </p>
                          <Badge
                            className={`${getScoreBadgeClass(
                              effTotal,
                            )} font-bold text-xs tabular-nums w-fit`}
                          >
                            {formatScore(effTotal)}
                          </Badge>
                          <p className="mt-1 text-[10px] text-neutral-500 dark:text-neutral-400 wrap-break-word">
                            System: {formatScore(r.totalScore)}
                            {r.manualTotalScore != null
                              ? ` • Manual: ${formatScore(r.manualTotalScore)}`
                              : ""}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetails(r);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2 shrink-0" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="w-full shadow-card">
            <CardContent className="w-full py-12 sm:py-16 text-center">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
                No Results Found
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-4 px-4 wrap-break-word">
                {isFiltering
                  ? "No candidates match your filters"
                  : "Generate a shortlist to see results"}
              </p>
              {isFiltering ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="wrap-break-word">
              Export Settings
            </DialogTitle>
          </DialogHeader>

          <div className="w-full space-y-4">
            {/* Export Mode */}
            <div className="w-full">
              <Label className="text-sm">Export mode</Label>
              <Select
                value={exportMode}
                onValueChange={(v) => setExportMode(v as ExportMode)}
              >
                <SelectTrigger className="h-10 w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Export ALL (includes disqualified)
                  </SelectItem>
                  <SelectItem value="shortlistedOnly">
                    Export SHORTLISTED only
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 wrap-break-word">
                "Shortlisted only" means candidates not disqualified (or
                disqualification overridden).
              </p>
            </div>

            {/* Degree Level Filter */}
            <div className="w-full">
              <Label className="text-sm">Degree level filter (optional)</Label>
              <Select
                value={degreeLevel}
                onValueChange={(v) => setDegreeLevel(v as any)}
              >
                <SelectTrigger className="h-10 w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All degrees</SelectItem>
                  <SelectItem value="BACHELORS">Bachelors</SelectItem>
                  <SelectItem value="MASTERS">Masters</SelectItem>
                  <SelectItem value="PHD">PhD</SelectItem>
                  <SelectItem value="DIPLOMA">Diploma</SelectItem>
                  <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-full max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="wrap-break-word text-lg sm:text-xl">
              {selectedResult?.firstName} {selectedResult?.lastName} — Detailed
              Breakdown
            </DialogTitle>
          </DialogHeader>

          {selectedResult ? (
            <div className="w-full space-y-4">
              {/* Scores Card */}
              <Card className="w-full shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base">Scores</CardTitle>
                </CardHeader>
                <CardContent className="w-full">
                  {/* Main Score Grid */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Effective Total
                      </p>
                      <p className="text-xl font-bold tabular-nums">
                        {formatScore(
                          selectedResult.effectiveTotalScore ??
                            selectedResult.totalScore,
                        )}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Source: {selectedResult.auditFlag ? "ADMIN" : "SYSTEM"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        System Total
                      </p>
                      <p className="text-xl font-bold tabular-nums">
                        {formatScore(selectedResult.totalScore)}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Kept for audit
                      </p>
                    </div>

                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Rank / Percentile
                      </p>
                      <p className="text-xl font-bold tabular-nums">
                        {selectedResult.candidateRank == null
                          ? "X"
                          : `#${selectedResult.candidateRank}`}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Top {formatScore(selectedResult.percentile)}%
                      </p>
                    </div>
                  </div>

                  {/* Subcategory Scores */}
                  <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      [
                        "Edu (Eff)",
                        selectedResult.effectiveEducationScore ??
                          selectedResult.educationScore,
                      ],
                      [
                        "Exp (Eff)",
                        selectedResult.effectiveExperienceScore ??
                          selectedResult.experienceScore,
                      ],
                      [
                        "Skills (Eff)",
                        selectedResult.effectiveSkillsScore ??
                          selectedResult.skillsScore,
                      ],
                      [
                        "Clear (Eff)",
                        selectedResult.effectiveClearanceScore ??
                          selectedResult.clearanceScore,
                      ],
                      [
                        "Pro (Eff)",
                        selectedResult.effectiveProfessionalScore ??
                          selectedResult.professionalScore,
                      ],
                    ].map(([label, val]) => (
                      <div
                        key={label as string}
                        className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 p-3"
                      >
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-1 truncate">
                          {label}
                        </p>
                        <p className="text-sm sm:text-base font-semibold tabular-nums">
                          {formatScore(val)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Disqualification Card */}
              {selectedResult.disqualificationReasons?.length ? (
                <Card className="w-full shadow-card border-red-200 dark:border-red-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-red-700 dark:text-red-400">
                      <XCircle className="h-5 w-5 shrink-0" />
                      Disqualification Reasons
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <ul className="w-full space-y-2">
                      {selectedResult.disqualificationReasons.map(
                        (item, idx) => (
                          <li
                            key={idx}
                            className="text-xs sm:text-sm text-red-700 dark:text-red-400 flex items-start gap-2"
                          >
                            <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span className="wrap-break-word">{item}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}

              {/* Admin Scoring Card */}
              {isAdminRole(user?.role) ? (
                <Card className="w-full shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      Admin Review & Manual Scoring (AUDITED)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full space-y-4">
                    {/* Manual Score Inputs */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="w-full">
                        <Label className="text-xs">
                          Manual Total Score (optional)
                        </Label>
                        <Input
                          value={adminScores.manualTotalScore}
                          onChange={(e) =>
                            setAdminScores((p) => ({
                              ...p,
                              manualTotalScore: e.target.value,
                            }))
                          }
                          placeholder="e.g. 82.5"
                          className="mt-1 w-full"
                        />
                      </div>

                      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            Override Disqualification
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            If ON, candidate will be ranked even if system
                            disqualified.
                          </p>
                        </div>
                        <Switch
                          checked={overrideDisq}
                          onCheckedChange={toggleOverrideDisq}
                          className="shrink-0"
                        />
                      </div>

                      <div className="w-full">
                        <Label className="text-xs">
                          Manual Education Score
                        </Label>
                        <Input
                          value={adminScores.manualEducationScore}
                          onChange={(e) =>
                            setAdminScores((p) => ({
                              ...p,
                              manualEducationScore: e.target.value,
                            }))
                          }
                          placeholder="e.g. 18"
                          className="mt-1 w-full"
                        />
                      </div>

                      <div className="w-full">
                        <Label className="text-xs">
                          Manual Experience Score
                        </Label>
                        <Input
                          value={adminScores.manualExperienceScore}
                          onChange={(e) =>
                            setAdminScores((p) => ({
                              ...p,
                              manualExperienceScore: e.target.value,
                            }))
                          }
                          placeholder="e.g. 22"
                          className="mt-1 w-full"
                        />
                      </div>

                      <div className="w-full">
                        <Label className="text-xs">Manual Skills Score</Label>
                        <Input
                          value={adminScores.manualSkillsScore}
                          onChange={(e) =>
                            setAdminScores((p) => ({
                              ...p,
                              manualSkillsScore: e.target.value,
                            }))
                          }
                          placeholder="e.g. 16"
                          className="mt-1 w-full"
                        />
                      </div>

                      <div className="w-full">
                        <Label className="text-xs">
                          Manual Clearance Score
                        </Label>
                        <Input
                          value={adminScores.manualClearanceScore}
                          onChange={(e) =>
                            setAdminScores((p) => ({
                              ...p,
                              manualClearanceScore: e.target.value,
                            }))
                          }
                          placeholder="e.g. 10"
                          className="mt-1 w-full"
                        />
                      </div>

                      <div className="w-full">
                        <Label className="text-xs">
                          Manual Professional Score
                        </Label>
                        <Input
                          value={adminScores.manualProfessionalScore}
                          onChange={(e) =>
                            setAdminScores((p) => ({
                              ...p,
                              manualProfessionalScore: e.target.value,
                            }))
                          }
                          placeholder="e.g. 8"
                          className="mt-1 w-full"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex flex-col sm:flex-row gap-2 justify-end pt-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setAdminScores({
                            manualTotalScore: "",
                            manualEducationScore: "",
                            manualExperienceScore: "",
                            manualSkillsScore: "",
                            manualClearanceScore: "",
                            manualProfessionalScore: "",
                          })
                        }
                        className="w-full sm:w-auto"
                      >
                        Clear manual scores
                      </Button>

                      <Button
                        onClick={saveAdminScoring}
                        disabled={savingAdminScore}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                      >
                        {savingAdminScore ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-4 w-4 mr-2" />
                        )}
                        Save & Rerank
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Matched Criteria */}
              {selectedResult.matchedCriteria?.length ? (
                <Card className="w-full shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                      Matched Criteria ({selectedResult.matchedCriteria.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <ul className="w-full space-y-2">
                      {selectedResult.matchedCriteria.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-green-700 dark:text-green-400 flex items-start gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                          <span className="wrap-break-word">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}

              {/* Missed Criteria */}
              {selectedResult.missedCriteria?.length ? (
                <Card className="w-full shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                      Missed Criteria ({selectedResult.missedCriteria.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <ul className="w-full space-y-2">
                      {selectedResult.missedCriteria.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-red-700 dark:text-red-400 flex items-start gap-2"
                        >
                          <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                          <span className="wrap-break-word">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}

              {/* Bonus Criteria */}
              {selectedResult.bonusCriteria?.length ? (
                <Card className="w-full shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      Bonus Points ({selectedResult.bonusCriteria.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <ul className="w-full space-y-2">
                      {selectedResult.bonusCriteria.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2"
                        >
                          <Trophy className="h-4 w-4 mt-0.5 shrink-0" />
                          <span className="wrap-break-word">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}

              {/* Footer Action Buttons */}
              <div className="w-full flex flex-col sm:flex-row justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  asChild
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Link
                    href={`/recruitment-portal/applications/detail?id=${selectedResult.applicationId}`}
                  >
                    View Full Application
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  asChild
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <a href={`mailto:${selectedResult.email}`}>
                    <Mail className="h-4 w-4 mr-2 shrink-0" />
                    Email Candidate
                  </a>
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
