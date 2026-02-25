export interface ShortlistJob {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  companyName: string;
  companyLogo?: string;
  applicationCount: number;
  shortlistCount: number;
  hasCriteria: boolean;
  criteriaConfigured: boolean;
  isStale?: boolean;
  staleReason?: string;
}

export interface StaleCheckResult {
  isStale: boolean;
  reason: string;
  criteriaUpdatedAt?: string;
  shortlistGeneratedAt?: string;
}

export type ExportMode = "all" | "shortlistedOnly";

export interface ShortlistCriteria {
  id: string;
  jobId: string;

  minAge?: number;
  maxAge?: number;
  requiredGender?: string;
  requiredNationality?: string;
  specificCounties?: string[];
  acceptPLWD: boolean;
  requirePLWD: boolean;

  requireDoctorate: boolean;
  requireMasters: boolean;
  requireBachelors: boolean;
  specificDegreeFields?: string[];
  specificInstitutions?: string[];
  minEducationGrade?: string;

  minGeneralExperience: number;
  maxGeneralExperience?: number;
  minSeniorExperience: number;
  maxSeniorExperience?: number;
  specificIndustries?: string[];
  specificDomains?: string[];
  requireMNCExperience: boolean;
  requireStartupExperience: boolean;
  requireNGOExperience: boolean;
  requireGovernmentExperience: boolean;
  specificJobTitles?: string[];
  requireManagementExperience: boolean;
  minTeamSizeManaged?: number;
  requireCurrentlyEmployed: boolean;
  excludeCurrentlyEmployed: boolean;

  requiredSkills?: string[];
  preferredSkills?: string[];
  minSkillLevel?: string;
  specificLanguages?: string[];
  minLanguageProficiency?: string;

  requireProfessionalMembership: boolean;
  specificProfessionalBodies?: string[];
  requireGoodStanding: boolean;
  requiredCertifications?: string[];
  preferredCertifications?: string[];
  requireLeadershipCourse: boolean;
  minLeadershipCourseDuration: number;
  minPublications: number;
  specificPublicationTypes?: string[];
  requireRecentPublications: boolean;
  publicationYearsThreshold?: number;

  requireTaxClearance: boolean;
  requireHELBClearance: boolean;
  requireDCICClearance: boolean;
  requireCRBClearance: boolean;
  requireEACCClearance: boolean;
  requireAllClearancesValid: boolean;
  maxClearanceAge?: number;

  maxExpectedSalary?: number;
  minExpectedSalary?: number;
  requireImmediateAvailability: boolean;
  maxNoticePeriod?: number;
  acceptRemoteCandidates: boolean;
  requireOnSiteCandidates: boolean;
  specificLocations?: string[];

  requireReferees: boolean;
  minRefereeCount: number;
  requireSeniorReferees: boolean;
  requireAcademicReferees: boolean;

  requirePortfolio: boolean;
  requireGitHubProfile: boolean;
  requireLinkedInProfile: boolean;
  minPortfolioProjects?: number;

  excludeInternalCandidates: boolean;
  excludePreviousApplicants: boolean;
  requireDiversityHire: boolean;
  customCriteria?: any;

  educationWeight: number;
  experienceWeight: number;
  skillsWeight: number;
  clearanceWeight: number;
  professionalWeight: number;

  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShortlistResult {
  id: string;
  jobId: string;
  applicationId: string;
  candidateId: string;

  // System scores
  totalScore: number;
  educationScore: number;
  experienceScore: number;
  skillsScore: number;
  clearanceScore: number;
  professionalScore: number;

  // Manual scores (admin)
  manualTotalScore?: number | null;
  manualEducationScore?: number | null;
  manualExperienceScore?: number | null;
  manualSkillsScore?: number | null;
  manualClearanceScore?: number | null;
  manualProfessionalScore?: number | null;

  // Effective scores (computed backend)
  effectiveTotalScore?: number;
  effectiveEducationScore?: number;
  effectiveExperienceScore?: number;
  effectiveSkillsScore?: number;
  effectiveClearanceScore?: number;
  effectiveProfessionalScore?: number;

  // Audit flags
  auditFlag?: number; // 0/1
  scoreSource?: "SYSTEM" | "MANUAL";
  scoredBy?: string | null;
  scoredAt?: string | null;

  // Disqualification override
  overrideDisqualification?: number; // 0/1
  overrideDisqualificationBy?: string | null;
  overrideDisqualificationAt?: string | null;

  // Ranking
  candidateRank: number | null;
  percentile: number;

  // Analysis
  matchedCriteria: string[];
  missedCriteria: string[];
  bonusCriteria: string[];
  hasAllMandatory: boolean;
  hasDisqualifyingFactor: boolean;
  disqualificationReasons?: string[];

  // Derived
  isEffectivelyDisqualified?: boolean;

  // HR annotations
  hrNotes?: string;
  flaggedForReview: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  internalRating?: number;

  // Candidate Info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  experienceYears?: number;
  applicationStatus: string;
  expectedSalary?: string;

  // Metadata
  generatedAt: string;
  updatedAt: string;
}

export interface ShortlistStats {
  total: number;
  qualified: number;
  hasAllMandatory: number;
  disqualified: number;
  flaggedForReview: number;
  averageScore: number;
  medianScore: number;
  topScore: number;
  bottomScore: number;
  scoreDistribution: {
    "80-100": number;
    "60-79": number;
    "40-59": number;
    "0-39": number;
  };
}