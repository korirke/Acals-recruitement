"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiClient";
import { Card, CardContent } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { Badge } from "@/components/careers/ui/badge";
import {
  Loader2,
  Search,
  Users,
  UserCheck,
  FileText,
  TrendingUp,
  Eye,
  Filter,
  MapPin,
  Briefcase,
  Download,
  ChevronDown,
} from "lucide-react";

interface Candidate {
  id: string;
  userId: string;
  title: string;
  location: string;
  phone: string | null;
  experienceYears: string;
  openToWork: boolean;
  resumeUrl: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    createdAt: string;
  };
  skills: any[];
  domains: any[];
  _count: {
    educations: number;
    experiences: number;
    certifications: number;
  };
}

export default function AdminCandidatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [openToWorkFilter, setOpenToWorkFilter] = useState<string>("all");
  const [hasResumeFilter, setHasResumeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/candidates");
      return;
    }
    if (!["SUPER_ADMIN", "HR_MANAGER", "MODERATOR", "EMPLOYER"].includes(user.role)) {
      router.push("/");
      return;
    }
    fetchStats();
    fetchCandidates();
  }, [user, currentPage, openToWorkFilter, hasResumeFilter]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/candidates/stats");
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (locationFilter.trim()) params.location = locationFilter.trim();
      if (openToWorkFilter !== "all") params.openToWork = openToWorkFilter === "true";
      if (hasResumeFilter !== "all") params.hasResume = hasResumeFilter === "true";

      const response = await api.get("/admin/candidates", { params });
      if (response.success) {
        setCandidates(response.data.candidates);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCandidates();
  };

  const handleExport = async () => {
    try {
      const params: any = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (locationFilter.trim()) params.location = locationFilter.trim();
      if (openToWorkFilter !== "all") params.openToWork = openToWorkFilter === "true";
      if (hasResumeFilter !== "all") params.hasResume = hasResumeFilter === "true";

      const response = await api.get("/admin/candidates", {
        params: { ...params, limit: 100 },
      });
      if (response.success && response.data.candidates) {
        const csvData = response.data.candidates.map((c: Candidate) => ({
          Name: `${c.user.firstName} ${c.user.lastName}`,
          Email: c.user.email,
          Phone: c.phone || c.user.phone || "N/A",
          Title: c.title || "N/A",
          Location: c.location || "N/A",
          Experience: c.experienceYears || "N/A",
          "Open to Work": c.openToWork ? "Yes" : "No",
          "Has Resume": c.resumeUrl ? "Yes" : "No",
          Skills: c.skills.map((s) => s.skill.name).join(", "),
          Domains: c.domains.map((d) => d.domain.name).join(", "),
        }));

        const csv = [
          Object.keys(csvData[0]).join(","),
          ...csvData.map((row: { [s: string]: unknown } | ArrayLike<unknown>) =>
            Object.values(row)
              .map((v) => `"${v}"`)
              .join(",")
          ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `candidates-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Candidates Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            View and manage all candidate profiles
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="w-full sm:w-auto">
          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {stats && (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-fade-in"
          style={{ animationDelay: "50ms" }}
        >
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-1 break-all">
                    {stats.overview.totalCandidates}
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    Total Candidates
                  </p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500 shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300 mb-1 break-all">
                    {stats.overview.activeCandidates}
                  </p>
                  <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 truncate">
                    Active (30 days)
                  </p>
                </div>
                <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1 break-all">
                    {stats.overview.candidatesWithResume}
                  </p>
                  <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 truncate">
                    With Resume
                  </p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-300 mb-1 break-all">
                    {stats.overview.candidatesOpenToWork}
                  </p>
                  <p className="text-[10px] sm:text-xs text-orange-600 dark:text-orange-400 truncate">
                    Open to Work
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400 shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CardContent className="p-4 sm:p-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full lg:hidden mb-4"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">Filters</span>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-neutral-600 dark:text-neutral-400 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className={`space-y-3 sm:space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-neutral-400" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-8 sm:pl-10 text-xs sm:text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
                />
              </div>
              <Input
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="text-xs sm:text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
              />
              <Select value={openToWorkFilter} onValueChange={setOpenToWorkFilter}>
                <SelectTrigger className="text-xs sm:text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700">
                  <SelectValue placeholder="Open to Work" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Open to Work</SelectItem>
                  <SelectItem value="false">Not Open</SelectItem>
                </SelectContent>
              </Select>
              <Select value={hasResumeFilter} onValueChange={setHasResumeFilter}>
                <SelectTrigger className="text-xs sm:text-sm bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700">
                  <SelectValue placeholder="Resume Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">With Resume</SelectItem>
                  <SelectItem value="false">No Resume</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSearch}
                size="sm"
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : candidates.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {candidates.map((candidate, index) => (
            <Card
              key={candidate.id}
              className="animate-fade-in hover:shadow-lg transition-all duration-300 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              style={{ animationDelay: `${(index + 2) * 50}ms` }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className="flex gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                    <div className="shrink-0">
                      {candidate.user.avatar ? (
                        <img
                          src={candidate.user.avatar}
                          alt={`${candidate.user.firstName} ${candidate.user.lastName}`}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-r from-primary-500 to-orange-500 flex items-center justify-center text-white font-bold text-base sm:text-xl">
                          {candidate.user.firstName[0]}
                          {candidate.user.lastName[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
                          {candidate.user.firstName} {candidate.user.lastName}
                        </h3>
                        {candidate.openToWork && (
                          <Badge className="bg-green-500 text-white text-[10px] sm:text-xs">
                            Open to Work
                          </Badge>
                        )}
                        {candidate.resumeUrl && (
                          <Badge
                            variant="outline"
                            className="border-blue-500 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs"
                          >
                            <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                            Resume
                          </Badge>
                        )}
                      </div>
                      {candidate.title && (
                        <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium mb-1 truncate">
                          {candidate.title}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                        <span className="truncate max-w-[200px]">{candidate.user.email}</span>
                        {(candidate.phone || candidate.user.phone) && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate">
                              {candidate.phone || candidate.user.phone}
                            </span>
                          </>
                        )}
                        {candidate.location && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
                              {candidate.location}
                            </span>
                          </>
                        )}
                        {candidate.experienceYears && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1 truncate">
                              <Briefcase className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
                              {candidate.experienceYears}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {candidate.skills.slice(0, 5).map((cs: any) => (
                          <Badge key={cs.id} variant="outline" className="text-[10px] sm:text-xs">
                            {cs.skill.name}
                          </Badge>
                        ))}
                        {candidate.skills.length > 5 && (
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            +{candidate.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto shrink-0">
                    <Link href={`/recruitment-portal/candidates/detail?id=${candidate.id}`}>
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <CardContent className="py-12 sm:py-16 text-center">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No Candidates Found
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Try adjusting your filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setLocationFilter("");
                setOpenToWorkFilter("all");
                setHasResumeFilter("all");
                setCurrentPage(1);
                fetchCandidates();
              }}
              variant="outline"
              size="sm"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
