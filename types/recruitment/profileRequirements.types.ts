// ─── Profile requirement keys ────────
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
  | "DOCUMENT_PROFESSIONAL_CERT"
  | "DOCUMENT_DRIVING_LICENSE";

export interface JobProfileRequirementsDTO {
  jobId: string;
  requirementKeys: ProfileRequirementKey[];
  config?: JobApplicationConfigDTO;
}

export interface JobProfileEligibilityDTO {
  isEligible: boolean;
  completedCount: number;
  totalRequired: number;
  missingKeys: ProfileRequirementKey[];
  completionPercentage: number;
}

// ─── Education level keys ────────────
/**
 * Canonical education level keys.
 * These match `education_qualification_levels.key` in the DB.
 *
 * POST_GRADUATE_DIPLOMA is the canonical key
 *
 * Admin may add custom levels via the settings UI; those will be `string`
 * values not captured in this union type. Use `string` wherever dynamic
 * levels must be supported.
 */
export type EducationLevelKey =
  | "KCPE"
  | "KCSE"
  | "A_LEVEL"
  | "CERTIFICATE"
  | "POST_GRADUATE_DIPLOMA"
  | "DIPLOMA"
  | "BACHELORS"
  | "MASTERS"
  | "PHD"
  | "OTHER";

/**
 * Static fallback labels — used when the API hasn't responded yet.
 * Authoritative labels live in `education_qualification_levels.label` in the DB.
 */
export const EDUCATION_LEVEL_LABELS: Record<EducationLevelKey, string> = {
  KCPE: "KCPE (Kenya Certificate of Primary Education)",
  KCSE: "KCSE (Kenya Certificate of Secondary Education)",
  A_LEVEL: "A-Level / Form 6",
  CERTIFICATE: "Certificate",
  POST_GRADUATE_DIPLOMA: "Postgraduate Diploma",
  DIPLOMA: "Diploma",
  BACHELORS: "Bachelor's Degree",
  MASTERS: "Master's Degree",
  PHD: "Doctor of Philosophy (PhD)",
  OTHER: "Other",
};

// ─── Dynamic qualification level (from DB)
export interface QualificationLevelDTO {
  id: string;
  key: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
  isSystem: boolean;
}

// ─── Section keys for form ordering ─
export type SectionKey =
  | "basic"
  | "questionnaire"
  | "skills"
  | "experience_general"
  | "experience_specific"
  | "education"
  | "personal_info"
  | "publications"
  | "memberships"
  | "clearances"
  | "courses"
  | "referees"
  | "documents";

export const SECTION_LABELS: Record<SectionKey, string> = {
  basic: "Basic Information",
  questionnaire: "Screening Questions",
  skills: "Skills",
  experience_general: "General Work Experience",
  experience_specific: "Specific Experience",
  education: "Education",
  personal_info: "Personal Information",
  publications: "Publications",
  memberships: "Professional Memberships",
  clearances: "Statutory Clearances",
  courses: "Courses & Training",
  referees: "Referees",
  documents: "Document Uploads",
};

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "basic",
  "questionnaire",
  "skills",
  "experience_general",
  "experience_specific",
  "education",
  "personal_info",
  "publications",
  "memberships",
  "clearances",
  "courses",
  "referees",
  "documents",
];

// ─── Job application config DTO ──────
export interface JobApplicationConfigDTO {
  refereesRequired: number;
  /** Keys from education_qualification_levels.key */
  requiredEducationLevels: string[];
  generalExperienceText: string;
  specificExperienceText: string;
  showGeneralExperience: boolean;
  showSpecificExperience: boolean;
  sectionOrder: SectionKey[];
  showDescription: boolean;
}

// ─── Section editor config ────────────
export interface SectionEditorConfig {
  sectionKey: SectionKey;
  label: string;
  required: boolean;
  requirementKeys: ProfileRequirementKey[];
  refereesCount?: number;
  requiredEducationLevels?: string[];
  generalExpText?: string;
  specificExpText?: string;
  showGeneralExp?: boolean;
  showSpecificExp?: boolean;
}
