"use client";

import React, { useState, useEffect } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import { useToast } from "@/components/admin/ui/Toast";
import { useContactInquiries, useContactStats } from "@/hooks/useContact";
import { contactService } from "@/services/contactService";
import {
  Search,
  Eye,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw,
  Loader2,
  Sparkles,
  Mail,
  MessageSquare,
  Calendar,
} from "lucide-react";
import InquiryDetailModal from "@/components/admin/InquiryDetailModal";

const statusColors: Record<string, string> = {
  pending:
    "bg-linear-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-400",
  in_progress:
    "bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400",
  resolved:
    "bg-linear-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400",
  closed:
    "bg-linear-to-r from-neutral-100 to-neutral-200 text-neutral-700 dark:from-neutral-800 dark:to-neutral-700 dark:text-neutral-400",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  in_progress: AlertCircle,
  resolved: CheckCircle,
  closed: XCircle,
};

export default function ContactManagementPage() {
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 20,
  });

  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { inquiries, pagination, loading, refetch } =
    useContactInquiries(filters);
  const { stats, refetch: refetchStats } = useContactStats();
  const { showToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDropdown && !(e.target as Element).closest(".dropdown-trigger")) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this inquiry? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      setShowDropdown(null);
      const success = await contactService.deleteInquiry(id);
      if (success) {
        await refetch();
        await refetchStats();
        showToast({
          type: "success",
          title: "Deleted",
          message: "Inquiry deleted successfully",
        });
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to delete inquiry. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === prev.status ? "" : status,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefetch = async () => {
    await refetch();
    await refetchStats();
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-32 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl"
              />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-24 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl" />
            <div className="h-96 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const displayStats = stats ?? {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Contact Inquiries
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
            Manage customer inquiries and support requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleRefetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-2 bg-linear-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards - responsive: 1 col xs, 2 sm, 3 md, 4 lg, 5 xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <StatsCard
            title="Total"
            value={displayStats.total}
            icon={<Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
            color="blue"
          />
        </div>
        <div
          onClick={() => handleStatusFilter("pending")}
          className="cursor-pointer min-w-0"
        >
          <StatsCard
            title="Pending"
            value={displayStats.pending}
            icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
            color="orange"
          />
        </div>
        <div
          onClick={() => handleStatusFilter("in_progress")}
          className="cursor-pointer min-w-0"
        >
          <StatsCard
            title="In Progress"
            value={displayStats.inProgress}
            icon={<AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
            color="purple"
          />
        </div>
        <div
          onClick={() => handleStatusFilter("resolved")}
          className="cursor-pointer min-w-0"
        >
          <StatsCard
            title="Resolved"
            value={displayStats.resolved}
            icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
            color="green"
          />
        </div>
        <div
          onClick={() => handleStatusFilter("closed")}
          className="cursor-pointer min-w-0"
        >
          <StatsCard
            title="Closed"
            value={displayStats.closed}
            icon={<XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
            color="cyan"
          />
        </div>
      </div>

      {/* Filters */}
      <Card className="overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 rounded-2xl">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by name, email, or message..."
                value={filters.search}
                onChange={handleSearch}
                className="pl-11 border-2 focus:border-primary-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusFilter("pending")}
                className={
                  filters.status === "pending"
                    ? "bg-linear-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700"
                    : ""
                }
              >
                Pending
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusFilter("in_progress")}
                className={
                  filters.status === "in_progress"
                    ? "bg-linear-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700"
                    : ""
                }
              >
                In Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusFilter("resolved")}
                className={
                  filters.status === "resolved"
                    ? "bg-linear-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700"
                    : ""
                }
              >
                Resolved
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusFilter("closed")}
                className={
                  filters.status === "closed"
                    ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600"
                    : ""
                }
              >
                Closed
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 rounded-2xl group">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border-b-2 border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Inquiry
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Loading inquiries...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                        No inquiries found
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-500">
                        {filters.search || filters.status
                          ? "Try adjusting your search or filters"
                          : "New contact form submissions will appear here"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => {
                  const StatusIcon = statusIcons[inquiry.status] ?? Clock;
                  return (
                    <tr
                      key={inquiry.id}
                      className="hover:bg-linear-to-r hover:from-primary-50/30 hover:to-purple-50/20 dark:hover:from-primary-900/10 dark:hover:to-purple-900/10 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {inquiry.fullName} {inquiry.lastName}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5" />
                            {inquiry.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                          {inquiry.inquiry}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${statusColors[inquiry.status] ?? statusColors.pending}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                          {inquiry.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                          {formatDate(inquiry.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 relative dropdown-trigger">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInquiry(inquiry.id)}
                            className="hover:bg-primary-50 dark:hover:bg-primary-900/20"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                          </Button>
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDropdown(
                                  showDropdown === inquiry.id
                                    ? null
                                    : inquiry.id,
                                );
                              }}
                              className="hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                              <MoreVertical className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            </Button>
                            {showDropdown === inquiry.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border-2 border-neutral-200 dark:border-neutral-700 py-1 z-50 overflow-hidden">
                                <button
                                  onClick={() => handleDelete(inquiry.id)}
                                  disabled={deletingId === inquiry.id}
                                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2 disabled:opacity-50 transition-colors font-medium"
                                >
                                  {deletingId === inquiry.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 shrink-0" />
                                  )}
                                  {deletingId === inquiry.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t-2 border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-900/30">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selectedInquiry && (
        <InquiryDetailModal
          inquiryId={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onUpdate={async () => {
            await refetch();
            await refetchStats();
          }}
        />
      )}
    </div>
  );
}
