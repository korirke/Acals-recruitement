export enum CompanyStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export interface SocialLinks {
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  website?: string | null;
  email: string;
  phone?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  location?: string;
  industry: string;
  companySize: string;
  socialLinks?: SocialLinks | null;
  status: CompanyStatus;
  verified: boolean;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    jobs: number;
    employerProfiles: number;
  };
}

export interface CreateCompanyDto {
  name: string;
  description?: string | null;
  website?: string | null;
  email: string;
  phone?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  location?: string;
  industry: string;
  companySize: string;
  socialLinks?: SocialLinks | null;
  title?: string | null;
  department?: string | null;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {}

export interface CompanyFiltersDto {
  status?: CompanyStatus;
  search?: string;
  industry?: string;
}

export interface VerifyCompanyDto {
  status: CompanyStatus.VERIFIED | CompanyStatus.REJECTED;
  reason?: string;
}

export interface CompanyStats {
  activeJobs: number;
  totalJobs: number;
  totalApplications: number;
  recentApplications: Array<{
    id: string;
    appliedAt: Date;
    status: string;
    candidate: {
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string | null;
    };
    job: {
      title: string;
      slug: string;
    };
  }>;
}
