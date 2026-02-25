"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { applicationsService } from "@/services/recruitment-services";
import { Card, CardContent } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { Checkbox } from "@/components/careers/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { useToast } from "@/components/careers/ui/use-toast";
import {
  ArrowLeft,
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
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getFileUrl } from "@/lib/configuration";
import type { ApplicationForEmployer, ApplicationStats } from "@/types/";

export default function JobApplicationsClient() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const jobId = searchParams.get("jobId");

  const [applications, setApplications] = useState<ApplicationForEmployer[]>(
    [],
  );
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    [],
  );
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    if (
      !user ||
      !["EMPLOYER", "HR_MANAGER", "MODERATOR", "SUPER_ADMIN"].includes(
        user.role,
      )
    ) {
      router.push("/careers-portal");
      return;
    }

    if (!jobId) {
      toast({
        title: "Error",
        description: "Job ID is required",
        variant: "destructive",
      });
      router.push("/recruitment-portal/applications");
      return;
    }

    fetchApplications();
  }, [user, jobId, currentPage, itemsPerPage, statusFilter]);

  const fetchApplications = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await applicationsService.getApplicationsForJob(
        jobId,
        params,
      );

      if (response.success && response.data) {
        setApplications(response.data.applications);
        setStats(response.data.stats);

        // Extract job title from first application
        if (response.data.applications.length > 0) {
          setJobTitle(response.data.applications[0].job.title);
        }

        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setTotalResults(response.data.pagination.total);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedApplications([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedApplications.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select applications to update",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsBulkUpdating(true);
      await applicationsService.bulkUpdate({
        applicationIds: selectedApplications,
        status: newStatus,
      });

      toast({
        title: "Success",
        description: `${selectedApplications.length} application(s) updated to ${newStatus}`,
      });

      setSelectedApplications([]);
      fetchApplications();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update applications",
        variant: "destructive",
      });
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

  // const handleExportCSV = async () => {
  //   if (!jobId) return;
  //
  //   try {
  //     await applicationsService.exportToCSV(jobId);
  //     toast({
  //       title: "Export Started",
  //       description: "Your CSV file will download shortly",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Export Failed",
  //       description: error.message || "Failed to export CSV",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleExportXLSX = async () => {
    if (!jobId) return;

    try {
      await applicationsService.exportToXLSX(jobId);
      toast({
        title: "Export Started",
        description: "Your Excel file will download shortly",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export Excel",
        variant: "destructive",
      });
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
    if (totalPages <= 1) return null;

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
        </Button>,
      );
    }

    return (
      <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults}{" "}
          results
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {startPage > 1 && (
            <>
              <Button
                onClick={() => handlePageChange(1)}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                1
              </Button>
              {startPage > 2 && (
                <span className="px-2 text-neutral-400">...</span>
              )}
            </>
          )}

          {pages}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 text-neutral-400">...</span>
              )}
              <Button
                onClick={() => handlePageChange(totalPages)}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Per page:
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
            disabled={loading}
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
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in flex-wrap gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href="/recruitment-portal/jobs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Job Applications
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            {jobTitle || "Loading..."} • {totalResults} application
            {totalResults !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button onClick={handleExportCSV} variant="outline" disabled={loading || applications.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button> */}
          <Button
            onClick={handleExportXLSX}
            variant="outline"
            disabled={loading || applications.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stats.total}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Pending
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <Eye className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {stats.reviewed}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Reviewed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {stats.shortlisted}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Shortlisted
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-indigo-600">
                  {stats.interview}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Interview
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {stats.offered}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Offered
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">
                  {stats.accepted}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Accepted
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Rejected
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Filter */}
      <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Filter by status:
            </span>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Status ({stats?.total || 0})
                </SelectItem>
                <SelectItem value="PENDING">
                  Pending ({stats?.pending || 0})
                </SelectItem>
                <SelectItem value="REVIEWED">
                  Reviewed ({stats?.reviewed || 0})
                </SelectItem>
                <SelectItem value="SHORTLISTED">
                  Shortlisted ({stats?.shortlisted || 0})
                </SelectItem>
                <SelectItem value="INTERVIEW">
                  Interview ({stats?.interview || 0})
                </SelectItem>
                <SelectItem value="OFFERED">
                  Offered ({stats?.offered || 0})
                </SelectItem>
                <SelectItem value="ACCEPTED">
                  Accepted ({stats?.accepted || 0})
                </SelectItem>
                <SelectItem value="REJECTED">
                  Rejected ({stats?.rejected || 0})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 animate-fade-in">
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
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Mark Reviewed
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
                  disabled={isBulkUpdating}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
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
                disabled={loading}
              />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Select All{" "}
                {applications.length > 0 &&
                  `(${applications.length} on this page)`}
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
                            prev.filter((id) => id !== application.id),
                          );
                        }
                      }}
                      disabled={loading}
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <a
                            href={`mailto:${application.candidate.email}`}
                            className="truncate hover:text-primary-600 transition-colors"
                          >
                            {application.candidate.email}
                          </a>
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
                              Expected: KSh{" "}
                              {parseInt(
                                application.expectedSalary,
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            Applied: {formatDate(application.appliedAt)}
                          </span>
                        </div>

                        {application.availableStartDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-green-600" />
                            <span>
                              Available:{" "}
                              {formatDate(application.availableStartDate)}
                            </span>
                          </div>
                        )}
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
                                    <Star className="h-3 w-3 ml-1 inline fill-orange-500 text-orange-500" />
                                  )}
                                </Badge>
                              ),
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
                                application.candidate.candidateProfile
                                  .resumeUrl,
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

          {/* Pagination */}
          {renderPagination()}
        </>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
              No Applications Found
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {statusFilter !== "all"
                ? "No applications match the selected status"
                : "No applications have been submitted for this job yet"}
            </p>
            {statusFilter !== "all" && (
              <Button
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                variant="outline"
                disabled={loading}
              >
                Clear Filter
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
