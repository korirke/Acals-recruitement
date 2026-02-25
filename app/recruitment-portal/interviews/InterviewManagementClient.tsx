"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Calendar,
  User,
  Video,
  MapPin,
  Mail,
  Phone,
  Plus,
  Edit2,
  Trash2,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { interviewsService } from "@/services/recruitment-services";
import {
  type InterviewType,
  type InterviewStatus,
  SearchInterviewsParams,
  type Interview,
} from "@/types";

export default function InterviewManagementClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || "",
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "all",
  );
  const [typeFilter, setTypeFilter] = useState<string>(
    searchParams.get("type") || "all",
  );
  const [selectedInterviews, setSelectedInterviews] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalResults, setTotalResults] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, [currentPage, itemsPerPage]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params: SearchInterviewsParams = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchQuery) params.query = searchQuery;
      if (statusFilter !== "all")
        params.status = statusFilter as InterviewStatus;
      if (typeFilter !== "all") params.type = typeFilter as InterviewType;

      const response = await interviewsService.searchInterviews(params);

      if (response.success && response.data) {
        setInterviews(response.data.interviews);
        setTotalResults(response.data.pagination.total);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    updateURL();
    fetchInterviews();
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (currentPage > 1) params.set("page", currentPage.toString());

    router.replace(`/recruitment-portal/interviews?${params.toString()}`, {
      scroll: false,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedInterviews([]);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleBulkStatusChange = async (newStatus: InterviewStatus) => {
    if (selectedInterviews.length === 0) {
      toast.error("Please select interviews to update");
      return;
    }

    try {
      setIsBulkUpdating(true);
      const response = await interviewsService.bulkUpdateStatus(
        selectedInterviews,
        newStatus,
      );

      if (response.success) {
        toast.success(`${selectedInterviews.length} interview(s) updated`);
        setSelectedInterviews([]);
        fetchInterviews();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update interviews");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleDeleteInterview = async () => {
    if (!deleteId) return;

    try {
      const response = await interviewsService.deleteInterview(deleteId);
      if (response.success) {
        toast.success("Interview deleted successfully");
        setShowDeleteDialog(false);
        setDeleteId(null);
        fetchInterviews();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete interview");
    }
  };

  const handleSendReminder = async (id: string) => {
    try {
      const response = await interviewsService.sendReminder(id);
      if (response.success) {
        toast.success("Reminder sent to candidate");
        fetchInterviews();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send reminder");
    }
  };

  const handleSelectAll = () => {
    if (selectedInterviews.length === interviews.length) {
      setSelectedInterviews([]);
    } else {
      setSelectedInterviews(interviews.map((i) => i.id));
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

  const getInterviewTypeBadge = (type: InterviewType) => {
    const typeConfig: Record<InterviewType, { color: string; icon: any }> = {
      PHONE: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        icon: Phone,
      },
      VIDEO: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        icon: Video,
      },
      IN_PERSON: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: MapPin,
      },
      TECHNICAL: {
        color:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
        icon: User,
      },
      HR_SCREENING: {
        color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
        icon: User,
      },
      PANEL: {
        color:
          "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
        icon: User,
      },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {type.replace("_", " ")}
      </Badge>
    );
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) +
        " " +
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      return "N/A";
    }
  };

  const isUpcoming = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) > new Date();
  };

  const totalPages = Math.ceil(totalResults / itemsPerPage);

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
        >
          {i}
        </Button>,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
            Interview Management
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Schedule and track candidate interviews ({totalResults} total)
          </p>
        </div>
        <Button
          className="bg-primary-500 hover:bg-primary-600"
          onClick={() => router.push("/recruitment-portal/interviews/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Filters */}
      <Card className="animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by candidate name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PHONE">Phone</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="IN_PERSON">In Person</SelectItem>
                <SelectItem value="TECHNICAL">Technical</SelectItem>
                <SelectItem value="HR_SCREENING">HR Screening</SelectItem>
                <SelectItem value="PANEL">Panel</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedInterviews.length > 0 && (
        <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {selectedInterviews.length} interview(s) selected
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => handleBulkStatusChange("COMPLETED")}
                  disabled={isBulkUpdating}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isBulkUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Mark Completed
                </Button>
                <Button
                  onClick={() => handleBulkStatusChange("CANCELLED")}
                  disabled={isBulkUpdating}
                  size="sm"
                  variant="destructive"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interviews List */}
      {interviews.length > 0 ? (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4">
              <Checkbox
                checked={
                  selectedInterviews.length === interviews.length &&
                  interviews.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Select All
              </span>
            </div>

            {interviews.map((interview, index) => (
              <Card
                key={interview.id}
                className="animate-fade-in hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${(index + 2) * 50}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedInterviews.includes(interview.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedInterviews((prev) => [
                            ...prev,
                            interview.id,
                          ]);
                        } else {
                          setSelectedInterviews((prev) =>
                            prev.filter((id) => id !== interview.id),
                          );
                        }
                      }}
                    />
                    <div className="h-12 w-12 rounded-full bg-linear-to-r from-primary-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {interview.candidate.firstName[0]}
                      {interview.candidate.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                          {interview.candidate.firstName}{" "}
                          {interview.candidate.lastName}
                        </h3>
                        {getStatusBadge(interview.status)}
                        {isUpcoming(interview.scheduledAt) && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Upcoming
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                        Position: {interview.job.title}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {interview.candidate.email}
                          </span>
                        </div>

                        {interview.candidate.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span>{interview.candidate.phone}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatDateTime(interview.scheduledAt)}</span>
                        </div>

                        {interview.location &&
                          interview.type === "IN_PERSON" && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span>{interview.location}</span>
                            </div>
                          )}

                        {interview.interviewerName && (
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              Interviewer: {interview.interviewerName}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          {getInterviewTypeBadge(interview.type)}
                        </div>
                      </div>

                      {interview.notes && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                          Notes: {interview.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/recruitment-portal/interviews/detail?id=${interview.id}`,
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {isUpcoming(interview.scheduledAt) &&
                        interview.status === "SCHEDULED" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSendReminder(interview.id)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Remind
                          </Button>
                        )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          router.push(
                            `/recruitment-portal/interviews/edit?id=${interview.id}`,
                          )
                        }
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setDeleteId(interview.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                        Delete
                      </Button>
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
            <Calendar className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
            <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
              No Interviews Found
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                ? "No interviews match your filters"
                : "No interviews scheduled yet"}
            </p>
            {(searchQuery ||
              statusFilter !== "all" ||
              typeFilter !== "all") && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setCurrentPage(1);
                  fetchInterviews();
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

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
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteId(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteInterview}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
