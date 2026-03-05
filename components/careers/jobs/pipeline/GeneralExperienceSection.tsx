"use client";

/**
 * GeneralExperienceSection
 * Thin wrapper around ExperienceSection that applies the "General Work Experience"
 * label and passes through the admin-configured description text.
 */
import ExperienceSection from "./ExperienceSection";

interface Props {
  initialExperience?: any[];
  description?: string;
  onCountChange?: (count: number) => void;
}

export default function GeneralExperienceSection({
  initialExperience,
  description,
  onCountChange,
}: Props) {
  return (
    <ExperienceSection
      initialExperience={initialExperience}
      sectionTitle="General Work Experience"
      description={description}
      onCountChange={onCountChange}
    />
  );
}
