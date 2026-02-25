"use client";

import { useState } from "react";
import { Plus, Users as UsersIcon, Briefcase, Shield } from "lucide-react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { useUsers, useUserStats, useUserActions } from "@/hooks/useUsers";
import UserFormDialog from "@/components/admin/UserFormDialog";
import UserViewModal from "@/components/admin/UserViewModal";
import { User } from "@/types";

export default function RecruitmentUsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const { users, pagination, loading, refetch } = useUsers({
    page,
    limit,
    search,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    scope: "recruitment",
  });
  const { stats } = useUserStats("recruitment");
  const { deleteUser, bulkDelete } = useUserActions();

  const handleView = async (user: User) => {
    setViewingUser(user);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowCreateDialog(true);
  };

  const handleDelete = async (user: User) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete ${user.firstName} ${user.lastName}? This action cannot be undone and will remove all associated data.`,
      )
    ) {
      return;
    }
    const success = await deleteUser(user.id);
    if (success) refetch();
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete ${ids.length} user(s)? This action cannot be undone and will remove all associated data.`,
      )
    ) {
      return;
    }
    const success = await bulkDelete(ids);
    if (success) refetch();
  };

  const handleDialogClose = (shouldRefetch?: boolean) => {
    setShowCreateDialog(false);
    setEditingUser(null);
    if (shouldRefetch) refetch();
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      HR_MANAGER:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      MODERATOR:
        "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
      EMPLOYER:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      CANDIDATE:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          colors[role] || colors.CANDIDATE
        }`}
      >
        {role.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      INACTIVE:
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
      SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      PENDING_VERIFICATION:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          colors[status] || colors.INACTIVE
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const columns = [
    {
      key: "firstName",
      title: "Name",
      sortable: true,
      render: (_: any, row: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              {row.firstName?.charAt(0)?.toUpperCase()}
              {row.lastName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">
              {row.firstName} {row.lastName}
            </div>
            {row.candidateProfile?.title && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {row.candidateProfile.title}
              </div>
            )}
            {row.employerProfile?.company?.name && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {row.employerProfile.company.name}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
    },
    {
      key: "role",
      title: "Role",
      sortable: true,
      render: (value: any) => getRoleBadge(String(value)),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: any) => getStatusBadge(String(value)),
    },
    {
      key: "createdAt",
      title: "Joined",
      sortable: true,
      render: (value: any) => new Date(String(value)).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Recruitment Users
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage candidates, employers, and recruitment staff
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Candidates
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                {stats?.byRole?.CANDIDATE || 0}
              </p>
            </div>
            <UsersIcon className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Employers
              </p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                {stats?.byRole?.EMPLOYER || 0}
              </p>
            </div>
            <Briefcase className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                HR Managers
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                {stats?.byRole?.HR_MANAGER || 0}
              </p>
            </div>
            <Shield className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-linear-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                Moderators
              </p>
              <p className="text-3xl font-bold text-cyan-900 dark:text-cyan-100 mt-2">
                {stats?.byRole?.MODERATOR || 0}
              </p>
            </div>
            <Shield className="w-12 h-12 text-cyan-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1); // Reset to first page when filter changes
          }}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="">All Roles</option>
          <option value="CANDIDATE">Candidates</option>
          <option value="EMPLOYER">Employers</option>
          <option value="MODERATOR">Moderators</option>
          <option value="HR_MANAGER">HR Managers</option>
          <option value="SUPER_ADMIN">Super Admins</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1); // Reset to first page when filter changes
          }}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="PENDING_VERIFICATION">Pending</option>
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        pagination={pagination}
        loading={loading}
        searchable
        filterable
        exportable
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onRefresh={refetch}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearchChange={setSearch}
        title="All Recruitment Users"
        description="View and manage recruitment portal users"
        getRowId={(row: any) => row.id}
        actions
      />

      {/* User Form Dialog */}
      {showCreateDialog && (
        <UserFormDialog
          user={editingUser}
          onClose={handleDialogClose}
          scope="recruitment"
        />
      )}

      {/* User View Modal */}
      {viewingUser && (
        <UserViewModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          onRefresh={refetch}
        />
      )}
    </div>
  );
}
