import { api } from "@/lib/apiClient";
import type {
  CandidateProfile,
  Application,
  ApplicationStats,
  Skill,
  Domain,
  ApplicationStatus,
} from "@/types/recruitment/candidate.types";
import type { ApiResponse } from "@/types/api/common.types";

export const candidateService = {
  // Profile Management
  async getProfile(params?: { include?: string[] }): Promise<ApiResponse<CandidateProfile>> {
    const include = params?.include?.length
      ? `?include=${encodeURIComponent(params.include.join(","))}`
      : "";
    return api.get(`/candidate/profile${include}`);
  },

  async updateProfile(
    data: Partial<CandidateProfile>,
  ): Promise<ApiResponse<CandidateProfile>> {
    return api.put("/candidate/profile", data);
  },

  // Resume Management
  async uploadResume(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/candidate/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Skills Management
  async addSkill(data: {
    skillName: string;
    level?: string;
    yearsOfExp?: number;
  }): Promise<ApiResponse<any>> {
    return api.post("/candidate/skills", data);
  },

  async removeSkill(skillId: string): Promise<ApiResponse<any>> {
    return api.delete(`/candidate/skills/${skillId}`);
  },

  async getAvailableSkills(): Promise<ApiResponse<Skill[]>> {
    return api.get("/candidate/skills/available");
  },

  // Domains Management
  async addDomain(data: {
    domainId: string;
    isPrimary?: boolean;
  }): Promise<ApiResponse<any>> {
    return api.post("/candidate/domains", data);
  },

  async removeDomain(domainId: string): Promise<ApiResponse<any>> {
    return api.delete(`/candidate/domains/${domainId}`);
  },

  async getAvailableDomains(): Promise<ApiResponse<Domain[]>> {
    return api.get("/candidate/domains/available");
  },

  // Education Management
  async addEducation(data: any): Promise<ApiResponse<any>> {
    return api.post("/candidate/education", data);
  },

  async updateEducation(
    educationId: string,
    data: any,
  ): Promise<ApiResponse<any>> {
    return api.put(`/candidate/education/${educationId}`, data);
  },

  async deleteEducation(educationId: string): Promise<ApiResponse<any>> {
    return api.delete(`/candidate/education/${educationId}`);
  },

  // Experience Management
  async addExperience(data: any): Promise<ApiResponse<any>> {
    return api.post("/candidate/experience", data);
  },

  async updateExperience(
    experienceId: string,
    data: any,
  ): Promise<ApiResponse<any>> {
    return api.put(`/candidate/experience/${experienceId}`, data);
  },

  async deleteExperience(experienceId: string): Promise<ApiResponse<any>> {
    return api.delete(`/candidate/experience/${experienceId}`);
  },

  // Applications
  async applyToJob(data: {
    jobId: string;
    coverLetter?: string;
    resumeUrl?: string;
    portfolioUrl?: string;
  }): Promise<ApiResponse<Application>> {
    return api.post("/candidate/applications/apply", data);
  },

  // Applications with filtering
  async getApplications(params?: {
    status?: ApplicationStatus;
    jobId?: string;
  }): Promise<
    ApiResponse<{ applications: Application[]; stats: ApplicationStats }>
  > {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.jobId) queryParams.append("jobId", params.jobId);

    const queryString = queryParams.toString();
    const url = `/candidate/applications${
      queryString ? `?${queryString}` : ""
    }`;

    return api.get(url);
  },

  async getApplication(
    applicationId: string,
  ): Promise<ApiResponse<Application>> {
    return api.get(`/candidate/applications/${applicationId}`);
  },

  async withdrawApplication(applicationId: string): Promise<ApiResponse<any>> {
    return api.post(`/candidate/applications/${applicationId}/withdraw`);
  },

  // Personal Info
  async getPersonalInfo() {
    return api.get("/candidate/personal-info");
  },
  async upsertPersonalInfo(data: any) {
    return api.put("/candidate/personal-info", data);
  },

  // Publications
  async addPublication(data: any) {
    return api.post("/candidate/publications", data);
  },
  async updatePublication(id: string, data: any) {
    return api.put(`/candidate/publications/${id}`, data);
  },
  async deletePublication(id: string) {
    return api.delete(`/candidate/publications/${id}`);
  },

  // Memberships
  async addMembership(data: any) {
    return api.post("/candidate/memberships", data);
  },
  async updateMembership(id: string, data: any) {
    return api.put(`/candidate/memberships/${id}`, data);
  },
  async deleteMembership(id: string) {
    return api.delete(`/candidate/memberships/${id}`);
  },

  // Clearances
  async addClearance(data: any) {
    return api.post("/candidate/clearances", data);
  },
  async updateClearance(id: string, data: any) {
    return api.put(`/candidate/clearances/${id}`, data);
  },
  async deleteClearance(id: string) {
    return api.delete(`/candidate/clearances/${id}`);
  },

  // Courses
  async addCourse(data: any) {
    return api.post("/candidate/courses", data);
  },
  async updateCourse(id: string, data: any) {
    return api.put(`/candidate/courses/${id}`, data);
  },
  async deleteCourse(id: string) {
    return api.delete(`/candidate/courses/${id}`);
  },

  // Referees
  async addReferee(data: any) {
    return api.post("/candidate/referees", data);
  },
  async updateReferee(id: string, data: any) {
    return api.put(`/candidate/referees/${id}`, data);
  },
  async deleteReferee(id: string) {
    return api.delete(`/candidate/referees/${id}`);
  },

  // Candidate files
  async uploadCandidateFile(params: {
    file: File;
    category: string;
    title?: string;
  }) {
    const form = new FormData();
    form.append("file", params.file);
    form.append("category", params.category);
    if (params.title) form.append("title", params.title);

    return api.post("/candidate/files/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  async listCandidateFiles(category?: string) {
    const url = category
      ? `/candidate/files?category=${encodeURIComponent(category)}`
      : "/candidate/files";
    return api.get(url);
  },
  async deleteCandidateFile(fileId: string) {
    return api.delete(`/candidate/files/${fileId}`);
  },
};
