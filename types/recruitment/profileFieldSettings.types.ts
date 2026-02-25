
export type ProfileFieldCategory =
  | "basic"
  | "social"
  | "skills"
  | "education"
  | "experience"
  | "resume"
  | "compliance";

export interface ProfileFieldSetting {
  id: string;
  fieldName: string;
  label: string;
  description?: string | null;
  category: ProfileFieldCategory;
  isVisible: boolean;
  isRequired: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFieldSettingsPayload {
  settings: ProfileFieldSetting[];
  grouped: Record<string, ProfileFieldSetting[]>;
}
