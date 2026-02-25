import { api } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api/common.types";

export interface ApplicationPipelineFormData {
  jobId: string;
  basic?: {
    title?: string;
    location?: string;
    bio?: string;
    phone?: string;
    portfolioUrl?: string;
  };
  skills?: Array<{
    skillName: string;
    level?: string;
    yearsOfExp?: number;
  }>;
  experience?: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    grade?: string;
    description?: string;
  }>;
  personalInfo?: {
    fullName: string;
    dob: string;
    gender: "M" | "F" | "Other";
    idNumber: string;
    nationality: string;
    countyOfOrigin: string;
    plwd?: boolean;
  };
  publications?: Array<{
    title: string;
    type: string;
    journalOrPublisher?: string;
    year: number;
    link?: string;
  }>;
  memberships?: Array<{
    bodyName: string;
    membershipNumber?: string;
    isActive?: boolean;
    goodStanding?: boolean;
  }>;
  clearances?: Array<{
    type: string;
    certificateNumber?: string;
    issueDate: string;
    expiryDate?: string;
    status?: "VALID" | "EXPIRED" | "PENDING";
  }>;
  courses?: Array<{
    name: string;
    institution: string;
    durationWeeks: number;
    year: number;
  }>;
  referees?: Array<{
    name: string;
    position?: string;
    organization?: string;
    phone?: string;
    email?: string;
  }>;
  coverLetter: string;
  portfolioUrl?: string;
  expectedSalary: string;
  availableStartDate: string;
  privacyConsent: boolean;
}

export interface ApplicationPipelineData {
  job: {
    id: string;
    title: string;
    companyId: string;
  };
  eligibility: {
    isEligible: boolean;
    completedCount: number;
    totalRequired: number;
    missingKeys: string[];
    completionPercentage: number;
  };
  profileSnapshot: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
    basic: {
      title?: string;
      location?: string;
      bio?: string;
      portfolioUrl?: string;
    };
    skills: Array<{
      id: string;
      name: string;
      level?: string;
      yearsOfExp?: number;
    }>;
    experience: Array<{
      id: string;
      title: string;
      company: string;
      location?: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      description?: string;
    }>;
    education: Array<{
      id: string;
      degree: string;
      institution: string;
      fieldOfStudy: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      grade?: string;
      description?: string;
    }>;
    personalInfo?: {
      fullName: string;
      dob: string;
      gender: "M" | "F" | "Other";
      idNumber: string;
      nationality: string;
      countyOfOrigin: string;
      plwd: boolean;
    };
    publications: Array<{
      id: string;
      title: string;
      type: string;
      journalOrPublisher?: string;
      year: number;
      link?: string;
    }>;
    memberships: Array<{
      id: string;
      bodyName: string;
      membershipNumber?: string;
      isActive: boolean;
      goodStanding: boolean;
    }>;
    clearances: Array<{
      id: string;
      type: string;
      certificateNumber?: string;
      issueDate: string;
      expiryDate?: string;
      status: string;
    }>;
    courses: Array<{
      id: string;
      name: string;
      institution: string;
      durationWeeks: number;
      year: number;
    }>;
    referees: Array<{
      id: string;
      name: string;
      position?: string;
      organization?: string;
      phone?: string;
      email?: string;
    }>;
    files: Array<{
      id: string;
      category: string;
      fileName: string;
      fileUrl: string;
    }>;
    resumeUrl?: string;
  };
  requirements: string[];
}

export const jobApplicationPipelineService = {
  async getFormData(jobId: string): Promise<ApiResponse<ApplicationPipelineData>> {
    return api.get(`/jobs/${jobId}/application-pipeline`);
  },

  async submitWithInlineUpdates(
    jobId: string,
    data: ApplicationPipelineFormData
  ): Promise<ApiResponse<{ applicationId: string }>> {
    return api.post(`/jobs/${jobId}/application-pipeline/submit`, data);
  },
};
