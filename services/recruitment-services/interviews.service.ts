import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";
import {InterviewStatus, InterviewType, CreateInterviewDto, UpdateInterviewDto, SearchInterviewsParams, InterviewSearchResult} from "@/types";

export interface Interview {
  history: boolean;
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  scheduledAt: string;
  duration: number;
  status: InterviewStatus;
  type: InterviewType;
  location?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  interviewerName?: string;
  interviewerId?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  outcome?: string;
  reminderSent: boolean;
  reminderSentAt?: string;
  createdAt: string;
  updatedAt: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  job: {
    title: string;
    company?: {
      name: string;
    };
  };
  interviewer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}


export const interviewsService = {
  // Create interview
  async createInterview(data: CreateInterviewDto): Promise<ApiResponse<Interview>> {
    return api.post("/interviews", data);
  },

  // Update interview
  async updateInterview(
    id: string,
    data: UpdateInterviewDto
  ): Promise<ApiResponse<Interview>> {
    return api.put(`/interviews/${id}`, data);
  },

  // Delete interview
  async deleteInterview(id: string): Promise<ApiResponse<void>> {
    return api.delete(`/interviews/${id}`);
  },

  // Get interview by ID
  async getInterviewById(id: string): Promise<ApiResponse<Interview>> {
    return api.get(`/interviews/${id}`);
  },

  // Search interviews
  async searchInterviews(
    params: SearchInterviewsParams
  ): Promise<ApiResponse<InterviewSearchResult>> {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v != null && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString();

    return api.get(`/interviews?${queryString}`);
  },

  // Get upcoming interviews
  async getUpcomingInterviews(): Promise<ApiResponse<Interview[]>> {
    return api.get("/interviews/upcoming");
  },

  // Get statistics
  async getStatistics(): Promise<
    ApiResponse<{
      total: number;
      scheduled: number;
      completed: number;
      cancelled: number;
      upcoming: number;
    }>
  > {
    return api.get("/interviews/statistics");
  },

  // Bulk update status
  async bulkUpdateStatus(
    interviewIds: string[],
    newStatus: InterviewStatus,
    reason?: string
  ): Promise<ApiResponse<{ count: number }>> {
    return api.post("/interviews/bulk-update", {
      interviewIds,
      newStatus,
      reason,
    });
  },

  // Send reminder
  async sendReminder(id: string): Promise<ApiResponse<void>> {
    return api.post(`/interviews/${id}/send-reminder`);
  },
};