import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import type { ApiResponse } from "@/types/api/common.types";
import type {
  JobQuestionnaireGetResponse,
  JobQuestionnaireUpsertPayload,
} from "@/types/recruitment/jobQuestionnaire.types";

export const jobQuestionnaireService = {
  async get(jobId: string): Promise<ApiResponse<JobQuestionnaireGetResponse>> {
    return api.get(ENDPOINTS.JOBS.QUESTIONNAIRE(jobId));
  },

  async upsert(
    jobId: string,
    payload: JobQuestionnaireUpsertPayload,
  ): Promise<ApiResponse<JobQuestionnaireGetResponse>> {
    return api.put(ENDPOINTS.JOBS.QUESTIONNAIRE(jobId), payload);
  },
};
