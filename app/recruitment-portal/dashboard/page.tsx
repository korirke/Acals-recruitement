"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCompanies } from "@/hooks/useCompanies";
import {
  jobsService,
  recruitmentAdminService,
} from "@/services/recruitment-services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import StatCard from "@/components/careers/StatCard";
import Link from "next/link";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Eye,
  Loader2,
  Building2,
  Edit,
} from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUtils";

export default function RecruitmentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { myCompany, companyStats, fetchMyCompany, fetchMyCompanyStats } =
    useCompanies();
  const [adminStats, setAdminStats] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user?.role === "EMPLOYER") {
        await Promise.all([fetchMyCompany(), fetchMyCompanyStats()]);
        const jobsResponse = await jobsService.getMyJobs();
        if (jobsResponse.success && jobsResponse.data) {
          setRecentJobs(jobsResponse.data.slice(0, 5));
        }
      } else {
        const statsResponse = await recruitmentAdminService.getDashboardStats();
        if (statsResponse.success && statsResponse.data) {
          setAdminStats(statsResponse.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const stats = user?.role === "EMPLOYER" ? companyStats : adminStats;

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            {user?.role === "EMPLOYER"
              ? "Company Dashboard"
              : "Recruitment Dashboard"}
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-1">
            {user?.role === "EMPLOYER"
              ? `Welcome back, ${myCompany?.name || "Employer"}`
              : "Overview of recruitment activities"}
          </p>
        </div>
        {user?.role === "EMPLOYER" && (
          <Button
            asChild
            className="bg-primary-500 hover:bg-primary-600 w-full sm:w-auto"
          >
            <Link href="/recruitment-portal/jobs/new">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        )}
      </div>

      {/* Company Info Card (EMPLOYER ONLY) */}
      {user?.role === "EMPLOYER" && myCompany && (
        <Card className="border-2 border-primary-200 dark:border-primary-800">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                {myCompany.logo ? (
                  <img
                    src={normalizeImageUrl(myCompany.logo)}
                    alt={myCompany.name}
                    className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-linear-to-r from-primary-500 to-orange-500 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {myCompany.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {myCompany.industry}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {myCompany.companySize}
                    </Badge>
                    {myCompany.verified && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                    {myCompany.location}
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full sm:w-auto shrink-0"
              >
                <Link href="/recruitment-portal/company/edit">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {user?.role === "EMPLOYER" ? (
          <>
            <StatCard
              title="Active Jobs"
              value={stats.activeJobs?.toString() || "0"}
              icon={Briefcase}
              change="+2 this month"
              changeType="positive"
              iconColor="text-blue-600"
              delay={0}
            />
            <StatCard
              title="Total Jobs"
              value={stats.totalJobs?.toString() || "0"}
              icon={Briefcase}
              iconColor="text-neutral-600"
              delay={50}
            />
            <StatCard
              title="Total Applications"
              value={stats.totalApplications?.toString() || "0"}
              icon={FileText}
              change="+15% this week"
              changeType="positive"
              iconColor="text-green-600"
              delay={100}
            />
            <StatCard
              title="Active Candidates"
              value={(stats.recentApplications?.length || 0).toString()}
              icon={Users}
              iconColor="text-purple-600"
              delay={150}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Active Jobs"
              value={stats.activeJobs?.toString() || "0"}
              icon={Briefcase}
              change="+12% from last month"
              changeType="positive"
              iconColor="text-blue-600"
              delay={0}
            />
            <StatCard
              title="Total Applications"
              value={stats.totalApplications?.toString() || "0"}
              icon={FileText}
              change="+8% this week"
              changeType="positive"
              iconColor="text-green-600"
              delay={50}
            />
            <StatCard
              title="Candidates"
              value={stats.registeredCandidates?.toString() || "0"}
              icon={Users}
              change="+5 new this week"
              changeType="positive"
              iconColor="text-purple-600"
              delay={100}
            />
            <StatCard
              title="Pending Moderation"
              value={stats.pendingModeration?.toString() || "0"}
              icon={TrendingUp}
              iconColor="text-orange-600"
              delay={150}
            />
          </>
        )}
      </div>

      {/* Recent Jobs & Applications (EMPLOYER) */}
      {user?.role === "EMPLOYER" && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Recent Jobs */}
          {recentJobs.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
                    Recent Jobs
                  </CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/recruitment-portal/jobs">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between gap-3 p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-100 truncate">
                          {job.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                          {job._count?.applications || 0} applications •{" "}
                          {job.status}
                        </p>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                      >
                        <Link
                          href={`/recruitment-portal/applications?jobId=${job.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Applications */}
          {stats.recentApplications && stats.recentApplications.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg text-neutral-900 dark:text-neutral-100">
                    Recent Applications
                  </CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/recruitment-portal/applications">
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentApplications
                    .slice(0, 5)
                    .map((application: any) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between gap-3 p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {application.candidate.avatar ? (
                            <img
                              src={application.candidate.avatar}
                              alt={`${application.candidate.firstName} ${application.candidate.lastName}`}
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center shrink-0">
                              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-100 truncate">
                              {application.candidate.firstName}{" "}
                              {application.candidate.lastName}
                            </h4>
                            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">
                              {application.job.title} •{" "}
                              {new Date(
                                application.appliedAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className="shrink-0 text-xs">
                          {application.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Admin Quick Actions */}
      {user?.role !== "EMPLOYER" && (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-4 sm:pt-6">
              <Link href="/recruitment-portal/companies" className="block">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                      Manage Companies
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      View and verify companies
                    </p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-4 sm:pt-6">
              <Link href="/recruitment-portal/jobs" className="block">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                      Manage Jobs
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      Review and moderate jobs
                    </p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer sm:col-span-2 lg:col-span-1">
            <CardContent className="pt-4 sm:pt-6">
              <Link href="/recruitment-portal/users" className="block">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                      Manage Users
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      User management
                    </p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
