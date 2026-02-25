"use client";

import { useState, useCallback } from "react";
import { companyService } from "@/services/recruitment-services";
import { useErrorHandler } from "@/hooks/useErrorHandler";

import {
  CompanyStatus,
  type Company,
  type CreateCompanyDto,
  type UpdateCompanyDto,
  type CompanyFiltersDto,
  type VerifyCompanyDto,
  type CompanyStats,
} from "@/types/recruitment/company.types";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [myCompany, setMyCompany] = useState<Company | null>(null);
  const [companyStats, setCompanyStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  // ============================================
  // PUBLIC
  // ============================================
  const fetchPublicCompanies = useCallback(
    async (filters?: CompanyFiltersDto) => {
      try {
        setLoading(true);
        const response = await companyService.getPublicCompanies(filters);
        if (response.success && response.data) setCompanies(response.data);
      } catch (error: any) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const fetchCompanyBySlug = useCallback(
    async (slug: string): Promise<Company | null> => {
      try {
        setLoading(true);
        const response = await companyService.getCompanyBySlug(slug);
        if (response.success && response.data) return response.data;
        return null;
      } catch (error: any) {
        handleError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  // ============================================
  // EMPLOYER
  // ============================================
  const setupCompany = useCallback(
    async (data: CreateCompanyDto): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await companyService.setupCompany(data);
        if (response.success && response.data) {
          setMyCompany(response.data.company);
          handleSuccess("Company setup completed successfully!");
          return true;
        }
        return false;
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError, handleSuccess],
  );

  const fetchMyCompany = useCallback(async () => {
    try {
      setLoading(true);
      const response = await companyService.getMyCompany();
      if (response.success) setMyCompany(response.data ?? null);
    } catch (error: any) {
      // Silent fail for "no company" case
      if (!error.message?.toLowerCase().includes("no company")) {
        handleError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateMyCompany = useCallback(
    async (data: UpdateCompanyDto): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await companyService.updateMyCompany(data);
        if (response.success && response.data) {
          setMyCompany(response.data ?? null);
          handleSuccess("Company updated successfully!");
          return true;
        }
        return false;
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError, handleSuccess],
  );

  const fetchMyCompanyStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await companyService.getMyCompanyStats();
      if (response.success && response.data) {
        setCompanyStats(response.data);
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // ============================================
  // ADMIN
  // ============================================
  const fetchAllCompaniesAdmin = useCallback(
    async (filters?: CompanyFiltersDto) => {
      try {
        setLoading(true);
        const response = await companyService.getAllCompaniesAdmin(filters);
        if (response.success && response.data) setCompanies(response.data);
      } catch (error: any) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const fetchPendingCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await companyService.getPendingCompanies();
      if (response.success && response.data) setCompanies(response.data);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const verifyCompany = useCallback(
    async (companyId: string, data: VerifyCompanyDto): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await companyService.verifyCompany(companyId, data);
        if (response.success) {
          handleSuccess(
            `Company ${data.status === CompanyStatus.VERIFIED ? "verified" : "rejected"} successfully!`,
          );
          return true;
        }
        return false;
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError, handleSuccess],
  );

  const suspendCompany = useCallback(
    async (companyId: string, reason: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await companyService.suspendCompany(companyId, reason);
        if (response.success) {
          handleSuccess("Company suspended successfully!");
          return true;
        }
        return false;
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError, handleSuccess],
  );

  /**
   * unified status update
   */
  const updateCompanyStatus = useCallback(
    async (companyId: string, status: CompanyStatus): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await companyService.updateCompanyStatus(
          companyId,
          status,
        );
        if (response.success) {
          handleSuccess(`Company status updated to ${status}`);
          return true;
        }
        return false;
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError, handleSuccess],
  );

  /**
   * reactivate company
   */
  const reactivateCompany = useCallback(
    async (companyId: string): Promise<boolean> => {
      // business rule: reactivate => VERIFIED
      return updateCompanyStatus(companyId, CompanyStatus.VERIFIED);
    },
    [updateCompanyStatus],
  );

  const forceUpdateCompany = useCallback(
    async (companyId: string, data: UpdateCompanyDto): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await companyService.forceUpdateCompany(
          companyId,
          data,
        );
        if (response.success) {
          handleSuccess("Company updated successfully!");
          return true;
        }
        return false;
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError, handleSuccess],
  );

  return {
    // State
    companies,
    myCompany,
    companyStats,
    loading,

    // Public
    fetchPublicCompanies,
    fetchCompanyBySlug,

    // Employer
    setupCompany,
    fetchMyCompany,
    updateMyCompany,
    fetchMyCompanyStats,

    // Admin
    fetchAllCompaniesAdmin,
    fetchPendingCompanies,
    verifyCompany,
    suspendCompany,
    updateCompanyStatus,
    reactivateCompany,
    forceUpdateCompany,
  };
}
