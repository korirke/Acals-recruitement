"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { recruitmentAdminService } from "@/services/recruitment-services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/careers/ui/tabs";
import StatCard from "@/components/careers/StatCard";
import {
  BarChart3,
  DollarSign,
  Target,
  Activity,
  Calendar,
  Loader2,
  FileDown,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/careers/ui/use-toast";

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  registeredCandidates: number;
  activeEmployers: number;
  pendingModeration: number;
  avgTimeToHire: number;
  successRate: number;
  trends?: {
    jobs: number;
    applications: number;
  };
}

export interface TopPerformers {
  topJobs: Array<{
    id: string;
    title: string;
    applicationCount: number;
    views: number;
    company: {
      name: string;
      logo?: string;
    };
  }>;
  topEmployers: Array<{
    id: string;
    name: string;
    logo?: string;
    _count: {
      jobs: number;
    };
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    jobCount: number;
  }>;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformers | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("last_30_days");

  useEffect(() => {
    if (
      !user ||
      !["HR_MANAGER", "MODERATOR", "SUPER_ADMIN"].includes(user.role)
    ) {
      router.push("/recruitment-portal/dashboard");
      return;
    }
    fetchAnalytics();
  }, [user, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, performersRes] = await Promise.all([
        recruitmentAdminService.getDashboardStats(period),
        recruitmentAdminService.getTopPerformers(),
      ]);

      if (statsRes.success) setStats(statsRes.data ?? null);
      if (performersRes.success) setTopPerformers(performersRes.data ?? null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const response =
        await recruitmentAdminService.exportAnalyticsReport(period);
      if (response.success && response.data) {
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `analytics-report-${new Date().toISOString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Report Downloaded",
          description: "Your analytics report has been downloaded successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: "$124,500",
      icon: DollarSign,
      change: "+12.5% from last month",
      changeType: "positive" as const,
      iconColor: "text-green-600",
    },
    {
      title: "Job Views",
      value: "45,231",
      icon: Activity,
      change: "+8.2% from last week",
      changeType: "positive" as const,
      iconColor: "text-blue-600",
    },
    {
      title: "Application Rate",
      value: `${stats.successRate}%`,
      icon: Target,
      change: "+2.1% improvement",
      changeType: "positive" as const,
      iconColor: "text-purple-600",
    },
    {
      title: "Avg. Response Time",
      value: `${stats.avgTimeToHire} days`,
      icon: Calendar,
      change: "-3 days improved",
      changeType: "positive" as const,
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Analytics & Insights
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-1">
            Track performance metrics and trends
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="this_year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleExportReport}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <FileDown className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 50} />
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="text-xs sm:text-sm">
            Jobs
          </TabsTrigger>
          <TabsTrigger value="applications" className="text-xs sm:text-sm">
            Applications
          </TabsTrigger>
          <TabsTrigger value="candidates" className="text-xs sm:text-sm">
            Candidates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Top Performing Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Top Performing Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topPerformers?.topJobs && topPerformers.topJobs.length > 0 ? (
                  <div className="space-y-3">
                    {topPerformers.topJobs.map((job, index) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="text-xl sm:text-2xl font-bold text-neutral-300 shrink-0">
                            #{index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs sm:text-sm text-foreground truncate">
                              {job.title}
                            </p>
                            <p className="text-[10px] sm:text-xs text-neutral-500 truncate">
                              {job.company.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs sm:text-sm font-semibold text-green-600">
                            {job.applicationCount}
                          </p>
                          <p className="text-[10px] sm:text-xs text-neutral-500">
                            applications
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-neutral-500 py-8 text-sm">
                    No data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Top Employers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  Top Employers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topPerformers?.topEmployers &&
                topPerformers.topEmployers.length > 0 ? (
                  <div className="space-y-3">
                    {topPerformers.topEmployers.map((employer, index) => (
                      <div
                        key={employer.id}
                        className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span className="text-xl sm:text-2xl font-bold text-neutral-300 shrink-0">
                            #{index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs sm:text-sm text-foreground truncate">
                              {employer.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-neutral-500">
                              {employer._count.jobs} active jobs
                            </p>
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="shrink-0"
                        >
                          <Link
                            href={`/recruitment-portal/employers/${employer.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-neutral-500 py-8 text-sm">
                    No data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] flex items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div className="text-center text-neutral-500">
                  <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-xs sm:text-sm">
                    Chart visualization (integrate Chart.js or Recharts)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Job Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[400px] flex items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div className="text-center text-neutral-500">
                  <p className="text-xs sm:text-sm">
                    Job-specific analytics charts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Application Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[400px] flex items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div className="text-center text-neutral-500">
                  <p className="text-xs sm:text-sm">Application flow charts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Candidate Growth Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[400px] flex items-center justify-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div className="text-center text-neutral-500">
                  <p className="text-xs sm:text-sm">
                    Candidate registration trends
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
