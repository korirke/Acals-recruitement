import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import type { JobProfileEligibilityDTO } from "@/types";

export const jobEligibilityService = {
  async getEligibility(
    jobId: string,
  ): Promise<ApiResponse<JobProfileEligibilityDTO>> {
    return api.get(`/jobs/${jobId}/profile-eligibility`);
  },
};
