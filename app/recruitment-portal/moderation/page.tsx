"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { jobsService } from "@/services/recruitment-services";
import { useError } from "@/context/ErrorContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Textarea } from "@/components/careers/ui/textarea";
import { Badge } from "@/components/careers/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/careers/ui/dialog";
import { Label } from "@/components/careers/ui/label";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Building2,
} from "lucide-react";
import type { Job } from "@/types";

export default function ModerationQueuePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { logError, showToast } = useError();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (
      !user ||
      !["MODERATOR", "HR_MANAGER", "SUPER_ADMIN"].includes(user.role)
    ) {
      router.push("/recruitment-portal/dashboard");
      return;
    }
    fetchModerationQueue();
  }, [user]);

  const fetchModerationQueue = async () => {
    try {
      setLoading(true);
      const response = await jobsService.getModerationQueue();
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error: any) {
      logError(error);
      showToast(error.message || "Failed to fetch moderation queue", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: string) => {
    if (!confirm("Are you sure you want to approve this job?")) return;

    try {
      setProcessing(true);
      const response = await jobsService.moderateJob(jobId, {
        status: "ACTIVE",
      });

      if (response.success) {
        showToast("Job approved successfully", "success");
        fetchModerationQueue();
      }
    } catch (error: any) {
      logError(error);
      showToast(error.message || "Failed to approve job", "error");
    } finally {
      setProcessing(false);
    }
  };

  const openRejectDialog = (job: Job) => {
    setSelectedJob(job);
    setRejectionReason("");
    setShowRejectDialog(true);
  };

  const handleReject = async () => {
    if (!selectedJob) return;
    if (!rejectionReason.trim()) {
      showToast("Please provide a rejection reason", "error");
      return;
    }

    try {
      setProcessing(true);
      const response = await jobsService.moderateJob(selectedJob.id, {
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      });

      if (response.success) {
        showToast("Job rejected", "success");
        setShowRejectDialog(false);
        fetchModerationQueue();
      }
    } catch (error: any) {
      logError(error);
      showToast(error.message || "Failed to reject job", "error");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
          Job Moderation Queue
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Review and approve pending job postings
        </p>
      </div>

      {/* Stats */}
      <Card className="bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">
                {jobs.length}
              </p>
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                Jobs awaiting approval
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid gap-4 sm:gap-6">
          {jobs.map((job, index) => (
            <Card
              key={job.id}
              className="animate-fade-in shadow-card hover:shadow-card-hover transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white truncate">
                        {job.title}
                      </h3>
                      <Badge className="bg-yellow-500 text-white shrink-0">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span className="font-medium truncate">
                        {job.company.name}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{job.location}</span>
                      {job.isRemote && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <Badge variant="outline" className="text-xs">
                            Remote
                          </Badge>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs"
                      >
                        {job.category.name}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs"
                      >
                        {job.type.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs"
                      >
                        {job.experienceLevel.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-2 sm:mb-3">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="truncate">
                        Posted by {job.postedBy?.firstName}{" "}
                        {job.postedBy?.lastName}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Link
                      href={`/careers-portal/jobs/${job.id}`}
                      target="_blank"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Preview
                    </Link>
                  </Button>
                  <Button
                    onClick={() => openRejectDialog(job)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    disabled={processing}
                  >
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(job.id)}
                    variant="default"
                    size="sm"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    disabled={processing}
                  >
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-green-500 mb-4" />
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-white">
            All caught up!
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            No jobs pending approval at the moment
          </p>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Reject Job Posting
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Please provide a reason for rejecting this job. This will be sent
              to the poster.
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <p className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white truncate">
                  {selectedJob.title}
                </p>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">
                  {selectedJob.company.name}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rejectionReason" className="text-xs sm:text-sm">
                  Rejection Reason *
                </Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Job description is incomplete, violates posting guidelines, etc."
                  className="min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRejectDialog(false)}
              disabled={processing}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
              className="w-full sm:w-auto"
            >
              {processing ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Job"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
