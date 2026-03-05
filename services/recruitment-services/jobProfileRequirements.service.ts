import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import type {
  JobProfileEligibilityDTO,
  JobProfileRequirementsDTO,
  ProfileRequirementKey,
  JobApplicationConfigDTO,
} from "@/types/recruitment/profileRequirements.types";

export const jobProfileRequirementsService = {
  async get(jobId: string): Promise<ApiResponse<JobProfileRequirementsDTO>> {
    return api.get(`/jobs/${jobId}/profile-requirements`);
  },

  /**
   * PUT /jobs/{jobId}/profile-requirements
   * Saves requirementKeys AND (optionally) config in ONE request.
   */
  async upsert(
    jobId: string,
    requirementKeys: ProfileRequirementKey[],
    config?: Partial<JobApplicationConfigDTO>,
  ): Promise<ApiResponse<JobProfileRequirementsDTO>> {
    return api.put(`/jobs/${jobId}/profile-requirements`, {
      requirementKeys,
      config: config ?? undefined,
    });
  },

  async getEligibility(
    jobId: string,
  ): Promise<ApiResponse<JobProfileEligibilityDTO>> {
    return api.get(`/jobs/${jobId}/profile-eligibility`);
  },
};
