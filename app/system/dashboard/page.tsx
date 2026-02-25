"use client";

import { useState } from "react";
import {
  Activity,
  Users,
  Shield,
  TrendingUp,
  CheckCircle,
  Database,
  Server,
  Cpu,
  HardDrive,
  Globe,
  Briefcase,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalAuditLogs: number;
  recentActivity: number;
  systemHealth: "healthy" | "warning" | "critical";
  uptime: string;
}

interface ModuleStats {
  module: string;
  activities: number;
  users: number;
  trend: "up" | "down";
  change: number;
}

export default function SystemDashboardPage() {
  const [stats] = useState<SystemStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalAuditLogs: 45632,
    recentActivity: 1893,
    systemHealth: "healthy",
    uptime: "99.98%",
  });

  const [moduleStats] = useState<ModuleStats[]>([
    {
      module: "Website CMS",
      activities: 12543,
      users: 234,
      trend: "up",
      change: 12.5,
    },
    {
      module: "Recruitment",
      activities: 8932,
      users: 456,
      trend: "up",
      change: 8.3,
    },
    {
      module: "System",
      activities: 2341,
      users: 12,
      trend: "down",
      change: -2.1,
    },
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      user: "John Doe",
      action: "Created new job posting",
      module: "Recruitment",
      time: "2 minutes ago",
      icon: Briefcase,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Updated service page",
      module: "Website CMS",
      time: "5 minutes ago",
      icon: Globe,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: 3,
      user: "Admin User",
      action: "Changed user permissions",
      module: "System",
      time: "12 minutes ago",
      icon: Shield,
      color: "text-primary-500",
      bgColor: "bg-primary-50 dark:bg-primary-900/20",
    },
    {
      id: 4,
      user: "Sarah Johnson",
      action: "Approved application",
      module: "Recruitment",
      time: "18 minutes ago",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ]);

  const [systemMetrics] = useState([
    {
      label: "CPU Usage",
      value: 42,
      max: 100,
      color: "bg-blue-500",
      icon: Cpu,
    },
    {
      label: "Memory",
      value: 68,
      max: 100,
      color: "bg-green-500",
      icon: HardDrive,
    },
    {
      label: "Storage",
      value: 54,
      max: 100,
      color: "bg-yellow-500",
      icon: Database,
    },
    {
      label: "Network",
      value: 23,
      max: 100,
      color: "bg-primary-500",
      icon: Server,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* System Health Banner */}
      <div className="bg-linear-to-r from-primary-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">System Overview</h2>
              <p className="text-white-600 dark:text-neutral-400 mt-1">
                Monitor platform health and activity across all modules
              </p>
              <p className="text-green-100 mt-1">
                All services operational • Uptime: {stats.uptime}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-100">Last checked</div>
            <div className="text-lg font-semibold">Just now</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              <ArrowUp className="w-4 h-4" />
              12%
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Total Users
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            {stats.activeUsers} active today
          </div>
        </div>

        <div className="bg-linear-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-500 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400">
              <ArrowUp className="w-4 h-4" />
              8%
            </div>
          </div>
          <div className="text-3xl font-bold text-primary-900 dark:text-primary-100">
            {stats.recentActivity.toLocaleString()}
          </div>
          <div className="text-sm text-primary-700 dark:text-primary-300 mt-1">
            Activities (24h)
          </div>
          <div className="text-xs text-primary-600 dark:text-primary-400 mt-2">
            Across all modules
          </div>
        </div>

        <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-orange-600 dark:text-orange-400">
              <ArrowUp className="w-4 h-4" />
              15%
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
            {stats.totalAuditLogs.toLocaleString()}
          </div>
          <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">
            Audit Logs
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-2">
            Complete activity trail
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
              <ArrowUp className="w-4 h-4" />
              22%
            </div>
          </div>
          <div className="text-3xl font-bold text-green-900 dark:text-green-100">
            {stats.uptime}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 mt-1">
            System Uptime
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-2">
            Last 30 days
          </div>
        </div>
      </div>

      {/* Module Performance & System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Performance */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Module Performance
            </h3>
            <Link
              href="/system/audit-logs"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              View Details →
            </Link>
          </div>
          <div className="space-y-4">
            {moduleStats.map((module) => (
              <div
                key={module.module}
                className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {module.module}
                  </span>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      module.trend === "up"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {module.trend === "up" ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {Math.abs(module.change)}%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {module.activities.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Activities
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {module.users}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Active Users
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              System Resources
            </h3>
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Healthy
            </div>
          </div>
          <div className="space-y-4">
            {systemMetrics.map((metric) => {
              const Icon = metric.icon;
              const percentage = (metric.value / metric.max) * 100;
              return (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {metric.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      {metric.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${metric.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            Recent Activity
          </h3>
          <Link
            href="/system/audit-logs"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors"
              >
                <div className={`p-3 ${activity.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-neutral-900 dark:text-white">
                    {activity.user}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {activity.action}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-500 dark:text-neutral-500">
                    {activity.module}
                  </div>
                  <div className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
                    {activity.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/system/users"
          className="group p-6 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl text-white hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Users className="w-8 h-8 mb-3" />
          <h4 className="text-lg font-bold mb-1">Manage Users</h4>
          <p className="text-sm text-blue-100">
            View and manage all system users
          </p>
        </Link>

        <Link
          href="/system/audit-logs"
          className="group p-6 bg-linear-to-br from-primary-500 to-primary-600 rounded-2xl text-white hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Activity className="w-8 h-8 mb-3" />
          <h4 className="text-lg font-bold mb-1">Audit Logs</h4>
          <p className="text-sm text-primary-100">Track all system activities</p>
        </Link>

        <Link
          href="/system/settings"
          className="group p-6 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl text-white hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Shield className="w-8 h-8 mb-3" />
          <h4 className="text-lg font-bold mb-1">System Settings</h4>
          <p className="text-sm text-orange-100">Configure platform settings</p>
        </Link>
      </div>
    </div>
  );
}
