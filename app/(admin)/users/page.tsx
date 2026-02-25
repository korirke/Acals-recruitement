"use client";

import { useState } from "react";
import { Plus, Shield, Users as UsersIcon } from "lucide-react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { useUsers, useUserStats, useUserActions } from "@/hooks/useUsers";
import UserFormDialog from "@/components/admin/UserFormDialog";
import { User } from "@/types/system/user.types";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";

export default function WebsiteUsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { users, pagination, loading, refetch } = useUsers({
    page,
    limit,
    search,
    scope: "website",
  });
  const { stats } = useUserStats("website");
  const { deleteUser, bulkDelete } = useUserActions();

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowCreateDialog(true);
  };

  const handleDelete = async (user: User) => {
    const success = await deleteUser(user.id);
    if (success) refetch();
  };

  const handleBulkDelete = async (ids: string[]) => {
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
      WEBSITE_ADMIN:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[role] || colors.WEBSITE_ADMIN}`}
      >
        {role.replace("_", " ").toUpperCase()}
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
          <span className="font-medium">
            {row.firstName} {row.lastName}
          </span>
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
      key: "createdAt",
      title: "Created",
      sortable: true,
      render: (value: any) => new Date(String(value)).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Website Admin Users
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage website administrators and their permissions
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total Admins
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                {stats?.total || 0}
              </p>
            </div>
            <UsersIcon className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Super Admins
              </p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                {stats?.byRole?.SUPER_ADMIN || 0}
              </p>
            </div>
            <Shield className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Website Admins
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                {stats?.byRole?.WEBSITE_ADMIN || 0}
              </p>
            </div>
            <UsersIcon className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onRefresh={refetch}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearchChange={setSearch}
        title="Website Administrators"
        description="Manage website CMS admin accounts"
        getRowId={(row) => row.id}
        actions
      />

      {/* User Form Dialog */}
      {showCreateDialog && (
        <UserFormDialog
          user={editingUser}
          onClose={handleDialogClose}
          scope="website"
        />
      )}
    </div>
  );
}
