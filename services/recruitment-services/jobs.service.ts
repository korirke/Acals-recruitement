import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import type { ApiResponse } from "@/types/api/common.types";
import type {
  Job,
  JobCategory,
  JobSearchParams,
  JobSearchResult,
  JobStatus,
  CreateJobDto,
  UpdateJobDto,
} from "@/types/recruitment/job.types";

export const jobsService = {
  async searchJobs(
    params: JobSearchParams,
  ): Promise<ApiResponse<JobSearchResult>> {
    const cleanParams = {
      ...params,
      type: params.type?.startsWith("ALL") ? undefined : params.type,
      experienceLevel: params.experienceLevel?.startsWith("ALL")
        ? undefined
        : params.experienceLevel,
      categoryId: params.categoryId?.startsWith("ALL")
        ? undefined
        : params.categoryId,
    };

    const queryString = new URLSearchParams(
      Object.entries(cleanParams)
        .filter(([_, v]) => v != null && v !== "")
        .map(([k, v]) => [k, String(v)]),
    ).toString();

    return api.get(`${ENDPOINTS.JOBS.SEARCH}?${queryString}`);
  },

  async getJobById(idOrSlug: string): Promise<ApiResponse<Job>> {
    return api.get(ENDPOINTS.JOBS.GET_BY_ID(idOrSlug));
  },

  async getJobForEdit(id: string): Promise<ApiResponse<Job>> {
    return api.get(ENDPOINTS.JOBS.MANAGE(id));
  },

  async getCategories(): Promise<ApiResponse<JobCategory[]>> {
    return api.get(ENDPOINTS.JOBS.CATEGORIES);
  },

  async getNewestJobs(limit = 8): Promise<ApiResponse<Job[]>> {
    return api.get(`${ENDPOINTS.JOBS.NEWEST}?limit=${limit}`);
  },

  async createJob(
    data: CreateJobDto & { isDraft?: boolean },
  ): Promise<ApiResponse<Job>> {
    return api.post(ENDPOINTS.JOBS.CREATE, data);
  },

  async updateJob(
    id: string,
    data: UpdateJobDto & { isDraft?: boolean },
  ): Promise<ApiResponse<Job>> {
    return api.put(ENDPOINTS.JOBS.UPDATE(id), data);
  },

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    return api.delete(ENDPOINTS.JOBS.DELETE(id));
  },

  async getMyJobs(): Promise<ApiResponse<Job[]>> {
    return api.get(ENDPOINTS.JOBS.MY_JOBS);
  },

  async changeJobStatus(
    id: string,
    newStatus: JobStatus,
  ): Promise<ApiResponse<Job>> {
    return api.patch(ENDPOINTS.JOBS.CHANGE_STATUS(id, newStatus));
  },

  async getAllJobsAdmin(
    filters?: Record<string, any>,
  ): Promise<ApiResponse<any>> {
    const queryString = new URLSearchParams(
      Object.entries(filters || {})
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, String(v)]),
    ).toString();

    return api.get(`${ENDPOINTS.JOBS.ADMIN_ALL}?${queryString}`);
  },

  async getModerationQueue(): Promise<ApiResponse<Job[]>> {
    return api.get(ENDPOINTS.JOBS.MODERATION_QUEUE);
  },

  async moderateJob(
    id: string,
    data: { status: JobStatus; rejectionReason?: string },
  ): Promise<ApiResponse<Job>> {
    return api.patch(ENDPOINTS.JOBS.MODERATE(id), data);
  },

  async bulkUpdateStatus(
    jobIds: string[],
    newStatus: JobStatus,
  ): Promise<ApiResponse<{ count: number }>> {
    return api.patch(ENDPOINTS.JOBS.BULK_STATUS, {
      jobIds,
      newStatus,
    });
  },
};
