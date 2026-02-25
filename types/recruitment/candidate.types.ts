export interface CandidateProfile {
  id: string;
  userId: string;
  title?: string;
  bio?: string;
  location?: string;
  currentCompany?: string;
  experienceYears?: string;
  expectedSalary?: number;
  currency?: string;
  openToWork: boolean;
  availableFrom?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  resumeUpdatedAt?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  skills?: CandidateSkill[];
  domains?: CandidateDomain[];
  educations?: Education[];
  experiences?: Experience[];
  certifications?: Certification[];
  languages?: CandidateLanguage[];
  resumes?: ResumeVersion[];
  personalInfo?: CandidatePersonalInfo;
  publications?: CandidatePublication[];
  memberships?: CandidateMembership[];
  clearances?: CandidateClearance[];
  courses?: CandidateCourse[];
  referees?: CandidateReferee[];
  files?: CandidateFile[];
}

export interface CandidateSkill {
  id: string;
  skill: {
    id: string;
    name: string;
    slug: string;
  };
  level?: string;
  yearsOfExp?: number;
}

export interface CandidateDomain {
  id: string;
  domain: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  isPrimary: boolean;
}

export type DegreeLevel =
  | "CERTIFICATE"
  | "DIPLOMA"
  | "BACHELORS"
  | "MASTERS"
  | "PHD"
  | "OTHER";

export interface Education {
  id: string;
  degree: string;
  degreeLevel?: DegreeLevel | null;
  fieldOfStudy: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  description?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CandidateLanguage {
  id: string;
  language: {
    id: string;
    name: string;
    code: string;
  };
  proficiency: string;
}

export interface ResumeVersion {
  id: string;
  version: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  coverLetter?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  status: string;
  notes?: string;
  rating?: number;
  appliedAt: string;
  reviewedAt?: string;
  updatedAt: string;
  expectedSalary?: number;
  privacyConsent?: string;
  availableStartDate?: string;
  job: {
    id: string;
    title: string;
    slug: string;
    description: string;
    type: string;
    location: string;
    salaryType: string;
    salaryMin?: number;
    salaryMax?: number;
    status: string;
    company: {
      id: string;
      name: string;
      logo?: string;
      location?: string;
    };
    category: {
      id: string;
      name: string;
    };
  };
  statusHistory?: ApplicationStatusHistory[];
}

export type ApplicationStatus =
  | "PENDING"
  | "REVIEWED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "INTERVIEWED"
  | "OFFERED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface ApplicationStatusHistory {
  id: string;
  fromStatus?: string;
  toStatus: string;
  changedAt: string;
  reason?: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  reviewed: number;
  shortlisted: number;
  interview: number;
  offered: number;
  accepted: number;
  rejected: number;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category?: string;
}

export interface Domain {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  children?: Domain[];
}
export type CandidateFileCategory =
  | "NATIONAL_ID"
  | "CV"
  | "ACADEMIC_CERT"
  | "PROFESSIONAL_CERT"
  | "TESTIMONIAL"
  | "CLEARANCE_CERT"
  | "PUBLICATION_EVIDENCE"
  | "OTHER";

export interface CandidatePersonalInfo {
  id: string;
  fullName: string;
  dob: string;
  gender: "M" | "F" | "Other";
  idNumber: string;
  nationality: string;
  countyOfOrigin: string;
  plwd: boolean;
}

export interface CandidatePublication {
  id: string;
  title: string;
  type: string;
  journalOrPublisher?: string;
  year: number;
  link?: string;
}

export interface CandidateMembership {
  id: string;
  bodyName: string;
  membershipNumber?: string;
  isActive: boolean;
  goodStanding: boolean;
}

export interface CandidateClearance {
  id: string;
  type: string;
  certificateNumber?: string;
  issueDate: string;
  expiryDate?: string;
  status: "VALID" | "EXPIRED" | "PENDING";
}

export interface CandidateCourse {
  id: string;
  name: string;
  institution: string;
  durationWeeks: number;
  year: number;
}

export interface CandidateReferee {
  id: string;
  name: string;
  position?: string;
  organization?: string;
  phone?: string;
  email?: string;
}

export interface CandidateFile {
  id: string;
  category: CandidateFileCategory;
  title?: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  fileSize?: number;
  createdAt?: string;
}
