export type JobEditorSection = "basic" | "location" | "salary" | "content";

export function sectionForField(field: string): JobEditorSection {
  if (["title", "companyId", "categoryId", "type", "experienceLevel"].includes(field)) return "basic";
  if (["location", "isRemote", "expiresAt"].includes(field)) return "location";
  if (["salaryType", "salaryMin", "salaryMax", "specificSalary", "currency", "benefits"].includes(field)) return "salary";
  return "content";
}

export function countErrorsBySection(errors: Record<string, string>) {
  const counts: Record<JobEditorSection, number> = { basic: 0, location: 0, salary: 0, content: 0 };
  for (const k of Object.keys(errors || {})) counts[sectionForField(k)] += 1;
  return counts;
}

export function firstErrorField(errors: Record<string, string>) {
  const keys = Object.keys(errors || {});
  return keys.length ? keys[0] : null;
}

export function scrollToField(field: string) {
  const el = document.getElementById(field);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // @ts-ignore
  el.focus?.();
}