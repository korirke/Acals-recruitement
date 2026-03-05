import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import type { JobApplicationConfigDTO } from "@/types/recruitment/profileRequirements.types";

export const jobApplicationConfigService = {
  /**
   * GET /jobs/{jobId}/application-config
   * Returns the extended application configuration for a job.
   */
  async get(
    jobId: string,
  ): Promise<ApiResponse<{ jobId: string; config: JobApplicationConfigDTO }>> {
    return api.get(`/jobs/${jobId}/application-config`);
  },

  /**
   * PUT /jobs/{jobId}/application-config
   * Saves the extended application configuration for a job.
   */
  async upsert(
    jobId: string,
    config: Partial<JobApplicationConfigDTO>,
  ): Promise<ApiResponse<{ jobId: string; config: JobApplicationConfigDTO }>> {
    return api.put(`/jobs/${jobId}/application-config`, config);
  },
};
