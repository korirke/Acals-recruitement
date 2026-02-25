"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/hooks/useJobs";
import { useError } from "@/context/ErrorContext";
import { Card, CardContent, CardHeader } from "@/components/careers/ui/card";
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
import { useToast } from "@/components/careers/ui/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  MoreVertical,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Archive,
  Briefcase,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/careers/ui/dropdown-menu";
import { JOB_STATUS_LABELS } from "@/types";
import type { Job } from "@/types";

export default function AdminJobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { logError, showToast } = useError();
  const {
    jobs: jobsList,
    categories,
    loading,
    fetchMyJobs,
    deleteJob,
    changeStatus,
  } = useJobs();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/recruitment-portal/jobs");
      return;
    }
    loadJobs();
    loadCategories();
  }, [user]);

  useEffect(() => {
    filterJobs();
  }, [jobsList, searchQuery, statusFilter, categoryFilter]);

  const loadJobs = async () => {
    try {
      await fetchMyJobs();
    } catch (error: any) {
      logError(error);
      showToast(error.message || "Failed to fetch jobs", "error");
    }
  };

  const loadCategories = async () => {
    // Categories loaded via useJobs hook
  };

  const filterJobs = () => {
    let filtered = [...jobsList];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.name.toLowerCase().includes(query),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((job) => job.categoryId === categoryFilter);
    }

    setJobs(filtered);

    // Calculate stats
    const statsCounts: Record<string, number> = {};
    jobsList.forEach((job) => {
      statsCounts[job.status] = (statsCounts[job.status] || 0) + 1;
    });
    setStats(statsCounts);
  };

  const handleDelete = async (jobId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this job? This action cannot be undone.",
      )
    ) {
      return;
    }

    const success = await deleteJob(jobId);
    if (success) {
      loadJobs();
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    const success = await changeStatus(jobId, newStatus as any);
    if (success) {
      loadJobs();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; icon: any; label: string }
    > = {
      DRAFT: { color: "bg-gray-500", icon: Clock, label: "Draft" },
      PENDING: { color: "bg-yellow-500", icon: Clock, label: "Pending" },
      ACTIVE: { color: "bg-green-500", icon: CheckCircle, label: "Active" },
      CLOSED: { color: "bg-red-500", icon: XCircle, label: "Closed" },
      ARCHIVED: { color: "bg-gray-600", icon: Archive, label: "Archived" },
      REJECTED: { color: "bg-red-600", icon: XCircle, label: "Rejected" },
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white shrink-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatSalary = (job: Job) => {
    if (job.salaryType === "RANGE" && job.salaryMin && job.salaryMax) {
      return `${(job.salaryMin / 1000).toFixed(0)}k - ${(
        job.salaryMax / 1000
      ).toFixed(0)}k`;
    } else if (job.salaryType === "SPECIFIC" && job.specificSalary) {
      return `${(job.specificSalary / 1000).toFixed(0)}k`;
    } else if (job.salaryType === "NEGOTIABLE") {
      return "Negotiable";
    }
    return "Competitive";
  };

  const getTotalJobs = () => Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent wrap-break-word">
            Job Listings
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
            {user?.role === "EMPLOYER"
              ? "Manage your company's job postings"
              : "Manage all job postings across the platform"}
          </p>
        </div>
        <Button
          asChild
          className="bg-primary-500 hover:bg-primary-600 w-full sm:w-auto shrink-0"
        >
          <Link href="/recruitment-portal/jobs/new">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <Card className="bg-white dark:bg-neutral-800">
          <CardContent className="pt-4 sm:pt-6">
            <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {getTotalJobs()}
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Total Jobs
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-4 sm:pt-6">
            <p className="text-xl sm:text-2xl font-bold text-gray-600">
              {stats.DRAFT || 0}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">
              Draft
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-4 sm:pt-6">
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">
              {stats.PENDING || 0}
            </p>
            <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400">
              Pending
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-4 sm:pt-6">
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {stats.ACTIVE || 0}
            </p>
            <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">
              Active
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-4 sm:pt-6">
            <p className="text-xl sm:text-2xl font-bold text-red-600">
              {stats.CLOSED || 0}
            </p>
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">
              Closed
            </p>
          </CardContent>
        </Card>
        <Card className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700">
          <CardContent className="pt-4 sm:pt-6">
            <p className="text-xl sm:text-2xl font-bold text-neutral-600 dark:text-neutral-400">
              {stats.ARCHIVED || 0}
            </p>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-400">
              Archived
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by job title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(JOB_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Title and Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 wrap-break-word">
                        {job.title}
                      </h3>
                      {getStatusBadge(job.status)}
                      {job.featured && (
                        <Badge className="bg-purple-500 text-white shrink-0">
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Company Info */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-2 sm:mb-3">
                      <span className="font-medium wrap-break-word">
                        {job.company.name}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="wrap-break-word">{job.location}</span>
                      {job.isRemote && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            Remote
                          </Badge>
                        </>
                      )}
                    </div>

                    {/* Job Meta Badges */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {job.category.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {job.type.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {job.experienceLevel.replace("_", " ")}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shrink-0 text-xs">
                        {formatSalary(job)}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/careers-portal/jobs/${job.id}`}
                          target="_blank"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Public Page
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/recruitment-portal/jobs/edit?id=${job.id}`}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Job
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {job.status === "DRAFT" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(job.id, "PENDING")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit for Approval
                        </DropdownMenuItem>
                      )}
                      {job.status === "ACTIVE" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(job.id, "CLOSED")}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Close Job
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(job.id, "ARCHIVED")
                            }
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive Job
                          </DropdownMenuItem>
                        </>
                      )}
                      {job.status === "CLOSED" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(job.id, "ACTIVE")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Reopen Job
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Stats and Actions */}
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Job Stats */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="whitespace-nowrap">
                      {job.applicationCount} applications
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="whitespace-nowrap">{job.views} views</span>
                    {job.postedBy && (
                      <>
                        <span className="hidden md:inline">•</span>
                        <span className="wrap-break-word">
                          Posted by {job.postedBy.firstName}{" "}
                          {job.postedBy.lastName}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Link href={`/recruitment-portal/jobs/edit?id=${job.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Link
                        href={`/recruitment-portal/jobs/applications?jobId=${job.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">
                          View Applications
                        </span>
                        <span className="sm:hidden">Applications</span> (
                        {job.applicationCount})
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100 px-4">
            No jobs found
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-4 px-4">
            {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by posting your first job"}
          </p>
          <Button asChild className="bg-primary-500 hover:bg-primary-600 mx-4">
            <Link href="/recruitment-portal/jobs/new">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
