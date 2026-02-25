"use client";

import { useState } from "react";
import {
  Activity,
  Filter,
  Eye,
  Shield,
  Download,
  Search,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { useAuditLogs, useAuditLogStats } from "@/hooks/useAuditLogs";
import { Card, CardContent } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";

interface AuditLogRow extends Record<string, unknown> {
  id: string;
  userId: string;
  action: string;
  resource: string;
  module: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export default function RecruitmentAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [resource, setResource] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { logs, loading, pagination, refetch } = useAuditLogs({
    page,
    limit: 20,
    module: "RECRUITMENT",
    action: action || undefined,
    resource: resource || undefined,
  });

  const { stats } = useAuditLogStats("RECRUITMENT");

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      UPDATE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      APPROVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      REJECT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      VIEW: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
      STATUS: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    };

    const color = Object.keys(colors).find((key) => action.includes(key)) || "default";

    return (
      <span
        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
          colors[color] || "bg-gray-100 text-gray-700"
        }`}
      >
        {action}
      </span>
    );
  };

  const columns = [
    {
      key: "createdAt",
      title: "Timestamp",
      sortable: true,
      render: (value: any) => (
        <div className="flex flex-col min-w-[100px]">
          <span className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {new Date(String(value)).toLocaleDateString()}
          </span>
          <span className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 truncate">
            {new Date(String(value)).toLocaleTimeString()}
          </span>
        </div>
      ),
      width: "120px",
    },
    {
      key: "user",
      title: "User",
      render: (value: any) => (
        <div className="flex flex-col min-w-[150px] max-w-[200px]">
          <span className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {value ? `${value.firstName} ${value.lastName}` : "Unknown"}
          </span>
          <span className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 truncate">
            {value?.email || "N/A"}
          </span>
          <span className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-500 mt-0.5 truncate">
            {value?.role || "N/A"}
          </span>
        </div>
      ),
      width: "180px",
    },
    {
      key: "action",
      title: "Action",
      sortable: true,
      render: (value: any) => getActionBadge(String(value)),
      width: "140px",
    },
    {
      key: "resource",
      title: "Resource",
      sortable: true,
      render: (value: any) => (
        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 rounded text-[10px] sm:text-xs font-medium whitespace-nowrap">
          {String(value)}
        </span>
      ),
      width: "110px",
    },
    {
      key: "resourceId",
      title: "Resource ID",
      render: (value: any) => (
        <span className="text-[10px] sm:text-xs font-mono text-neutral-600 dark:text-neutral-300 truncate block max-w-[100px]">
          {value ? String(value).slice(0, 8) + "..." : "N/A"}
        </span>
      ),
      width: "100px",
    },
    {
      key: "ipAddress",
      title: "IP Address",
      render: (value: any) => (
        <span className="text-[10px] sm:text-xs font-mono text-neutral-600 dark:text-neutral-300 truncate block max-w-[120px]">
          {value || "N/A"}
        </span>
      ),
      width: "110px",
    },
  ];

  const logsAsRows: AuditLogRow[] = logs.map((log) => ({
    ...log,
    id: log.id,
    userId: log.userId,
    action: log.action,
    resource: log.resource,
    module: log.module || "RECRUITMENT",
    resourceId: log.resourceId,
    details: log.details,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    createdAt: log.createdAt,
    user: log.user,
  }));

  const handleExport = () => {
    const headers = [
      "Timestamp",
      "User",
      "Email",
      "Action",
      "Resource",
      "Resource ID",
      "IP Address",
    ];
    const csvData = logsAsRows.map((log) => [
      new Date(log.createdAt).toISOString(),
      log.user ? `${log.user.firstName} ${log.user.lastName}` : "Unknown",
      log.user?.email || "N/A",
      log.action,
      log.resource,
      log.resourceId || "N/A",
      log.ipAddress || "N/A",
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recruitment-audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Recruitment Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Track all recruitment-related activities and changes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={refetch}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
          <Button onClick={handleExport} size="sm" className="flex-1 sm:flex-none bg-primary-500 hover:bg-primary-600">
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="ml-2 hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */} 
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <Card className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400 mb-1 truncate">
                    Total Logs
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1 break-all">
                    {stats.total?.toLocaleString() || 0}
                  </p>
                  <p className="text-[10px] sm:text-xs text-orange-700 dark:text-orange-300 truncate">
                    Recruitment activities
                  </p>
                </div>
                <Activity className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-orange-500 dark:text-orange-400 opacity-50 shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-1 truncate">
                    Last 24 Hours
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1 break-all">
                    {stats.recent24h?.toLocaleString() || 0}
                  </p>
                  <p className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300 truncate">
                    Recent activities
                  </p>
                </div>
                <Eye className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-500 dark:text-blue-400 opacity-50 shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 mb-1 truncate">
                    Top Action
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl font-bold text-green-900 dark:text-green-100 mb-1 truncate">
                    {stats.byAction?.[0]?.action || "N/A"}
                  </p>
                  <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-300 truncate">
                    {stats.byAction?.[0]?.count || 0} times
                  </p>
                </div>
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-500 dark:text-green-400 opacity-50 shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resource Distribution */}
      {stats?.byResource && stats.byResource.length > 0 && (
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-4">
              Activity by Resource Type
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {stats.byResource.slice(0, 4).map((item: any) => (
                <div
                  key={item.resource}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                >
                  <span className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white mb-2 truncate w-full text-center">
                    {item.resource}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {item.count?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <CardContent className="p-4 sm:p-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full lg:hidden mb-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Filter Logs
              </h3>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-neutral-600 dark:text-neutral-400 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="hidden lg:flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Filter Logs</h3>
          </div>

          <div className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Action Type
                </label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Actions</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="APPROVE">Approve</option>
                  <option value="REJECT">Reject</option>
                  <option value="STATUS">Status Change</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Resource Type
                </label>
                <select
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Resources</option>
                  <option value="Job">Jobs</option>
                  <option value="Application">Applications</option>
                  <option value="Candidate">Candidates</option>
                  <option value="Company">Companies</option>
                  <option value="User">Users</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search logs..."
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => {
                  setAction("");
                  setResource("");
                  setSearchQuery("");
                  refetch();
                }}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={refetch}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={logsAsRows}
            loading={loading}
            searchable={false}
            exportable={false}
            onRefresh={refetch}
            title="Activity Logs"
            description="Detailed recruitment activity trail"
            getRowId={(row) => String(row.id)}
            actions={false}
          />
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 text-center sm:text-left">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} results
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white whitespace-nowrap">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && logsAsRows.length === 0 && (
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <CardContent className="p-8 sm:p-12 text-center">
            <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-2">
              No Audit Logs Found
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              {action || resource
                ? "Try adjusting your filters to see more results."
                : "Start performing actions to see audit logs here."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
