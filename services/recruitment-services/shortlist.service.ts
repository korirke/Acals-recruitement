import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import type {
  ShortlistResult,
  StaleCheckResult,
  DegreeLevel,
  ExportMode,
  ShortlistCriteria,
  ShortlistStats,
  ShortlistJob,
} from "@/types";

export const shortlistService = {
  async getJobs(): Promise<ApiResponse<ShortlistJob[]>> {
    return api.get("/shortlist/jobs");
  },

  async getCriteria(jobId: string): Promise<
    ApiResponse<{
      criteria: ShortlistCriteria;
      job: { id: string; title: string; status: string };
      company: { id: string; name: string };
      stale: StaleCheckResult;
    }>
  > {
    return api.get(`/shortlist/${jobId}/criteria`);
  },

  async updateCriteria(
    jobId: string,
    data: Partial<ShortlistCriteria>,
  ): Promise<ApiResponse<{ message: string }>> {
    return api.put(`/shortlist/${jobId}/criteria`, data);
  },

  async generate(
    jobId: string,
  ): Promise<ApiResponse<{ count: number; generatedAt: string }>> {
    return api.post(`/shortlist/${jobId}/generate`, {});
  },

  async rerank(jobId: string): Promise<ApiResponse<{ message: string }>> {
    return api.post(`/shortlist/${jobId}/rerank`, {});
  },

  async getResults(
    jobId: string,
    filters?: {
      minScore?: number;
      status?: string;
      hasAllMandatory?: boolean;
      flaggedForReview?: boolean;
      topN?: number;
      includeDisqualified?: boolean; // NEW
    },
  ): Promise<
    ApiResponse<{
      results: ShortlistResult[];
      stats: ShortlistStats;
      job: any;
      company: any;
      criteriaConfigured: boolean;
      stale?: StaleCheckResult;
    }>
  > {
    const queryString = new URLSearchParams(
      Object.entries(filters || {})
        .filter(([_, v]) => v != null && v !== "")
        .map(([k, v]) => [k, String(v)]),
    ).toString();

    return api.get(
      `/shortlist/${jobId}/results${queryString ? `?${queryString}` : ""}`,
    );
  },

  async getResultDetails(
    jobId: string,
    resultId: string,
  ): Promise<ApiResponse<ShortlistResult>> {
    return api.get(`/shortlist/${jobId}/results/${resultId}`);
  },

  async updateResult(
    jobId: string,
    resultId: string,
    data: {
      hrNotes?: string;
      flaggedForReview?: boolean;
      internalRating?: number;
    },
  ): Promise<ApiResponse<{ message: string }>> {
    return api.patch(`/shortlist/${jobId}/results/${resultId}`, data);
  },

  // admin scoring per category
  async setAdminScores(
    jobId: string,
    resultId: string,
    data: {
      manualTotalScore?: number | null;
      manualEducationScore?: number | null;
      manualExperienceScore?: number | null;
      manualSkillsScore?: number | null;
      manualClearanceScore?: number | null;
      manualProfessionalScore?: number | null;
    },
  ): Promise<ApiResponse<{ message: string }>> {
    return api.patch(
      `/shortlist/${jobId}/results/${resultId}/admin-score`,
      data,
    );
  },

  async setOverrideDisqualification(
    jobId: string,
    resultId: string,
    overrideDisqualification: boolean,
  ): Promise<ApiResponse<{ message: string }>> {
    return api.patch(
      `/shortlist/${jobId}/results/${resultId}/override-disqualification`,
      { overrideDisqualification },
    );
  },

  async exportExcel(
    jobId: string,
    options?: {
      topN?: number;
      exportMode?: ExportMode;
      degreeLevel?: DegreeLevel;
      minScore?: number;
      status?: string;
      hasAllMandatory?: boolean;
      flaggedForReview?: boolean;
    },
  ): Promise<void> {
    const token = localStorage.getItem("fortune_admin_token");
    if (!token) throw new Error("No authentication token found");

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/shortlist/${jobId}/export`,
    );

    if (options?.topN && options.topN > 0)
      url.searchParams.append("topN", String(options.topN));
    if (options?.exportMode)
      url.searchParams.append("exportMode", options.exportMode);
    if (options?.degreeLevel)
      url.searchParams.append("degreeLevel", options.degreeLevel);
    if (options?.minScore != null)
      url.searchParams.append("minScore", String(options.minScore));
    if (options?.status) url.searchParams.append("status", options.status);
    if (options?.hasAllMandatory != null)
      url.searchParams.append(
        "hasAllMandatory",
        String(options.hasAllMandatory),
      );
    if (options?.flaggedForReview != null)
      url.searchParams.append(
        "flaggedForReview",
        String(options.flaggedForReview),
      );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const blob = await response.blob();
    const link = document.createElement("a");
    const blobUrl = URL.createObjectURL(blob);

    link.setAttribute("href", blobUrl);
    link.setAttribute(
      "download",
      `shortlist_${jobId}_${options?.exportMode ?? "all"}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  },
};
