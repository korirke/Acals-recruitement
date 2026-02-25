import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import type { ApiResponse } from "@/types/api/common.types";
import {
  CompanyStatus,
  type Company,
  type CreateCompanyDto,
  type UpdateCompanyDto,
  type CompanyFiltersDto,
  type VerifyCompanyDto,
  type CompanyStats,
} from "@/types/recruitment/company.types";

export const companyService = {
  // ============================================
  // PUBLIC APIs
  // ============================================
  async getPublicCompanies(
    filters?: CompanyFiltersDto,
  ): Promise<ApiResponse<Company[]>> {
    const params = new URLSearchParams();
    if (filters?.industry) params.append("industry", filters.industry);
    if (filters?.search) params.append("search", filters.search);

    const query = params.toString();
    return api.get(
      `${ENDPOINTS.COMPANIES.PUBLIC_LIST}${query ? `?${query}` : ""}`,
    );
  },

  async getCompanyBySlug(slug: string): Promise<ApiResponse<Company>> {
    return api.get(ENDPOINTS.COMPANIES.PUBLIC_DETAIL(slug));
  },

  // ============================================
  // EMPLOYER APIs
  // ============================================
  async setupCompany(
    data: CreateCompanyDto,
  ): Promise<ApiResponse<{ company: Company; employerProfile: any }>> {
    return api.post(ENDPOINTS.COMPANIES.SETUP, data);
  },

  async getMyCompany(): Promise<ApiResponse<Company | null>> {
    return api.get(ENDPOINTS.COMPANIES.MY_PROFILE);
  },

  async updateMyCompany(data: UpdateCompanyDto): Promise<ApiResponse<Company>> {
    return api.put(ENDPOINTS.COMPANIES.MY_UPDATE, data);
  },

  async getMyCompanyStats(): Promise<ApiResponse<CompanyStats>> {
    return api.get(ENDPOINTS.COMPANIES.MY_STATS);
  },

  // ============================================
  // ADMIN APIs
  // ============================================
  async getAllCompaniesAdmin(
    filters?: CompanyFiltersDto,
  ): Promise<ApiResponse<Company[]>> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.industry) params.append("industry", filters.industry);
    if (filters?.search) params.append("search", filters.search);

    const query = params.toString();
    return api.get(
      `${ENDPOINTS.COMPANIES.ADMIN_ALL}${query ? `?${query}` : ""}`,
    );
  },

  async getPendingCompanies(): Promise<ApiResponse<Company[]>> {
    return api.get(ENDPOINTS.COMPANIES.ADMIN_PENDING);
  },

  async getCompanyById(companyId: string): Promise<ApiResponse<Company>> {
    return api.get(ENDPOINTS.COMPANIES.ADMIN_DETAIL(companyId));
  },

  async verifyCompany(
    companyId: string,
    data: VerifyCompanyDto,
  ): Promise<ApiResponse<Company>> {
    return api.patch(ENDPOINTS.COMPANIES.ADMIN_VERIFY(companyId), data);
  },

  async suspendCompany(
    companyId: string,
    reason: string,
  ): Promise<ApiResponse<Company>> {
    return api.patch(ENDPOINTS.COMPANIES.ADMIN_SUSPEND(companyId), { reason });
  },

  /**
   * unified status update endpoint
   * Backend: PATCH /api/companies/admin/{id}/status
   */
  async updateCompanyStatus(
    companyId: string,
    status: CompanyStatus,
  ): Promise<ApiResponse<Company>> {
    return api.patch(ENDPOINTS.COMPANIES.ADMIN_STATUS(companyId), { status });
  },

  /**
   * reactivate (unsuspend) cwrapper
   * Business rule: reactivate => VERIFIED
   */
  async reactivateCompany(companyId: string): Promise<ApiResponse<Company>> {
    return api.patch(ENDPOINTS.COMPANIES.ADMIN_STATUS(companyId), {
      status: CompanyStatus.VERIFIED,
    });
  },

  async forceUpdateCompany(
    companyId: string,
    data: UpdateCompanyDto,
  ): Promise<ApiResponse<Company>> {
    return api.patch(ENDPOINTS.COMPANIES.ADMIN_UPDATE(companyId), data);
  },
};
