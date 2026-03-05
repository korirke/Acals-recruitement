"use client";

/**
 * SpecificExperienceSection
 * Thin wrapper around ExperienceSection that applies the "Specific Experience"
 * label and passes through the admin-configured description text.
 *
 * Note: stores experience entries under the same `experiences` table — the
 * "specific" distinction is communicative (shown to the candidate via
 * description text), not a separate DB table.
 */
import ExperienceSection from "./ExperienceSection";

interface Props {
  initialExperience?: any[];
  description?: string;
  onCountChange?: (count: number) => void;
}

export default function SpecificExperienceSection({ initialExperience, description, onCountChange }: Props) {
  return (
    <ExperienceSection
      initialExperience={initialExperience}
      sectionTitle="Specific Experience"
      description={description}
      onCountChange={onCountChange}
    />
  );
}