"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { shortlistService } from "@/services/recruitment-services";
import type {
  ShortlistJob,
} from "@/types";
import { Card, CardContent } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { Input } from "@/components/careers/ui/input";
import { toast } from "sonner";
import {
  Search,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Settings,
  BarChart3,
  FileSpreadsheet,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUtils";

export default function ShortlistPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<ShortlistJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    fetchJobs();
  }, [user, router]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await shortlistService.getJobs();
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    totalJobs: jobs.length,
    withShortlists: jobs.filter((j) => j.shortlistCount > 0).length,
    configured: jobs.filter((j) => j.criteriaConfigured).length,
    totalApplications: jobs.reduce((sum, j) => sum + j.applicationCount, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
          Shortlist Management
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          Configure criteria and generate intelligent candidate shortlists
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  Total Jobs
                </p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.totalJobs}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  With Shortlists
                </p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.withShortlists}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  Configured
                </p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.configured}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  Applications
                </p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.totalApplications}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="animate-fade-in shadow-card">
        <CardContent className="pt-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search jobs by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-3 sm:gap-4">
          {filteredJobs.map((job, index) => (
            <Card
              key={job.id}
              className="animate-fade-in hover:shadow-lg transition-all duration-300 shadow-card"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      {job.companyLogo ? (
                        <img
                          src={normalizeImageUrl(job.companyLogo)}
                          alt={job.companyName}
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-linear-to-br from-primary-500 to-orange-500 flex items-center justify-center shrink-0">
                          <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-1 wrap-break-word">
                          {job.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate">
                          {job.companyName}
                        </p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {job.applicationCount} applications
                        </span>
                      </div>

                      {job.shortlistCount > 0 && (
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                          <span className="text-green-700 dark:text-green-400 font-medium">
                            {job.shortlistCount} shortlisted
                          </span>
                        </div>
                      )}

                      {job.criteriaConfigured ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Criteria Set
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-amber-700 dark:text-amber-400 border-amber-300 text-xs"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          No Criteria
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:shrink-0 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/recruitment-portal/shortlist/criteria?jobId=${job.id}`,
                        )
                      }
                      className="w-full sm:w-auto"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>

                    {job.shortlistCount > 0 ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/recruitment-portal/shortlist/results?jobId=${job.id}`,
                            )
                          }
                          className="w-full sm:w-auto"
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View Results
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await shortlistService.exportExcel(job.id);
                              toast.success("Excel exported successfully");
                            } catch (error: any) {
                              toast.error("Failed to export");
                            }
                          }}
                          className="w-full sm:w-auto"
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-primary-600 hover:bg-primary-700 w-full sm:w-auto"
                        onClick={() =>
                          router.push(
                            `/recruitment-portal/shortlist/criteria?jobId=${job.id}`,
                          )
                        }
                      >
                        Get Started
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 sm:py-16 text-center">
            <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
              {searchQuery ? "No matching jobs" : "No jobs with applications"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-4 px-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Jobs with applications will appear here"}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
