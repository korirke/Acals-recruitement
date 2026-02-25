"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { jobsService } from "@/services/recruitment-services";
import { useJobFilters } from "@/hooks/useJobFilters";
import { useError } from "@/context/ErrorContext";
import { useAuth } from "@/context/AuthContext";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";
import { checkCandidateProfileCompletion } from "@/lib/profileCompletion";
import JobCard from "@/components/careers/JobCard";
import ProfileCompletionBanner from "@/components/careers/ProfileCompletionBanner";
import { Input } from "@/components/careers/ui/input";
import { Button } from "@/components/careers/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { Card } from "@/components/careers/ui/card";
import { Search, SlidersHorizontal, Briefcase, Loader2 } from "lucide-react";
import type { Job, JobCategory } from "@/types";
import { JOB_TYPE_LABELS, EXPERIENCE_LEVEL_LABELS } from "@/types";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";

function JobsPageContent() {
  const searchParams = useSearchParams();
  const { logError, showToast } = useError();
  const { user, isAuthenticated } = useAuth();
  const { profile: candidateProfile, loading: profileLoading } =
    useCandidateProfile();
  const { filters, updateFilter, resetFilters, setPage } = useJobFilters({
    query: searchParams.get("query") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") as any,
    experienceLevel: searchParams.get("experienceLevel") as any,
    categoryId: searchParams.get("categoryId") || "",
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Check profile completion status
  const profileStatus = checkCandidateProfileCompletion(candidateProfile);

  // Show banner only if: authenticated, is candidate, profile not complete, not dismissed, profile loaded
  const shouldShowBanner =
    isAuthenticated &&
    user?.role === "CANDIDATE" &&
    !profileLoading &&
    candidateProfile !== null &&
    !profileStatus.isComplete &&
    !bannerDismissed;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  useEffect(() => {
    const dismissed = localStorage.getItem("profileBannerDismissed");
    if (dismissed === "true") {
      setBannerDismissed(true);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await jobsService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      logError(error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsService.searchJobs(filters);

      if (response.success && response.data) {
        setJobs(response.data.jobs);
        setPagination((prev) => ({
          ...prev,
          ...(response.data?.pagination || {}),
        }));
      }
    } catch (error: any) {
      logError(error);
      showToast(error.message || "Failed to fetch jobs", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchJobs();
  };

  const handleClearFilters = () => {
    resetFilters();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem("profileBannerDismissed", "true");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-500 to-orange-500 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="font-bold text-white text-4xl md:text-5xl">
              Find Your Next Opportunity
            </h1>
            <p className="text-white/90 text-lg">
              Discover {pagination.total} job openings from top companies
            </p>

            <Card className="p-3 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={filters.query}
                    onChange={(e) => updateFilter("query", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 border-0 focus-visible:ring-0 dark:bg-neutral-800"
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden border-neutral-200 dark:border-neutral-700"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>

                <Button
                  onClick={handleSearch}
                  className="bg-orange-500 hover:bg-orange-600 text-white hidden md:flex"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div
            className={`grid gap-3 ${
              showFilters ? "grid-cols-1" : "hidden"
            } md:grid md:grid-cols-5`}
          >
            {/* Location */}
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
            />

            {/* Job Type */}
            <Select
              value={filters.type || "ALL_TYPES"}
              onValueChange={(value) =>
                updateFilter("type", value === "ALL_TYPES" ? undefined : value)
              }
            >
              <SelectTrigger className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <SelectItem value="ALL_TYPES">All Types</SelectItem>
                {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Experience Level */}
            <Select
              value={filters.experienceLevel || "ALL_LEVELS"}
              onValueChange={(value) =>
                updateFilter(
                  "experienceLevel",
                  value === "ALL_LEVELS" ? undefined : value
                )
              }
            >
              <SelectTrigger className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
                {Object.entries(EXPERIENCE_LEVEL_LABELS).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {/* Category */}
            <Select
              value={filters.categoryId || "ALL_CATEGORIES"}
              onValueChange={(value) =>
                updateFilter(
                  "categoryId",
                  value === "ALL_CATEGORIES" ? undefined : value
                )
              }
            >
              <SelectTrigger className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <SelectItem value="ALL_CATEGORIES">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="flex-1 py-8 bg-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Profile Completion Banner */}
          {shouldShowBanner && (
            <ProfileCompletionBanner
              status={profileStatus}
              onDismiss={handleDismissBanner}
            />
          )}

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold text-neutral-900 dark:text-white">
                {pagination.total}
              </span>{" "}
              jobs found
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <JobCard {...job} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    variant="outline"
                    className="border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    variant="outline"
                    className="border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <Briefcase className="h-16 w-16 mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">
                No jobs found
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="border-neutral-200 dark:border-neutral-700"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
