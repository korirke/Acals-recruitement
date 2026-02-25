import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import type {
  JobProfileEligibilityDTO,
  JobProfileRequirementsDTO,
  ProfileRequirementKey,
} from "@/types/recruitment/profileRequirements.types";

export const jobProfileRequirementsService = {
  async get(jobId: string): Promise<ApiResponse<JobProfileRequirementsDTO>> {
    return api.get(`/jobs/${jobId}/profile-requirements`);
  },

  async upsert(jobId: string, requirementKeys: ProfileRequirementKey[]) {
    return api.put(`/jobs/${jobId}/profile-requirements`, { requirementKeys });
  },

  async getEligibility(
    jobId: string,
  ): Promise<ApiResponse<JobProfileEligibilityDTO>> {
    return api.get(`/jobs/${jobId}/profile-eligibility`);
  },
};
