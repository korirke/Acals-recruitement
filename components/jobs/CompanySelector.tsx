"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCompanies } from "@/hooks/useCompanies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { Alert, AlertDescription } from "@/components/careers/ui/alert";
import { Building2, Loader2 } from "lucide-react";
import { normalizeImageUrl } from "@/lib/imageUtils";

interface CompanySelectorProps {
  value: string;
  onChange: (companyId: string) => void;
  error?: string;
}

export function CompanySelector({
  value,
  onChange,
  error,
}: CompanySelectorProps) {
  const { user } = useAuth();
  const {
    companies,
    myCompany,
    loading,
    fetchAllCompaniesAdmin,
    fetchMyCompany,
  } = useCompanies();

  useEffect(() => {
    if (user?.role === "EMPLOYER") {
      fetchMyCompany();
    } else if (user?.role === "SUPER_ADMIN" || user?.role === "HR_MANAGER") {
      fetchAllCompaniesAdmin({ status: "VERIFIED" as any });
    }
  }, [user, fetchMyCompany, fetchAllCompaniesAdmin]);

  // Auto-assign employer's company
  useEffect(() => {
    if (user?.role === "EMPLOYER" && myCompany && !value) {
      onChange(myCompany.id);
    }
  }, [user, myCompany, value, onChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 border rounded-lg border-neutral-200 dark:border-neutral-800">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
        <span className="ml-2 text-sm text-neutral-500">
          Loading companies...
        </span>
      </div>
    );
  }

  // Employer view - show their company (read-only)
  if (user?.role === "EMPLOYER") {
    if (!myCompany) {
      return (
        <Alert className="bg-red-50 border-red-400">
          <AlertDescription>
            No company found. Please complete company setup first.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="flex items-center gap-3 p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
        {myCompany.logo ? (
          <img
            src={myCompany.logo}
            alt={myCompany.name}
            className="h-10 w-10 rounded-lg object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-primary-500 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
        )}
        <div className="flex-1">
          <p className="font-medium text-neutral-900 dark:text-white">
            {myCompany.name}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {myCompany.location || "Location not set"}
          </p>
        </div>
      </div>
    );
  }

  // Admin view - dropdown of all companies 
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={error ? "border-red-500" : ""}>
        <SelectValue placeholder="Select company" />
      </SelectTrigger>
      <SelectContent>
        {companies.length === 0 ? (
          <div className="p-4 text-center text-sm text-neutral-500">
            No verified companies available
          </div>
        ) : (
          companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              <div className="flex items-center gap-2">
                {company.logo ? (
                  <img
                    src={normalizeImageUrl(company.logo)}
                    alt={company.name}
                    className="h-5 w-5 rounded object-cover"
                  />
                ) : (
                  <Building2 className="h-4 w-4 text-neutral-400" />
                )}
                <span>{company.name}</span>
                {company._count && (
                  <span className="text-xs text-neutral-400">
                    ({company._count.jobs} jobs)
                  </span>
                )}
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
