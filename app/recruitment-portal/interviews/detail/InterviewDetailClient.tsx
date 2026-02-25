"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  User,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Send,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  type Interview,
  type InterviewStatus,
} from "@/types/recruitment/interview.types";
import { interviewsService } from "@/services/recruitment-services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/careers/ui/dialog";

export default function InterviewDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);

  useEffect(() => {
    if (interviewId) {
      fetchInterview();
    } else {
      toast.error("Interview ID is required");
      router.push("/recruitment-portal/interviews");
    }
  }, [interviewId]);

  const fetchInterview = async () => {
    if (!interviewId) return;

    try {
      setLoading(true);
      const response = await interviewsService.getInterviewById(interviewId);

      if (response.success && response.data) {
        setInterview(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load interview");
      router.push("/recruitment-portal/interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!interviewId) return;

    try {
      setDeleting(true);
      const response = await interviewsService.deleteInterview(interviewId);

      if (response.success) {
        toast.success("Interview deleted successfully");
        router.push("/recruitment-portal/interviews");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete interview");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSendReminder = async () => {
    if (!interviewId) return;

    try {
      setSendingReminder(true);
      const response = await interviewsService.sendReminder(interviewId);
      if (response.success) {
        toast.success("Reminder sent to candidate");
        fetchInterview();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send reminder");
    } finally {
      setSendingReminder(false);
    }
  };

  const getStatusBadge = (status: InterviewStatus) => {
    const statusConfig: Record<
      InterviewStatus,
      { color: string; label: string; icon: any }
    > = {
      SCHEDULED: { color: "bg-blue-500", label: "Scheduled", icon: Clock },
      IN_PROGRESS: {
        color: "bg-yellow-500",
        label: "In Progress",
        icon: AlertCircle,
      },
      COMPLETED: {
        color: "bg-green-500",
        label: "Completed",
        icon: CheckCircle,
      },
      CANCELLED: { color: "bg-red-500", label: "Cancelled", icon: XCircle },
      RESCHEDULED: {
        color: "bg-orange-500",
        label: "Rescheduled",
        icon: Calendar,
      },
      NO_SHOW: { color: "bg-gray-500", label: "No Show", icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Interview not found</p>
        <Button
          onClick={() => router.push("/recruitment-portal/interviews")}
          className="mt-4"
        >
          Back to Interviews
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/recruitment-portal/interviews")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
              Interview Details
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              View complete interview information
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isUpcoming(interview.scheduledAt) &&
            interview.status === "SCHEDULED" && (
              <Button
                variant="outline"
                onClick={handleSendReminder}
                disabled={sendingReminder}
              >
                {sendingReminder ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Reminder
              </Button>
            )}
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/recruitment-portal/interviews/edit?id=${interviewId}`,
              )
            }
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interview Overview</CardTitle>
                {getStatusBadge(interview.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Date & Time</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {formatDateTime(interview.scheduledAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Duration</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {interview.duration} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {interview.type === "VIDEO" ? (
                    <Video className="h-5 w-5 text-primary-500 mt-0.5" />
                  ) : interview.type === "PHONE" ? (
                    <Phone className="h-5 w-5 text-primary-500 mt-0.5" />
                  ) : (
                    <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-sm">Type</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {interview.type.replace("_", " ")}
                    </p>
                  </div>
                </div>

                {interview.interviewerName && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Interviewer</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {interview.interviewerName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {interview.type === "VIDEO" && interview.meetingLink && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="font-medium text-sm mb-2">Meeting Details</p>
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:underline break-all"
                  >
                    {interview.meetingLink}
                  </a>
                  {interview.meetingId && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                      Meeting ID: {interview.meetingId}
                    </p>
                  )}
                  {interview.meetingPassword && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Password: {interview.meetingPassword}
                    </p>
                  )}
                </div>
              )}

              {interview.type === "IN_PERSON" && interview.location && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="font-medium text-sm mb-2">Location</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {interview.location}
                  </p>
                </div>
              )}

              {interview.notes && (
                <div>
                  <p className="font-medium text-sm mb-2">Notes</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                    {interview.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback & Rating */}
          {interview.status === "COMPLETED" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Feedback & Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {interview.rating && (
                    <div>
                      <p className="font-medium text-sm mb-2">Rating</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < interview.rating!
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-neutral-600">
                          {interview.rating}/5
                        </span>
                      </div>
                    </div>
                  )}

                  {interview.outcome && (
                    <div>
                      <p className="font-medium text-sm mb-2">Outcome</p>
                      <Badge
                        className={
                          interview.outcome === "PASS"
                            ? "bg-green-500"
                            : interview.outcome === "FAIL"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }
                      >
                        {interview.outcome}
                      </Badge>
                    </div>
                  )}
                </div>

                {interview.feedback && (
                  <div>
                    <p className="font-medium text-sm mb-2">
                      Detailed Feedback
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                      {interview.feedback}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Candidate Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Candidate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-r from-primary-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  {interview.candidate.firstName[0]}
                  {interview.candidate.lastName[0]}
                </div>
                <div>
                  <p className="font-medium">
                    {interview.candidate.firstName}{" "}
                    {interview.candidate.lastName}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {interview.job.title}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-neutral-500" />
                  <a
                    href={`mailto:${interview.candidate.email}`}
                    className="text-primary-600 hover:underline"
                  >
                    {interview.candidate.email}
                  </a>
                </div>

                {interview.candidate.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-neutral-500" />
                    <a
                      href={`tel:${interview.candidate.phone}`}
                      className="text-primary-600 hover:underline"
                    >
                      {interview.candidate.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-neutral-500" />
                  <span>Position: {interview.job.title}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          {interview.history &&
            Array.isArray(interview.history) &&
            interview.history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {interview.history.map((history: any) => (
                      <div
                        key={history.id}
                        className="text-sm border-l-2 border-primary-500 pl-3 py-2"
                      >
                        <p className="font-medium">
                          {history.fromStatus || "New"} → {history.toStatus}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {new Date(history.changedAt).toLocaleString()}
                        </p>
                        {history.reason && (
                          <p className="text-xs text-neutral-600 mt-1">
                            {history.reason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Interview</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this interview? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
