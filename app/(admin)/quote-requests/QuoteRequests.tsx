"use client";

import { useEffect, useRef } from "react";
import { AdminBreadcrumb } from "@/components/admin/layout/AdminBreadcrumb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatsCard } from "@/components/admin/ui/StatsCard";
import {
  Search,
  Mail,
  Phone,
  Send,
  Eye,
  X,
  Upload,
  FileText,
  Download,
  Paperclip,
  Calendar,
  Building2,
  MapPin,
  Users,
  Briefcase,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  DollarSign,
} from "lucide-react";

import { useQuoteRequests } from "@/hooks/useQuoteRequests";
import { quoteRequestsService } from "@/services/web-services";
import type {
  QuoteStatus,
  QuoteStatusOption,
} from "@/types/api/quote-requests.types";

const STATUS_OPTIONS: QuoteStatusOption[] = [
  {
    value: "all",
    label: "All Status",
    color: "text-neutral-600 dark:text-neutral-400",
    bgColor: "bg-neutral-100 dark:bg-neutral-800",
    icon: null,
  },
  {
    value: "new",
    label: "New",
    color: "text-primary-600 dark:text-primary-400",
    bgColor: "bg-primary-100 dark:bg-primary-900/30",
    icon: AlertCircle,
  },
  {
    value: "contacted",
    label: "Contacted",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    icon: Clock,
  },
  {
    value: "quoted",
    label: "Quoted",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    icon: Send,
  },
  {
    value: "closed",
    label: "Closed",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    icon: CheckCircle,
  },
  {
    value: "rejected",
    label: "Rejected",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    icon: XCircle,
  },
];

function getStatusDisplay(status: QuoteStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
}

export function QuoteRequestsManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    filteredRequests,
    stats,
    loading,

    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,

    selectedRequest,
    detailsOpen,
    setDetailsOpen,
    quoteOpen,
    setQuoteOpen,

    emailSubject,
    setEmailSubject,
    emailBody,
    setEmailBody,
    quoteAmount,
    setQuoteAmount,

    attachments,
    selectedAttachmentIds,
    toggleAttachment,
    uploading,
    uploadAttachment,

    fetchRequests,
    openDetails,
    openQuote,
    updateStatus,

    sendQuote,
    sending,
  } = useQuoteRequests();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb icon={MessageSquare} />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-linear-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb icon={MessageSquare} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Quote Requests Management
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 flex items-center text-sm md:text-base">
            <MessageSquare className="w-4 h-4 mr-2 text-primary-500" />
            Manage and respond to customer pricing requests • {stats.total}{" "}
            total
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, company..."
              className="pl-9"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={fetchRequests}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total"
          value={stats.total}
          icon={<MessageSquare className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="New"
          value={stats.new}
          icon={<AlertCircle className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Contacted"
          value={stats.contacted}
          icon={<Clock className="w-6 h-6" />}
          color="orange"
        />
        <StatsCard
          title="Quoted"
          value={stats.quoted}
          icon={<Send className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Closed"
          value={stats.closed}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Requests List */}
      <Card className="overflow-hidden border-2 border-neutral-200/60 dark:border-neutral-700/60 shadow-xl">
        <div className="p-4 md:p-5 border-b border-neutral-200/60 dark:border-neutral-700/60 bg-linear-to-r from-primary-50/50 to-orange-50/50 dark:from-primary-900/10 dark:to-orange-900/10">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            <Briefcase className="w-4 h-4 text-primary-500" />
            Quote Requests ({filteredRequests.length})
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-8 md:p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900/30 dark:to-neutral-800/30 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              No requests found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {searchTerm || filterStatus !== "all"
                ? "Try changing filters or search terms."
                : "No quote requests yet. Check back later."}
            </p>
            {(searchTerm || filterStatus !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setFilterStatus("all");
                  setSearchTerm("");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wide">
                      Contact
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wide">
                      Company
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wide">
                      Services
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredRequests.map((r) => {
                    const statusConfig = getStatusDisplay(r.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {r.name}
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2 mt-1">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate max-w-60">{r.email}</span>
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" />
                            {r.phone}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-neutral-500" />
                            {r.company}
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {r.industry}
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {r.teamSize} employees
                          </div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {r.country}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            {r.services.slice(0, 3).map((s, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200 font-medium"
                              >
                                {s}
                              </span>
                            ))}
                            {r.services.length > 3 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 font-medium">
                                +{r.services.length - 3}
                              </span>
                            )}
                          </div>

                          {!!r.clientAttachments?.length && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400">
                              <Paperclip className="w-3.5 h-3.5" />
                              {r.clientAttachments.length} file
                              {r.clientAttachments.length !== 1 ? "s" : ""}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={r.status}
                            onChange={(e) =>
                              updateStatus(r.id, e.target.value as QuoteStatus)
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${statusConfig.bgColor} ${statusConfig.color} border-none focus:ring-2 focus:ring-primary-500`}
                          >
                            {STATUS_OPTIONS.filter(
                              (s) => s.value !== "all",
                            ).map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-primary-600 hover:bg-primary-700"
                              onClick={() => openQuote(r)}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Quote
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDetails(r.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredRequests.map((r) => {
                const statusConfig = getStatusDisplay(r.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card
                    key={r.id}
                    className="p-4 border-2 border-neutral-200 dark:border-neutral-700"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-neutral-900 dark:text-white truncate">
                          {r.name}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate mt-1">
                          {r.company}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig.bgColor} ${statusConfig.color}`}
                      >
                        {StatusIcon && <StatusIcon className="w-3 h-3" />}
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{r.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 shrink-0" /> {r.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0" />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {r.services.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {r.services.length > 2 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 font-medium">
                          +{r.services.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        className="bg-primary-600 hover:bg-primary-700"
                        onClick={() => openQuote(r)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Quote
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetails(r.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Details Modal */}
      {detailsOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800 animate-scale-in">
            <div className="sticky top-0 bg-linear-to-r from-primary-600 to-orange-600 text-white p-6 flex items-center justify-between z-10">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold truncate">
                  {selectedRequest.name}
                </h3>
                <p className="text-sm text-white/80 truncate">
                  {selectedRequest.company}
                </p>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 border-2 border-neutral-200 dark:border-neutral-700">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary-600" /> Contact
                    Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${selectedRequest.email}`}
                        className="hover:text-primary-600 hover:underline"
                      >
                        {selectedRequest.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${selectedRequest.phone}`}
                        className="hover:text-primary-600 hover:underline"
                      >
                        {selectedRequest.phone}
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-2 border-neutral-200 dark:border-neutral-700">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-orange-600" /> Company
                    Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <Building2 className="w-4 h-4" />
                      {selectedRequest.company}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <Briefcase className="w-4 h-4" />
                      {selectedRequest.industry}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <Users className="w-4 h-4" />
                      {selectedRequest.teamSize} employees
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <MapPin className="w-4 h-4" />
                      {selectedRequest.country}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary-600" /> Services
                  Requested
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 rounded-xl bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200 font-medium text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Message */}
              {selectedRequest.message && (
                <Card className="p-4 border-2 border-neutral-200 dark:border-neutral-700">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary-600" />{" "}
                    Customer Message
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                    {selectedRequest.message}
                  </p>
                </Card>
              )}

              {/* Client Attachments */}
              {!!selectedRequest.clientAttachments?.length && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    Client-Uploaded Documents (
                    {selectedRequest.clientAttachments.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedRequest.clientAttachments.map((a) => (
                      <Card
                        key={a.id}
                        className="p-3 flex items-center justify-between border-2 border-orange-200 dark:border-orange-900/40"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <FileText className="w-5 h-5 text-orange-600 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {a.originalName}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {quoteRequestsService.formatFileSize(a.fileSize)}{" "}
                              • {new Date(a.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <a
                          href={quoteRequestsService.getDownloadUrl(
                            a.fileUrl,
                            a.fileName,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors shrink-0"
                          title="Download"
                        >
                          <Download className="w-4 h-4 text-orange-600" />
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-end gap-3">
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button
                className="bg-primary-600 hover:bg-primary-700"
                onClick={() => {
                  setDetailsOpen(false);
                  openQuote(selectedRequest);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Quote
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Send Quote Modal */}
      {quoteOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800 animate-scale-in">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary-600" />
                  Send Quote
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate mt-1">
                  {selectedRequest.company} • {selectedRequest.email}
                </p>
              </div>
              <button
                onClick={() => setQuoteOpen(false)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Subject *
                </label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Quote for services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Quote Amount (Optional)
                </label>
                <Input
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Body *
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical"
                  placeholder="Enter your quote details..."
                />
              </div>

              {/* Attachments */}
              <Card className="p-4 border-2 border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="font-semibold flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-primary-600" />
                    Attachments to Send
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadAttachment(selectedRequest.id, file);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload File"}
                  </Button>
                </div>

                {attachments.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
                    <Paperclip className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      No attachments yet. Upload files to include with the
                      quote.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {attachments.map((a) => {
                      const checked = selectedAttachmentIds.includes(a.id);
                      return (
                        <label
                          key={a.id}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            checked
                              ? "bg-primary-50 dark:bg-primary-900/10 border-primary-400 shadow-sm"
                              : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleAttachment(a.id)}
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                            />
                            <FileText
                              className={`w-5 h-5 shrink-0 ${
                                checked
                                  ? "text-primary-600"
                                  : "text-neutral-500"
                              }`}
                            />
                            <div className="min-w-0">
                              <div className="font-medium truncate text-neutral-900 dark:text-white">
                                {a.originalName}
                              </div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                {quoteRequestsService.formatFileSize(
                                  a.fileSize,
                                )}
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>

            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-end gap-3">
              <Button variant="outline" onClick={() => setQuoteOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-primary-600 hover:bg-primary-700"
                onClick={sendQuote}
                disabled={!emailSubject || !emailBody || sending}
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Quote
                    {selectedAttachmentIds.length > 0 &&
                      ` (${selectedAttachmentIds.length} file${selectedAttachmentIds.length !== 1 ? "s" : ""})`}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
