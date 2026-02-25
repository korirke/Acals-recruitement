"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useApplications } from "@/hooks/useCandidate";
import { Card, CardContent } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { Input } from "@/components/careers/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/careers/ui/alert-dialog";
import {
  Loader2,
  Search,
  FileText,
  Building2,
  MapPin,
  Calendar,
  Clock,
  XCircle,
  TrendingUp,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";
import type { ApplicationStatus } from "@/types";
import { normalizeImageUrl } from "@/lib/imageUtils";

// ─── Active vs Archive buckets ─────────────────────────────────────────────
const activeStatuses: ApplicationStatus[] = [
  "PENDING",
  "REVIEWED",
  "SHORTLISTED",
  "INTERVIEW",
  "INTERVIEWED",
  "OFFERED",
];

const archiveStatuses: ApplicationStatus[] = [
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

export default function ApplicationsPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const {
    applications,
    stats,
    loading,
    fetchApplications,
    withdrawApplication,
  } = useApplications();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"active" | "archive">("active");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // ─── Auth guard ────────────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login?redirect=/careers-portal/applications");
      return;
    }
    if (user?.role !== "CANDIDATE") {
      router.push("/careers-portal");
      return;
    }
    setInitialLoadComplete(true);
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (initialLoadComplete && isAuthenticated && user?.role === "CANDIDATE") {
      fetchApplications();
    }
  }, [initialLoadComplete, isAuthenticated, user?.role, fetchApplications]);

  // ─── Withdraw ──────────────────────────────────────────────────────────
  const handleWithdraw = async () => {
    if (!withdrawingId) return;
    try {
      await withdrawApplication(withdrawingId);
      setShowWithdrawDialog(false);
      setWithdrawingId(null);
      await fetchApplications();
    } catch (error) {
      console.error("Failed to withdraw:", error);
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────────────
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0000-00-00 00:00:00.000") return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatSalary = (amount?: number) => {
    if (!amount) return null;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // ─── Filtered list ─────────────────────────────────────────────────────
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.category.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesViewMode =
      viewMode === "active"
        ? activeStatuses.includes(app.status as ApplicationStatus)
        : archiveStatuses.includes(app.status as ApplicationStatus);

    return matchesSearch && matchesViewMode;
  });

  const activeCount = applications.filter((app) =>
    activeStatuses.includes(app.status as ApplicationStatus)
  ).length;

  const archiveCount = applications.filter((app) =>
    archiveStatuses.includes(app.status as ApplicationStatus)
  ).length;

  // ─── Loading ───────────────────────────────────────────────────────────
  if (authLoading || (loading && !initialLoadComplete)) {
    return (
      <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto" />
          <p className="text-neutral-600 dark:text-neutral-400">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "CANDIDATE") return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-5xl">

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            My Applications
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1 text-sm">
            Track and manage all your submitted job applications
          </p>
        </div>

        {/* ── Summary Stats  ─── */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {activeCount}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Active Applications
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <Inbox className="h-6 w-6 text-neutral-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {archiveCount}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Archived
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Tabs + Search ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Active / Archive toggle */}
          <div className="flex gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("active")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "active"
                  ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setViewMode("archive")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "archive"
                  ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Archive ({archiveCount})
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <Input
              placeholder="Search by job title, company or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 h-11"
            />
          </div>
        </div>

        {/* ── Applications List ───────────────────────────────────────── */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const canWithdraw = ["PENDING", "REVIEWED"].includes(
                application.status
              );

              // ACCEPTED → archive with success treatment
              const isAccepted = application.status === "ACCEPTED";

              return (
                <Card
                  key={application.id}
                  className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-5">

                      {/* Company Logo */}
                      <div className="shrink-0">
                        <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden">
                          {application.job.company.logo ? (
                            <img
                              src={normalizeImageUrl(application.job.company.logo)}
                              alt={application.job.company.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-7 h-7 text-neutral-400" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">

                        {/* Top Row: Title + Status Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white line-clamp-1">
                              {application.job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                              <div className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 shrink-0" />
                                <span>{application.job.company.name}</span>
                              </div>
                              {application.job.company.location && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                                  <span>{application.job.company.location}</span>
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                {application.job.category.name}
                              </Badge>
                            </div>
                          </div>

                          {/* Status Badge — always "Under Review" unless ACCEPTED */}
                          {isAccepted ? (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 shrink-0">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                  Successful
                                </span>
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 opacity-80">
                                  Application accepted
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shrink-0">
                              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                  Under Review
                                </span>
                                <span className="text-xs text-blue-600 dark:text-blue-400 opacity-80">
                                  Your application is being reviewed
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Meta Row: Applied date + salary */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Applied {formatDate(application.appliedAt)}</span>
                          </div>
                          {application.expectedSalary && (
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>
                                Expected: {formatSalary(application.expectedSalary)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Cover Letter Preview */}
                        {application.coverLetter && (
                          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-3 mb-4 border border-neutral-100 dark:border-neutral-700">
                            <div className="flex items-center gap-2 mb-1.5">
                              <FileText className="w-3.5 h-3.5 text-neutral-400" />
                              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                                Cover Letter
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}

                        {/*
                          STATUS TIMELINE — hidden from candidates temporarily
                          ──────────────────────────────────────────────────────
                          {application.statusHistory && application.statusHistory.length > 0 && (
                            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-neutral-500" />
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                  Application Timeline
                                </span>
                              </div>
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {application.statusHistory.slice().reverse().map((history, index) => {
                                  return (
                                    <div key={history.id} className="flex items-center gap-2 shrink-0">
                                      <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                          <Clock className="w-4 h-4 text-neutral-500" />
                                        </div>
                                        <span className="text-xs text-neutral-500 mt-1 whitespace-nowrap">
                                          {formatDate(history.changedAt)}
                                        </span>
                                      </div>
                                      {index < application.statusHistory!.length - 1 && (
                                        <div className="w-8 h-0.5 bg-neutral-200 dark:bg-neutral-700" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        */}

                        {/* ── Action Buttons ─────────────────────────── */}
                        <div className="flex flex-wrap gap-2">
                          {/*
                            VIEW DETAILS — commented out temporarily
                            ─────────────────────────────────────────────
                            <Button asChild variant="default" size="sm" className="gap-2">
                              <Link href={`/careers-portal/applications/detail?id=${application.id}`}>
                                <Eye className="w-4 h-4" />
                                View Details
                              </Link>
                            </Button>
                          */}

                          <Button asChild variant="outline" size="sm" className="gap-2 h-9">
                            <Link href={`/careers-portal/jobs/job-detail?id=${application.job.id}`}>
                              <ExternalLink className="w-3.5 h-3.5" />
                              View Job
                            </Link>
                          </Button>

                          {application.resumeUrl && (
                            <Button asChild variant="outline" size="sm" className="gap-2 h-9">
                              <a
                                href={application.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Resume
                              </a>
                            </Button>
                          )}

                          {canWithdraw && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                              onClick={() => {
                                setWithdrawingId(application.id);
                                setShowWithdrawDialog(true);
                              }}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Withdraw
                            </Button>
                          )}
                        </div>

                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* ── Empty State ─────────────────────────────────────────── */
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <CardContent className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-5">
                {viewMode === "archive" ? (
                  <Inbox className="w-10 h-10 text-neutral-400" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-neutral-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {searchQuery
                  ? "No Results Found"
                  : viewMode === "active"
                  ? "No Active Applications"
                  : "Archive is Empty"}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-6 max-w-sm">
                {searchQuery
                  ? "Try adjusting your search to find what you're looking for"
                  : viewMode === "active"
                  ? "You haven't applied to any jobs yet. Browse open positions to get started."
                  : "Completed or withdrawn applications will appear here"}
              </p>
              {!searchQuery && viewMode === "active" && (
                <Button asChild>
                  <Link href="/careers-portal/jobs">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />

      {/* ── Withdraw Confirmation Dialog ──────────────────────────────── */}
      <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <AlertDialogTitle className="text-lg">
                Withdraw Application?
              </AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          <div className="space-y-3 px-1">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Are you sure you want to withdraw this application?
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-1.5">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 uppercase tracking-wide">
                What happens next
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  Application moves to your archive
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  You can reapply to this position anytime
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  The employer will be notified
                </li>
              </ul>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
              This action cannot be undone.
            </p>
          </div>

          <AlertDialogFooter className="gap-2 mt-2">
            <AlertDialogCancel
              onClick={() => setWithdrawingId(null)}
              className="flex-1"
            >
              Keep Application
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Yes, Withdraw
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
