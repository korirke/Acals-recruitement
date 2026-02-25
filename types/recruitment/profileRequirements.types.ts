export type ProfileRequirementKey =
  | "BASIC_PHONE"
  | "BASIC_LOCATION"
  | "BASIC_BIO"
  | "BASIC_TITLE"
  | "RESUME"
  | "SKILLS"
  | "EXPERIENCE"
  | "EDUCATION"
  | "PERSONAL_INFO"
  | "CLEARANCES"
  | "MEMBERSHIPS"
  | "PUBLICATIONS"
  | "COURSES"
  | "REFEREES"
  | "DOCUMENT_NATIONAL_ID"
  | "DOCUMENT_ACADEMIC_CERT"
  | "DOCUMENT_PROFESSIONAL_CERT";

export interface JobProfileRequirementsDTO {
  jobId: string;
  requirementKeys: ProfileRequirementKey[];
}

export interface JobProfileEligibilityDTO {
  isEligible: boolean;
  completedCount: number;
  totalRequired: number;
  missingKeys: ProfileRequirementKey[];
  completionPercentage: number;
}