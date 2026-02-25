'use client';

import { useState } from 'react';
import { Shield, Activity, Eye, Filter, Download, Search } from 'lucide-react';
import { DataTable } from '@/components/admin/ui/DataTable';
import { useAuditLogs, useAuditLogStats } from '@/hooks/useAuditLogs';

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

export default function SystemAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [resource, setResource] = useState('');
  const [module, setModule] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { logs, loading, pagination, refetch } = useAuditLogs({
    page,
    limit: 20,
    action: action || undefined,
    resource: resource || undefined,
    module: module || undefined,
  });
  const { stats } = useAuditLogStats();

  const getModuleBadge = (module: string) => {
    const colors: Record<string, string> = {
      RECRUITMENT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      WEBSITE_CMS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      SYSTEM: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[module] || 'bg-gray-100 text-gray-700'}`}>
        {module}
      </span>
    );
  };

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      UPDATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      LOGIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      VIEW: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
      APPROVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      REJECT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };

    const color = Object.keys(colors).find(key => action.includes(key)) || 'default';

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[color] || 'bg-gray-100 text-gray-700'}`}>
        {action}
      </span>
    );
  };

  const columns = [
    {
      key: 'createdAt',
      title: 'Timestamp',
      sortable: true,
      render: (value: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {new Date(String(value)).toLocaleDateString()}
          </span>
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {new Date(String(value)).toLocaleTimeString()}
          </span>
        </div>
      ),
      width: '140px',
    },
    {
      key: 'user',
      title: 'User',
      render: (value: any, row: any) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {value ? `${value.firstName} ${value.lastName}` : 'Unknown'}
          </span>
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {value?.email || 'N/A'}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
            {value?.role || 'N/A'}
          </span>
        </div>
      ),
      width: '200px',
    },
    {
      key: 'module',
      title: 'Module',
      sortable: true,
      render: (value: any) => getModuleBadge(String(value)),
      width: '140px',
    },
    {
      key: 'action',
      title: 'Action',
      sortable: true,
      render: (value: any) => getActionBadge(String(value)),
      width: '160px',
    },
    {
      key: 'resource',
      title: 'Resource',
      sortable: true,
      render: (value: any) => (
        <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded text-xs font-medium">
          {String(value)}
        </span>
      ),
      width: '120px',
    },
    {
      key: 'resourceId',
      title: 'Resource ID',
      render: (value: any) => (
        <span className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
          {value ? String(value).slice(0, 8) + '...' : 'N/A'}
        </span>
      ),
      width: '110px',
    },
    {
      key: 'ipAddress',
      title: 'IP Address',
      render: (value: any) => (
        <span className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
          {value || 'N/A'}
        </span>
      ),
      width: '120px',
    },
  ];

  const logsAsRows: AuditLogRow[] = logs.map(log => ({
    ...log,
    id: log.id,
    userId: log.userId,
    action: log.action,
    resource: log.resource,
    module: log.module || 'SYSTEM',
    resourceId: log.resourceId,
    details: log.details,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    createdAt: log.createdAt,
    user: log.user,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            System Audit Logs
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Comprehensive tracking of all system activities across all portals
          </p>
        </div>
        <button
          onClick={() => {
            // Export functionality
            const csv = 'TODO: Implement CSV export';
            console.log('Exporting logs...');
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Total Logs
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                  {stats.total?.toLocaleString() || 0}
                </p>
              </div>
              <Activity className="w-12 h-12 text-blue-500 dark:text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Last 24h
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                  {stats.recent24h?.toLocaleString() || 0}
                </p>
              </div>
              <Eye className="w-12 h-12 text-purple-500 dark:text-purple-400 opacity-50" />
            </div>
          </div>

          <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Top Action
                </p>
                <p className="text-base font-bold text-green-900 dark:text-green-100 mt-2 truncate">
                  {stats.byAction?.[0]?.action || 'N/A'}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  {stats.byAction?.[0]?.count || 0} times
                </p>
              </div>
              <Shield className="w-12 h-12 text-green-500 dark:text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Active Modules
                </p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                  {stats.byModule?.length || 0}
                </p>
              </div>
              <Filter className="w-12 h-12 text-orange-500 dark:text-orange-400 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Module Distribution */}
      {stats?.byModule && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
            Activity by Module
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.byModule.map((item: any) => (
              <div
                key={item.module}
                className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
              >
                <span className="font-medium text-neutral-900 dark:text-white">
                  {item.module}
                </span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {item.count?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            Filter Logs
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Module
            </label>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Modules</option>
              <option value="RECRUITMENT">Recruitment</option>
              <option value="WEBSITE_CMS">Website CMS</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Action Type
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="APPROVE">Approve</option>
              <option value="REJECT">Reject</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Resource Type
            </label>
            <select
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Resources</option>
              <option value="Job">Jobs</option>
              <option value="Application">Applications</option>
              <option value="User">Users</option>
              <option value="Service">Services</option>
              <option value="Navigation">Navigation</option>
              <option value="Company">Companies</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => {
              setModule('');
              setAction('');
              setResource('');
              setSearchQuery('');
              refetch();
            }}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={logsAsRows}
        loading={loading}
        searchable={false}
        exportable
        onRefresh={refetch}
        title="System Activity Logs"
        description="Complete audit trail of all system activities"
        getRowId={(row) => String(row.id)}
        actions={false}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-neutral-900 dark:text-white">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}