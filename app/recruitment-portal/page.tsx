"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
import StatCard from "@/components/careers/StatCard";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Building2,
  Clock,
  Loader2,
  Eye,
} from "lucide-react";
import Link from "next/link";

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

export interface Activity {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export default function RecruitmentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformers | null>(
    null,
  );
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("last_30_days");

  useEffect(() => {
    if (
      !user ||
      !["HR_MANAGER", "MODERATOR", "SUPER_ADMIN"].includes(user.role)
    ) {
      router.push("/careers-portal");
      return;
    }
    fetchDashboardData();
  }, [user, period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, performersRes, activitiesRes] = await Promise.all([
        recruitmentAdminService.getDashboardStats(period),
        recruitmentAdminService.getTopPerformers(),
        recruitmentAdminService.getRecentActivities(10),
      ]);

      if (statsRes.success) setStats(statsRes.data ?? null);
      if (performersRes.success) setTopPerformers(performersRes.data ?? null);
      if (activitiesRes.success) setActivities(activitiesRes.data ?? []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
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
      title: "Total Jobs",
      value: stats.totalJobs.toString(),
      icon: Briefcase,
      change: "+12 this week",
      changeType: "positive" as const,
      iconColor: "text-primary-500",
    },
    {
      title: "Active Applications",
      value: stats.totalApplications.toString(),
      icon: FileText,
      change: "+18% from last month",
      changeType: "positive" as const,
      iconColor: "text-orange-500",
    },
    {
      title: "Registered Candidates",
      value: stats.registeredCandidates.toString(),
      icon: Users,
      change: `+${Math.round(stats.registeredCandidates * 0.05)} this month`,
      changeType: "positive" as const,
      iconColor: "text-primary-500",
    },
    {
      title: "Active Employers",
      value: stats.activeEmployers.toString(),
      icon: Building2,
      change: "+8 this week",
      changeType: "positive" as const,
      iconColor: "text-orange-500",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      change: "+2.3% this quarter",
      changeType: "positive" as const,
      iconColor: "text-green-600",
    },
    {
      title: "Avg. Time to Hire",
      value: `${stats.avgTimeToHire} days`,
      icon: Clock,
      change: "-2 days improved",
      changeType: "positive" as const,
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Welcome back! Here's what's happening with your job portal today.
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_7_days">Last 7 days</SelectItem>
            <SelectItem value="last_30_days">Last 30 days</SelectItem>
            <SelectItem value="last_90_days">Last 90 days</SelectItem>
            <SelectItem value="this_year">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 50} />
        ))}
      </div>

      {/* Moderation Alert */}
      {stats.pendingModeration > 0 && (
        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-orange-900 dark:text-orange-200">
                    {stats.pendingModeration} Jobs Awaiting Approval
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Review pending job postings to keep the platform active
                  </p>
                </div>
              </div>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/recruitment-portal/moderation">
                  <Eye className="h-4 w-4 mr-2" />
                  Review Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Performing Jobs</span>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-primary-500"
              >
                <Link href="/recruitment-portal/analytics">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPerformers?.topJobs && topPerformers.topJobs.length > 0 ? (
              <div className="space-y-3">
                {topPerformers.topJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl font-bold text-neutral-300">
                        #{index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">
                          {job.title}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {job.company.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-600">
                        {job.applicationCount}
                      </p>
                      <p className="text-xs text-neutral-500">applications</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500 py-8">
                No data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {activity.user
                          ? `${activity.user.firstName} ${activity.user.lastName}`
                          : "System"}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500 py-8">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              asChild
              className="h-auto py-4 flex-col gap-2 bg-primary-500 hover:bg-primary-600"
            >
              <Link href="/recruitment-portal/jobs/new">
                <Briefcase className="h-5 w-5" />
                <span>Post New Job</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
            >
              <Link href="/recruitment-portal/candidates">
                <Users className="h-5 w-5" />
                <span>View Candidates</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
            >
              <Link href="/recruitment-portal/employers">
                <Building2 className="h-5 w-5" />
                <span>Manage Employers</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
            >
              <Link href="/recruitment-portal/analytics">
                <TrendingUp className="h-5 w-5" />
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
