import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import type {
  ApplicationForEmployer,
  ApplicationStatistics,
  DashboardStats,
  CandidateFullProfile,
} from "@/types/recruitment/application.types";

export const applicationsService = {
  // Get applications for specific job with pagination
  async getApplicationsForJob(
    jobId: string,
    params?: { status?: string; page?: number; limit?: number },
  ): Promise<
    ApiResponse<{
      applications: ApplicationForEmployer[];
      stats: ApplicationStatistics;
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>
  > {
    const queryString = new URLSearchParams(
      Object.entries(params || {})
        .filter(([_, v]) => v != null && v !== "")
        .map(([k, v]) => [k, String(v)]),
    ).toString();

    return api.get(
      `/applications/job/${jobId}${queryString ? `?${queryString}` : ""}`,
    );
  },
  // Get my applications with pagination
  async getMyApplications(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    const queryString = new URLSearchParams(
      Object.entries(params || {})
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, String(v)]),
    ).toString();

    return api.get(`/applications/my-applications?${queryString}`);
  },

  // Filter applications with pagination
  async filterApplications(filters: {
    jobId?: string;
    query?: string;
    status?: string;
    candidateId?: string;
    minRating?: number;
    page?: number;
    limit?: number;
  }): Promise<
    ApiResponse<{
      applications: ApplicationForEmployer[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>
  > {
    const queryString = new URLSearchParams(
      Object.entries(filters)
        .filter(([_, v]) => v != null && v !== "")
        .map(([k, v]) => [k, String(v)]),
    ).toString();
    return api.get(`/applications/filter?${queryString}`);
  },

  // Get application details
  async getApplicationDetails(
    id: string,
  ): Promise<ApiResponse<ApplicationForEmployer>> {
    return api.get(`/applications/${id}`);
  },

  // Update application status
  async updateStatus(
    id: string,
    data: {
      status: string;
      internalNotes?: string;
      rating?: number;
      reason?: string;
    },
  ): Promise<ApiResponse<ApplicationForEmployer>> {
    return api.put(`/applications/${id}/status`, data);
  },

  // Bulk update
  async bulkUpdate(data: {
    applicationIds: string[];
    status: string;
    internalNotes?: string;
  }): Promise<ApiResponse<{ updated: number }>> {
    return api.post("/applications/bulk-update", data);
  },

  // Get dashboard stats
  async getDashboardStats(): Promise<
    ApiResponse<{
      stats: DashboardStats;
      recentApplications: ApplicationForEmployer[];
    }>
  > {
    return api.get("/applications/stats/dashboard");
  },

  // Add internal note
  async addInternalNote(id: string, note: string): Promise<ApiResponse<any>> {
    return api.post(`/applications/${id}/notes`, { note });
  },

  // Get candidate full profile
  async getCandidateProfile(
    candidateId: string,
  ): Promise<ApiResponse<CandidateFullProfile>> {
    return api.get(`/applications/candidate/${candidateId}/profile`);
  },

  // Export to CSV
  async exportToCSV(jobId?: string): Promise<void> {
    try {
      const queryString = jobId ? `?jobId=${jobId}` : "";
      const token = localStorage.getItem("fortune_admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/export/csv${queryString}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvContent = await response.text();
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `applications_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV export failed:", error);
      throw error;
    }
  },

  async exportToXLSX(jobId?: string): Promise<void> {
    try {
      const queryString = jobId ? `?jobId=${jobId}` : "";
      const token = localStorage.getItem("fortune_admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/export/xlsx${queryString}`;
      console.log("📥 XLSX Export URL:", url);
      console.log("🔑 JobId passed:", jobId);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📊 Response status:", response.status);
      console.log("📝 Response headers:", {
        contentType: response.headers.get("Content-Type"),
        contentDisposition: response.headers.get("Content-Disposition"),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`,
        );
      }

      const blob = await response.blob();
      console.log("📦 Blob size:", blob.size);

      const link = document.createElement("a");
      const urlObj = URL.createObjectURL(blob);

      link.setAttribute("href", urlObj);
      link.setAttribute(
        "download",
        `longlist_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(urlObj);

      console.log("✅ XLSX export successful");
    } catch (error) {
      console.error("❌ XLSX export failed:", error);
      throw error;
    }
  },
};
