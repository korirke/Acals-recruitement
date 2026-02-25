"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCompanies } from "@/hooks/useCompanies";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Badge } from "@/components/careers/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/careers/ui/dialog";
import { Label } from "@/components/careers/ui/label";
import { Textarea } from "@/components/careers/ui/textarea";
import {
  Building2,
  Search,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { normalizeImageUrl } from "@/lib/imageUtils";
import { CompanyStatus, type Company, type VerifyCompanyDto } from "@/types";

type ActionType = "verify" | "reject" | "suspend" | "reactivate";

export default function AdminCompaniesPage() {
  const { user } = useAuth();
  const router = useRouter();

  const {
    companies,
    loading,
    fetchAllCompaniesAdmin,
    fetchPendingCompanies,
    verifyCompany,
    suspendCompany,
    reactivateCompany,
  } = useCompanies();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: ActionType | null;
    company: Company | null;
  }>({ open: false, action: null, company: null });

  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (
      !user ||
      !["SUPER_ADMIN", "HR_MANAGER", "MODERATOR"].includes(user.role)
    ) {
      router.push("/recruitment-portal/dashboard");
      return;
    }
    fetchCompanies();
  }, [user, router]);

  const industries = useMemo(
    () => [
      "Technology",
      "Finance",
      "Healthcare",
      "Education",
      "Manufacturing",
      "Retail",
      "Consulting",
      "Marketing",
      "Real Estate",
      "Other",
    ],
    [],
  );

  const pendingCount = useMemo(
    () => companies.filter((c) => c.status === CompanyStatus.PENDING).length,
    [companies],
  );

  const fetchCompanies = async () => {
    const filters: any = {};

    if (statusFilter !== "all") {
      filters.status =
        CompanyStatus[statusFilter as keyof typeof CompanyStatus];
    }

    if (industryFilter !== "all") filters.industry = industryFilter;
    if (searchQuery) filters.search = searchQuery;

    await fetchAllCompaniesAdmin(filters);
  };

  const handleSearch = () => {
    fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();
  }, [statusFilter, industryFilter]);

  const openActionDialog = (action: ActionType, company: Company) => {
    setActionDialog({ open: true, action, company });
    setActionReason("");
  };

  const closeActionDialog = () => {
    setActionDialog({ open: false, action: null, company: null });
    setActionReason("");
  };

  const handleAction = async () => {
    if (!actionDialog.company || !actionDialog.action) return;

    setActionLoading(true);

    try {
      const companyId = actionDialog.company.id;

      if (
        actionDialog.action === "verify" ||
        actionDialog.action === "reject"
      ) {
        const data: VerifyCompanyDto = {
          status:
            actionDialog.action === "verify"
              ? CompanyStatus.VERIFIED
              : CompanyStatus.REJECTED,
          reason: actionReason || undefined,
        };
        await verifyCompany(companyId, data);
      }

      if (actionDialog.action === "suspend") {
        await suspendCompany(
          companyId,
          actionReason.trim() || "No reason provided",
        );
      }

      if (actionDialog.action === "reactivate") {
        await reactivateCompany(companyId);
      }

      await fetchCompanies();
      closeActionDialog();
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: CompanyStatus) => {
    switch (status) {
      case CompanyStatus.VERIFIED:
        return "default";
      case CompanyStatus.PENDING:
        return "secondary";
      case CompanyStatus.REJECTED:
        return "destructive";
      case CompanyStatus.SUSPENDED:
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: CompanyStatus) => {
    switch (status) {
      case CompanyStatus.VERIFIED:
        return (
          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
        );
      case CompanyStatus.PENDING:
        return (
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 dark:text-yellow-400" />
        );
      case CompanyStatus.REJECTED:
        return (
          <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
        );
      case CompanyStatus.SUSPENDED:
        return (
          <Ban className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const dialogTitle = useMemo(() => {
    switch (actionDialog.action) {
      case "verify":
        return "Verify Company";
      case "reject":
        return "Reject Company";
      case "suspend":
        return "Suspend Company";
      case "reactivate":
        return "Reactivate Company";
      default:
        return "";
    }
  }, [actionDialog.action]);

  const dialogDescription = useMemo(() => {
    switch (actionDialog.action) {
      case "verify":
        return "Approve this company to allow them to post jobs.";
      case "reject":
        return "Reject this company's verification request.";
      case "suspend":
        return "Suspend this company from posting jobs.";
      case "reactivate":
        return "Reactivate this company so they can post jobs again.";
      default:
        return "";
    }
  }, [actionDialog.action]);

  const dialogConfirmLabel = useMemo(() => {
    switch (actionDialog.action) {
      case "verify":
        return "Verify Company";
      case "reject":
        return "Reject Company";
      case "suspend":
        return "Suspend Company";
      case "reactivate":
        return "Reactivate Company";
      default:
        return "Confirm";
    }
  }, [actionDialog.action]);

  const confirmButtonClass = useMemo(() => {
    if (
      actionDialog.action === "verify" ||
      actionDialog.action === "reactivate"
    ) {
      return "bg-green-600 hover:bg-green-700";
    }
    return "bg-red-600 hover:bg-red-700";
  }, [actionDialog.action]);

  const requiresReason = actionDialog.action === "suspend";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            Companies Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Manage, verify, suspend and reactivate company profiles
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchPendingCompanies()}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm">Pending ({pendingCount})</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full lg:hidden mb-4"
          >
            <Label className="text-sm sm:text-base">Filters</Label>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="sm:col-span-2 space-y-2">
                <Label className="text-xs sm:text-sm">Search Companies</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="text-xs sm:text-sm"
                  />
                  <Button
                    onClick={handleSearch}
                    size="icon"
                    className="shrink-0"
                  >
                    <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={CompanyStatus.VERIFIED}>
                      Verified
                    </SelectItem>
                    <SelectItem value={CompanyStatus.PENDING}>
                      Pending
                    </SelectItem>
                    <SelectItem value={CompanyStatus.REJECTED}>
                      Rejected
                    </SelectItem>
                    <SelectItem value={CompanyStatus.SUSPENDED}>
                      Suspended
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Industry Filter */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Industry</Label>
                <Select
                  value={industryFilter}
                  onValueChange={setIndustryFilter}
                >
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue placeholder="All industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">
            Companies ({companies.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0">
          {companies.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Building2 className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900 dark:text-white">
                No Companies Found
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  {/* Logo + Info */}
                  <div className="flex gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                    {company.logo ? (
                      <img
                        src={normalizeImageUrl(company.logo)}
                        alt={company.name}
                        className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-linear-to-r from-primary-500 to-orange-500 items-center justify-center shrink-0"
                      style={{ display: company.logo ? "none" : "flex" }}
                    >
                      <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white truncate">
                        {company.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] sm:text-xs"
                        >
                          {company.industry}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] sm:text-xs"
                        >
                          {company.companySize}
                        </Badge>
                        <Badge
                          variant={getStatusBadgeVariant(company.status)}
                          className="text-[10px] sm:text-xs"
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(company.status)}
                            {company.status}
                          </span>
                        </Badge>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 sm:mt-2 truncate">
                        📍 {company.location} • ✉️ {company.email}
                      </p>

                      {company._count && (
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                          {company._count.jobs} active jobs •{" "}
                          {company._count.employerProfiles} employees
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCompany(company)}
                      className="flex-1 sm:flex-none"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-0" />
                      <span className="sm:hidden ml-2">View</span>
                    </Button>

                    {company.status === CompanyStatus.PENDING && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => openActionDialog("verify", company)}
                          className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="text-xs sm:text-sm">Verify</span>
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openActionDialog("reject", company)}
                          className="flex-1 sm:flex-none"
                        >
                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="text-xs sm:text-sm">Reject</span>
                        </Button>
                      </>
                    )}

                    {company.status === CompanyStatus.VERIFIED && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openActionDialog("suspend", company)}
                        className="flex-1 sm:flex-none"
                      >
                        <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs sm:text-sm">Suspend</span>
                      </Button>
                    )}

                    {company.status === CompanyStatus.SUSPENDED && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => openActionDialog("reactivate", company)}
                        className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                      >
                        <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="text-xs sm:text-sm">Reactivate</span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 sm:flex-none"
                    >
                      <Link
                        href={`/recruitment-portal/companies/edit?id=${company.id}`}
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-0" />
                        <span className="sm:hidden ml-2">Edit</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={closeActionDialog}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {actionDialog.company && (
              <div className="p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                <h4 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                  {actionDialog.company.name}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  {actionDialog.company.email}
                </p>
              </div>
            )}

            {(actionDialog.action === "reject" ||
              actionDialog.action === "suspend") && (
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">
                  Reason{" "}
                  {actionDialog.action === "suspend" ? "*" : "(Optional)"}
                </Label>
                <Textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Provide a reason for this action..."
                  className="min-h-20 sm:min-h-[100px] text-xs sm:text-sm"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={closeActionDialog}
                disabled={actionLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                onClick={handleAction}
                size="sm"
                disabled={
                  actionLoading || (requiresReason && !actionReason.trim())
                }
                className={`w-full sm:w-auto ${confirmButtonClass}`}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  dialogConfirmLabel
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Company Details Dialog */}
      <Dialog
        open={!!selectedCompany}
        onOpenChange={() => setSelectedCompany(null)}
      >
        <DialogContent className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Company Details
            </DialogTitle>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 sm:gap-4">
                {selectedCompany.logo ? (
                  <img
                    src={normalizeImageUrl(selectedCompany.logo)}
                    alt={selectedCompany.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover shrink-0"
                  />
                ) : null}

                <div
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-linear-to-r from-primary-500 to-orange-500 items-center justify-center shrink-0"
                  style={{ display: selectedCompany.logo ? "none" : "flex" }}
                >
                  <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white truncate">
                    {selectedCompany.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {selectedCompany.industry}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {selectedCompany.companySize}
                    </Badge>
                    <Badge
                      variant={getStatusBadgeVariant(selectedCompany.status)}
                      className="text-xs"
                    >
                      {selectedCompany.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    Description
                  </Label>
                  <p className="text-xs sm:text-sm mt-1 text-neutral-900 dark:text-neutral-100">
                    {selectedCompany.description || "No description provided"}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      Email
                    </Label>
                    <p className="text-xs sm:text-sm mt-1 text-neutral-900 dark:text-neutral-100 truncate">
                      {selectedCompany.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      Phone
                    </Label>
                    <p className="text-xs sm:text-sm mt-1 text-neutral-900 dark:text-neutral-100">
                      {selectedCompany.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      Website
                    </Label>
                    <p className="text-xs sm:text-sm mt-1 text-neutral-900 dark:text-neutral-100 truncate">
                      {selectedCompany.website ? (
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {selectedCompany.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      Location
                    </Label>
                    <p className="text-xs sm:text-sm mt-1 text-neutral-900 dark:text-neutral-100 truncate">
                      {selectedCompany.location}
                    </p>
                  </div>
                </div>

                {selectedCompany.socialLinks && (
                  <div>
                    <Label className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      Social Links
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedCompany.socialLinks.linkedin && (
                        <a
                          href={selectedCompany.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          LinkedIn
                        </a>
                      )}
                      {selectedCompany.socialLinks.twitter && (
                        <a
                          href={selectedCompany.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Twitter
                        </a>
                      )}
                      {selectedCompany.socialLinks.facebook && (
                        <a
                          href={selectedCompany.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setSelectedCompany(null)} size="sm">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
