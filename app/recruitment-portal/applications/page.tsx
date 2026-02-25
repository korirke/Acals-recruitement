"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { applicationsService } from "@/services/recruitment-services";
import { Card, CardContent } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Badge } from "@/components/careers/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { Checkbox } from "@/components/careers/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/careers/ui/dialog";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Download,
  Eye,
  Loader2,
  Star,
  FileText,
  Mail,
  Banknote,
  Calendar,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Video,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getFileUrl } from "@/lib/configuration";
import type { ApplicationForEmployer } from "@/types";
import ScheduleInterviewModal from "@/components/recruitment/ScheduleInterviewModal";

export default function ApplicationsManagementPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<ApplicationForEmployer[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  );
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Interview scheduling modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplicationForInterview, setSelectedApplicationForInterview] =
    useState<ApplicationForEmployer | null>(null);

  // Status change confirmation
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    status: string;
    applicationIds: string[];
  } | null>(null);

  useEffect(() => {
    if (
      !user ||
      !["EMPLOYER", "HR_MANAGER", "MODERATOR", "SUPER_ADMIN"].includes(
        user.role
      )
    ) {
      router.push("/careers-portal");
      return;
    }
    handleFilter();
  }, [user, currentPage, itemsPerPage]);

  const handleFilter = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchQuery) filters.query = searchQuery;
      if (statusFilter !== "all") filters.status = statusFilter;

      const response = await applicationsService.filterApplications(filters);

      if (response.success && response.data) {
        setApplications(response.data.applications);

        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setTotalResults(response.data.pagination.total);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    handleFilter();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedApplications([]);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedApplications.length === 0) {
      toast.error("Please select applications to update");
      return;
    }

    // If changing to INTERVIEW status, check if only one application is selected
    if (newStatus === "INTERVIEW") {
      if (selectedApplications.length !== 1) {
        toast.error(
          "Please select exactly one application to schedule an interview"
        );
        return;
      }

      // Find the selected application
      const app = applications.find((a) => a.id === selectedApplications[0]);
      if (app) {
        setSelectedApplicationForInterview(app);
        setShowScheduleModal(true);
      }
      return;
    }

    // For other statuses, show confirmation dialog
    setPendingStatusChange({
      status: newStatus,
      applicationIds: selectedApplications,
    });
    setShowStatusChangeDialog(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    try {
      setIsBulkUpdating(true);
      await applicationsService.bulkUpdate({
        applicationIds: pendingStatusChange.applicationIds,
        status: pendingStatusChange.status,
      });

      toast.success(
        `${pendingStatusChange.applicationIds.length} application(s) updated to ${pendingStatusChange.status}`
      );

      setSelectedApplications([]);
      setShowStatusChangeDialog(false);
      setPendingStatusChange(null);
      handleFilter();
    } catch (error: any) {
      toast.error(error.message || "Failed to update applications");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map((app) => app.id));
    }
  };

  const handleExportCSV = async () => {
    try {
      await applicationsService.exportToCSV();
      toast.success("CSV export started - your file will download shortly");
    } catch (error: any) {
      toast.error(error.message || "Failed to export CSV");
    }
  };

  const handleExportXLSX = async () => {
    try {
      await applicationsService.exportToXLSX();
      toast.success("Excel export started - your file will download shortly");
    } catch (error: any) {
      toast.error(error.message || "Failed to export Excel");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      PENDING: { color: "bg-yellow-500", label: "Pending" },
      REVIEWED: { color: "bg-blue-500", label: "Reviewed" },
      SHORTLISTED: { color: "bg-purple-500", label: "Shortlisted" },
      INTERVIEW: { color: "bg-indigo-500", label: "Interview" },
      OFFERED: { color: "bg-green-500", label: "Offered" },
      ACCEPTED: { color: "bg-green-600", label: "Accepted" },
      REJECTED: { color: "bg-red-500", label: "Rejected" },
      WITHDRAWN: { color: "bg-gray-500", label: "Withdrawn" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-500",
      label: status,
    };
    return (
      <Badge className={`${config.color} text-white`}>{config.label}</Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
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

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={currentPage === i ? "bg-primary-500" : ""}
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Showing {Math.max(1, (currentPage - 1) * itemsPerPage + 1)} to{" "}
          {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults}{" "}
          results
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {startPage > 1 && (
            <>
              <Button
                onClick={() => handlePageChange(1)}
                variant="outline"
                size="sm"
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}

          {pages}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <Button
                onClick={() => handlePageChange(totalPages)}
                variant="outline"
                size="sm"
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Per page:
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Application Management
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Review and manage candidate applications ({totalResults} total)
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button> */}
          <Button onClick={handleExportXLSX} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by candidate name, email, job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                <SelectItem value="INTERVIEW">Interview</SelectItem>
                <SelectItem value="OFFERED">Offered</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {selectedApplications.length} application(s) selected
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => handleBulkStatusChange("REVIEWED")}
                  disabled={isBulkUpdating}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isBulkUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Mark Reviewed"
                  )}
                </Button>
                <Button
                  onClick={() => handleBulkStatusChange("SHORTLISTED")}
                  disabled={isBulkUpdating}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Shortlist
                </Button>
                <Button
                  onClick={() => handleBulkStatusChange("INTERVIEW")}
                  disabled={isBulkUpdating || selectedApplications.length !== 1}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  title={
                    selectedApplications.length !== 1
                      ? "Select exactly one application to schedule interview"
                      : "Schedule interview"
                  }
                >
                  <Video className="h-4 w-4 mr-1" />
                  Schedule Interview
                </Button>
                <Button
                  onClick={() => handleBulkStatusChange("REJECTED")}
                  disabled={isBulkUpdating}
                  size="sm"
                  variant="destructive"
                >
                  Reject
                </Button>
              </div>
            </div>
            {selectedApplications.length > 1 && (
              <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  To schedule an interview, please select only one application
                  at a time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      {applications.length > 0 ? (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4">
              <Checkbox
                checked={
                  selectedApplications.length === applications.length &&
                  applications.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Select All
              </span>
            </div>

            {applications.map((application, index) => (
              <Card
                key={application.id}
                className="animate-fade-in hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${(index + 2) * 50}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedApplications.includes(application.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedApplications((prev) => [
                            ...prev,
                            application.id,
                          ]);
                        } else {
                          setSelectedApplications((prev) =>
                            prev.filter((id) => id !== application.id)
                          );
                        }
                      }}
                    />
                    <div className="h-12 w-12 rounded-full bg-linear-to-r from-primary-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {application.candidate.firstName[0]}
                      {application.candidate.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                          {application.candidate.firstName}{" "}
                          {application.candidate.lastName}
                        </h3>
                        {getStatusBadge(application.status)}
                        {application.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(application.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-orange-500 text-orange-500"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                        {application.candidate.candidateProfile?.title ||
                          "No title specified"}
                      </p>

                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        Applied for:{" "}
                        <span className="font-medium">
                          {application.job.title}
                        </span>
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {application.candidate.email}
                          </span>
                        </div>

                        {application.candidate.candidateProfile?.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {application.candidate.candidateProfile.location}
                            </span>
                          </div>
                        )}

                        {application.candidate.candidateProfile
                          ?.experienceYears && (
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {
                                application.candidate.candidateProfile
                                  .experienceYears
                              }{" "}
                              experience
                            </span>
                          </div>
                        )}

                        {application.expectedSalary && (
                          <div className="flex items-center gap-1.5">
                            <Banknote className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              Expected: KSh {application.expectedSalary}
                            </span>
                          </div>
                        )}

                        {application.availableStartDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              Available:{" "}
                              {formatDate(application.availableStartDate)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            Applied: {formatDate(application.appliedAt)}
                          </span>
                        </div>
                      </div>

                      {application.candidate.candidateProfile?.domains &&
                        application.candidate.candidateProfile.domains.length >
                          0 && (
                          <div className="flex flex-wrap gap-2">
                            {application.candidate.candidateProfile.domains.map(
                              (d) => (
                                <Badge
                                  key={d.domain.id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {d.domain.name}
                                  {d.isPrimary && (
                                    <Star className="h-3 w-3 ml-1 inline" />
                                  )}
                                </Badge>
                              )
                            )}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={`/recruitment-portal/applications/detail?id=${application.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Link>
                      </Button>
                      {application.candidate.candidateProfile?.resumeUrl && (
                        <Button asChild size="sm" variant="ghost">
                          <a
                            href={
                              getFileUrl(
                                application.candidate.candidateProfile.resumeUrl
                              ) ?? undefined
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Resume
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && renderPagination()}
        </>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
              No Applications Found
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "No applications match your filters"
                : "No applications have been submitted yet"}
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setCurrentPage(1);
                  handleFilter();
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={showStatusChangeDialog}
        onOpenChange={setShowStatusChangeDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of{" "}
              {pendingStatusChange?.applicationIds.length} application(s) to{" "}
              <strong>{pendingStatusChange?.status}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowStatusChangeDialog(false);
                setPendingStatusChange(null);
              }}
              disabled={isBulkUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStatusChange}
              disabled={isBulkUpdating}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {isBulkUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Scheduling Modal */}
      <ScheduleInterviewModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        application={selectedApplicationForInterview}
        onSuccess={() => {
          handleFilter();
          setSelectedApplications([]);
        }}
      />
    </div>
  );
}