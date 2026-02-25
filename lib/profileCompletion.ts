import type { CandidateProfile } from "@/types";

export interface ProfileCompletionStatus {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  requiredFields: {
    field: string;
    label: string;
    completed: boolean;
  }[];
}

/**
 * Optional 2nd arg supports your profile-field settings system without hard dependency.
 * Pass something like:
 *   [{ fieldName: "skills", isVisible: true }, { fieldName: "education", isVisible: false }]
 */
type FieldSettingLike = {
  fieldName: string;
  isVisible?: boolean;
  isRequired?: boolean;
};

export function checkCandidateProfileCompletion(
  profile: CandidateProfile | null,
  settings?: FieldSettingLike[],
): ProfileCompletionStatus {
  const map: Record<string, FieldSettingLike> = {};
  if (Array.isArray(settings)) {
    for (const s of settings) {
      if (s?.fieldName) map[s.fieldName] = s;
    }
  }

  const isVisible = (field: string) => map[field]?.isVisible ?? true;

  // original required checks
  const baseFields = [
    { field: "phone", label: "Phone Number" },
    { field: "location", label: "Location" },
    { field: "resume", label: "Resume/CV" },
    { field: "bio", label: "Professional Bio" },
    { field: "skills", label: "Skills" },
    { field: "experience", label: "Work Experience" },
    { field: "education", label: "Education" },
  ];

  // If settings hide a field, remove it from completion calculation
  const visibleFields = baseFields.filter((f) => isVisible(f.field));

  if (!profile) {
    const requiredFields = visibleFields.map((f) => ({
      field: f.field,
      label: f.label,
      completed: false,
    }));

    return {
      isComplete: false,
      completionPercentage: 0,
      missingFields: requiredFields.map((f) => f.label),
      requiredFields,
    };
  }

  const requiredFields = visibleFields.map((f) => {
    switch (f.field) {
      case "phone":
        return {
          field: "phone",
          label: "Phone Number",
          completed:
            !!profile.user?.phone && profile.user.phone.trim().length > 0,
        };

      case "location":
        return {
          field: "location",
          label: "Location",
          completed: !!profile.location && profile.location.trim().length > 0,
        };

      case "resume":
        return {
          field: "resume",
          label: "Resume/CV",
          completed: !!profile.resumeUrl,
        };

      case "bio":
        return {
          field: "bio",
          label: "Professional Bio",
          completed:
            !!profile.bio &&
            profile.bio.trim().length >= 50 &&
            profile.bio !== profile.title,
        };

      case "skills":
        return {
          field: "skills",
          label: "Skills",
          completed: Array.isArray(profile.skills) && profile.skills.length > 0,
        };

      case "experience":
        return {
          field: "experience",
          label: "Work Experience",
          completed:
            Array.isArray(profile.experiences) &&
            profile.experiences.length > 0,
        };

      case "education":
        return {
          field: "education",
          label: "Education",
          completed:
            Array.isArray(profile.educations) && profile.educations.length > 0,
        };

      default:
        return {
          field: f.field,
          label: f.label,
          completed: false,
        };
    }
  });

  const completedCount = requiredFields.filter((f) => f.completed).length;
  const totalFields = Math.max(requiredFields.length, 1);
  const completionPercentage = Math.round((completedCount / totalFields) * 100);

  const missingFields = requiredFields
    .filter((f) => !f.completed)
    .map((f) => f.label);

  const isComplete = completionPercentage >= 85;

  return {
    isComplete,
    completionPercentage,
    missingFields,
    requiredFields,
  };
}
