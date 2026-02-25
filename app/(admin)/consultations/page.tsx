"use client";

import { useEffect, useState } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Mail,
  Phone,
  Building,
  Search,
  Archive,
  Trash2,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useContactSubmissions } from "@/hooks/useContactSubmissions";
import { contactSubmissionService } from "@/services/web-services";
import type {
  ContactStatus,
  ContactStatusOption,
} from "@/types/api/contact-submissions.types";

const STATUS_OPTIONS: ContactStatusOption[] = [
  {
    value: "all",
    label: "All Status",
    color: "text-neutral-600 dark:text-neutral-400",
    bgColor: "bg-neutral-100 dark:bg-neutral-800",
    icon: null,
  },
  {
    value: "pending",
    label: "Pending",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    icon: Clock,
  },
  {
    value: "contacted",
    label: "Contacted",
    color: "text-primary-600 dark:text-primary-400",
    bgColor: "bg-primary-100 dark:bg-primary-900/30",
    icon: CheckCircle,
  },
  {
    value: "closed",
    label: "Closed",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: CheckCircle,
  },
];

export default function AdminContactSubmissions() {
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const {
    submissions,
    loading,
    updatingStatus,
    deletingId,
    fetchSubmissions,
    updateStatus,
    deleteSubmission,
  } = useContactSubmissions();

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const getStatusDisplay = (status: ContactStatus) => {
    return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  };

  const filteredSubmissions = contactSubmissionService.filterSubmissions(
    submissions,
    statusFilter,
    searchTerm,
  );

  const stats = contactSubmissionService.calculateStats(submissions);

  const handleDeleteSubmission = async (id: string) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      await deleteSubmission(id);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={Mail} />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb icon={Mail} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Contact Submissions
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center text-sm md:text-base">
            <Mail className="w-4 h-4 mr-2 text-primary-500" />
            Manage and respond to contact form submissions •{" "}
            {submissions.length} total
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
            />
          </div>
          <Button
            onClick={fetchSubmissions}
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats and Filter Tabs */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 md:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-orange-600 dark:text-orange-400 text-lg">
                {stats.pending}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                Pending
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary-600 dark:text-primary-400 text-lg">
                {stats.contacted}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                Contacted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                {stats.closed}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                Closed
              </span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-neutral-200 dark:border-neutral-700 pt-4 sm:pt-0 sm:pl-6">
              <span className="text-neutral-500 dark:text-neutral-400">
                Showing {filteredSubmissions.length} of {submissions.length}
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex overflow-x-auto bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg w-full lg:w-auto">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize whitespace-nowrap ${
                  statusFilter === status.value
                    ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => {
          const statusConfig = getStatusDisplay(submission.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card
              key={submission.id}
              className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-linear-to-br from-primary-100 to-orange-100 dark:from-primary-900/30 dark:to-orange-900/30 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white">
                        {submission.name}
                      </h3>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                      >
                        {StatusIcon && <StatusIcon className="w-3 h-3" />}
                        {statusConfig.label}
                      </div>
                      <span className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                        •{" "}
                        {new Date(submission.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                        <Mail className="w-4 h-4 shrink-0" />
                        <a
                          href={`mailto:${submission.email}`}
                          className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline truncate"
                        >
                          {submission.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                        <Phone className="w-4 h-4 shrink-0" />
                        <a
                          href={`tel:${submission.phone}`}
                          className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
                        >
                          {submission.phone}
                        </a>
                      </div>
                      {submission.company && (
                        <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                          <Building className="w-4 h-4 shrink-0" />
                          <span className="truncate">{submission.company}</span>
                        </div>
                      )}
                    </div>

                    {/* Service Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        {submission.service}
                      </span>
                      {submission.source && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400">
                          {submission.source}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <blockquote className="text-sm text-neutral-700 dark:text-neutral-300 border-l-4 border-primary-200 dark:border-primary-800 pl-4 py-2 italic bg-neutral-50 dark:bg-neutral-800/50 rounded-r">
                      &quot;{submission.message}&quot;
                    </blockquote>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 shrink-0">
                    <select
                      value={submission.status}
                      onChange={(e) =>
                        updateStatus(
                          submission.id,
                          e.target.value as ContactStatus,
                        )
                      }
                      disabled={updatingStatus === submission.id}
                      className={`px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm font-medium ${statusConfig.color} ${statusConfig.bgColor} disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                    >
                      {STATUS_OPTIONS.filter((s) => s.value !== "all").map(
                        (option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ),
                      )}
                    </select>

                    <div className="flex lg:flex-col gap-2 flex-1 lg:flex-none">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            contactSubmissionService.generateEmailReply(
                              submission,
                            ),
                          )
                        }
                        className="flex-1 lg:flex-none text-xs lg:w-full"
                        title="Send email reply"
                      >
                        <Mail className="w-3 h-3 lg:mr-1" />
                        <span className="hidden lg:inline">Email</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubmission(submission.id)}
                        disabled={deletingId === submission.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 lg:w-full"
                        title="Delete submission"
                      >
                        {deletingId === submission.id ? (
                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 lg:mr-1" />
                            <span className="hidden lg:inline">Delete</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Empty State */}
        {filteredSubmissions.length === 0 && (
          <Card className="p-8 md:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl flex items-center justify-center">
                <Archive className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                No submissions found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "No contact submissions match your current filters."
                  : "No contact submissions yet. Check back later."}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("all");
                    setSearchTerm("");
                  }}
                  className="bg-linear-to-r from-primary-600 to-orange-600 hover:from-primary-700 hover:to-orange-700 text-white border-none"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
