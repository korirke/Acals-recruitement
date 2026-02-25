export type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE"
  | "TEMPORARY";

export type ExperienceLevel =
  | "ENTRY_LEVEL"
  | "MID_LEVEL"
  | "SENIOR_LEVEL"
  | "LEAD_PRINCIPAL"
  | "EXECUTIVE";

export type JobStatus =
  | "DRAFT"
  | "PENDING"
  | "ACTIVE"
  | "CLOSED"
  | "ARCHIVED"
  | "REJECTED";

export type SalaryType = "RANGE" | "SPECIFIC" | "NEGOTIABLE" | "NOT_DISCLOSED";

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  niceToHave?: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  isRemote: boolean;
  salaryType: SalaryType;
  salaryMin?: number;
  salaryMax?: number;
  specificSalary?: number;
  currency: string;
  status: JobStatus;
  featured: boolean;
  sponsored: boolean;
  views: number;
  applicationCount: number;
  publishedAt?: string;
  expiresAt?: string;
  closedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  categoryId: string;
  postedById: string;
  company: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    location?: string;
    description?: string;
    website?: string;
    industry?: string;
    companySize?: string;
    verified?: boolean;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  postedBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  skills?: Array<{
    id: string;
    skillId: string;
    required: boolean;
    skill: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  domains?: Array<{
    id: string;
    domainId: string;
    domain: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  _count?: {
    applications: number;
  };
}

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  jobCount: number;
  isActive: boolean;
}

export interface CreateJobDto {
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  niceToHave?: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  isRemote?: boolean;
  salaryType: SalaryType;
  salaryMin?: number;
  salaryMax?: number;
  specificSalary?: number;
  currency?: string;
  companyId?: string; // Optional for EMPLOYER (auto-assigned)
  categoryId: string;
  expiresAt?: string;
  skillIds?: string[];
  domainIds?: string[];
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}

export interface JobSearchParams {
  query?: string;
  location?: string;
  type?: JobType;
  experienceLevel?: ExperienceLevel;
  categoryId?: string;
  status?: JobStatus;
  page?: number;
  limit?: number;
}

export interface JobSearchResult {
  jobs: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form validation schemas
export interface JobFormErrors {
  type: any;
  experienceLevel: any;
  title?: string;
  description?: string;
  companyId?: string;
  categoryId?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  specificSalary?: string;
  expiresAt?: string;
}

// Display helpers
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
  TEMPORARY: "Temporary",
};

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  ENTRY_LEVEL: "Entry Level (0-2 years)",
  MID_LEVEL: "Mid Level (2-5 years)",
  SENIOR_LEVEL: "Senior Level (5-10 years)",
  LEAD_PRINCIPAL: "Lead/Principal (10+ years)",
  EXECUTIVE: "Executive",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  DRAFT: "Draft",
  PENDING: "Pending Approval",
  ACTIVE: "Active",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
  REJECTED: "Rejected",
};

export const SALARY_TYPE_LABELS: Record<SalaryType, string> = {
  RANGE: "Salary Range",
  SPECIFIC: "Specific Amount",
  NEGOTIABLE: "Negotiable",
  NOT_DISCLOSED: "Not Disclosed",
};
