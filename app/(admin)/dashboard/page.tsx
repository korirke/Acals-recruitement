"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";

export default function CMSDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = [
    {
      label: "Total Pages",
      value: "24",
      change: "+3",
      trend: "up",
      icon: FileText,
      color: "blue",
      href: "/pages",
    },
    {
      label: "Services",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Briefcase,
      color: "green",
      href: "/service-mgmt",
    },
    {
      label: "Testimonials",
      value: "48",
      change: "+8",
      trend: "up",
      icon: MessageSquare,
      color: "purple",
      href: "/marketing/testimonials",
    },
    {
      label: "Total Views",
      value: "12.4K",
      change: "+18%",
      trend: "up",
      icon: Eye,
      color: "orange",
      href: "/analytics",
    },
  ];

  const recentPages = [
    {
      id: 1,
      title: "About Us",
      status: "published",
      views: 1243,
      lastUpdated: "2 hours ago",
      author: "John Doe",
    },
    {
      id: 2,
      title: "Services Overview",
      status: "draft",
      views: 856,
      lastUpdated: "5 hours ago",
      author: "Jane Smith",
    },
    {
      id: 3,
      title: "Contact Information",
      status: "published",
      views: 2341,
      lastUpdated: "1 day ago",
      author: "Mike Johnson",
    },
    {
      id: 4,
      title: "Careers Page",
      status: "published",
      views: 432,
      lastUpdated: "2 days ago",
      author: "Sarah Williams",
    },
  ];

  const quickActions = [
    {
      label: "New Page",
      href: "/pages/new",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "New Service",
      href: "/service-mgmt/new",
      icon: Briefcase,
      color: "bg-green-500",
    },
    {
      label: "Edit Navigation",
      href: "/navigation",
      icon: LayoutDashboard,
      color: "bg-purple-500",
    },
    {
      label: "Manage FAQs",
      href: "/faqs-mgmt",
      icon: MessageSquare,
      color: "bg-orange-500",
    },
  ];

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any }> = {
      published: {
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        icon: CheckCircle,
      },
      draft: {
        color:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
        icon: Edit,
      },
      archived: {
        color:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
        icon: Clock,
      },
    };

    const { color, icon: Icon } = config[status] || config.draft;

    return (
      <div
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Website CMS Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your website content and pages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Link
            href="/pages/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Page
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, string> = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-500 to-green-600",
            purple: "from-purple-500 to-purple-600",
            orange: "from-orange-500 to-orange-600",
          };

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${colorClasses[stat.color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 bg-linear-to-br ${colorClasses[stat.color]} rounded-xl`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.trend === "up"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col items-center gap-3 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors"
              >
                <div
                  className={`p-4 ${action.color} rounded-xl group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-sm text-neutral-900 dark:text-white text-center">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Pages */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Recent Pages
            </h2>
            <Link
              href="/pages"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Page Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Author
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {recentPages.map((page) => (
                <tr
                  key={page.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-neutral-400" />
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {page.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(page.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Eye className="w-4 h-4" />
                      {page.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                    {page.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                    {page.author}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
            Top Performing Pages
          </h3>
          <div className="space-y-3">
            {recentPages.slice(0, 3).map((page, index) => (
              <div
                key={page.id}
                className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
              >
                <div className="shrink-0 w-8 h-8 bg-linear-to-br from-primary-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-900 dark:text-white truncate">
                    {page.title}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {page.views.toLocaleString()} views
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
            Content Status
          </h3>
          <div className="space-y-4">
            {[
              {
                label: "Published",
                count: 18,
                color: "bg-green-500",
                percentage: 75,
              },
              {
                label: "Draft",
                count: 4,
                color: "bg-yellow-500",
                percentage: 17,
              },
              {
                label: "Archived",
                count: 2,
                color: "bg-gray-500",
                percentage: 8,
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    {item.count}
                  </span>
                </div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
