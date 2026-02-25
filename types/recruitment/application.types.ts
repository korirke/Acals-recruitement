export interface ApplicationForEmployer {
  id: string;
  jobId: string;
  candidateId: string;
  status: string;
  coverLetter?: string;
  resumeUrl?: string;
  portfolioUrl?: string;

  expectedSalary?: string;
  privacyConsent: boolean;
  availableStartDate?: string;

  notes?: string;
  internalNotes?: string;
  rating?: number;
  appliedAt: string;
  reviewedAt?: string;
  updatedAt: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
    candidateProfile?: {
      title?: string;
      location?: string;
      experienceYears?: string;
      resumeUrl?: string;
      educations?: any[];
      experiences?: any[];
      domains?: Array<{
        domain: {
          id: string;
          name: string;
        };
        isPrimary: boolean;
      }>;
      skills?: Array<{
        skill: {
          id: string;
          name: string;
        };
        level?: string;
      }>;
    };
  };
  job: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
      logo?: string;
    };
  };
  statusHistory?: Array<{
    id: string;
    fromStatus?: string;
    toStatus: string;
    changedAt: string;
    reason?: string;
  }>;
}

export interface ApplicationStatistics {
  total: number;
  pending: number;
  reviewed: number;
  shortlisted: number;
  interview: number;
  offered: number;
  accepted: number;
  rejected: number;
  withdrawn?: number;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  interviewApplications: number;
}

export interface CandidateFullProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  candidateProfile: any;
}

export interface ApplicationForInterview {
  id: string;
  jobId: string;
  candidateId: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  job: {
    id: string;
    title: string;
  };
}

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