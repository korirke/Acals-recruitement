import type { ProfileRequirementKey } from "@/types";

export const PROFILE_REQUIREMENT_LABELS: Record<ProfileRequirementKey, string> =
  {
    BASIC_PHONE: "Phone number",
    BASIC_LOCATION: "Location",
    BASIC_BIO: "Professional bio (min 50 characters)",
    BASIC_TITLE: "Professional title",
    RESUME: "Resume/CV uploaded",
    SKILLS: "Skills",
    EXPERIENCE: "Work experience",
    EDUCATION: "Education",
    PERSONAL_INFO: "Personal information (DOB, ID, nationality, county)",
    CLEARANCES: "Statutory clearances",
    MEMBERSHIPS: "Professional memberships",
    PUBLICATIONS: "Publications",
    COURSES: "Courses / trainings",
    REFEREES: "Referees",
    DOCUMENT_NATIONAL_ID: "National ID document",
    DOCUMENT_ACADEMIC_CERT: "Academic certificates",
    DOCUMENT_PROFESSIONAL_CERT: "Professional certificates",
  };
