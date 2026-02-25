"use client";

import { useCallback, useState } from "react";
import { CreateJobDto, JobFormErrors, SalaryType } from "@/types";

export type ValidateMode = "DRAFT" | "SUBMIT";

const DEFAULT_FORM_DATA: CreateJobDto = {
  title: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  niceToHave: "",
  type: "FULL_TIME",
  experienceLevel: "MID_LEVEL",
  location: "",
  isRemote: false,
  salaryType: "NEGOTIABLE",
  salaryMin: undefined,
  salaryMax: undefined,
  specificSalary: undefined,
  currency: "KSH",
  companyId: "",
  categoryId: "",
  expiresAt: "",
  skillIds: [],
  domainIds: [],
};

function normalizeForApi(dto: CreateJobDto): any {
  const out: any = { ...dto };

  // Trim required core strings
  out.title = String(out.title ?? "").trim();
  out.description = String(out.description ?? "").trim();
  out.location = String(out.location ?? "").trim();
  out.companyId = String(out.companyId ?? "").trim();
  out.categoryId = String(out.categoryId ?? "").trim();
  out.expiresAt = String(out.expiresAt ?? "").trim();

  // Optional long fields -> null if empty
  out.responsibilities = String(out.responsibilities ?? "").trim() || null;
  out.requirements = String(out.requirements ?? "").trim() || null;
  out.benefits = String(out.benefits ?? "").trim() || null;
  out.niceToHave = String(out.niceToHave ?? "").trim() || null;

  // expiresAt is optional
  if (out.expiresAt === "") out.expiresAt = null;

  // companyId: for employer backend overwrites, but for admins we must send it
  if (out.companyId === "") out.companyId = null;

  // salary numbers
  const toIntOrNull = (x: any) => {
    if (x === "" || x === undefined || x === null) return null;
    const n = Number(x);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  };
  out.salaryMin = toIntOrNull(out.salaryMin);
  out.salaryMax = toIntOrNull(out.salaryMax);
  out.specificSalary = toIntOrNull(out.specificSalary);

  // arrays
  out.skillIds = Array.isArray(out.skillIds) ? out.skillIds : [];
  out.domainIds = Array.isArray(out.domainIds) ? out.domainIds : [];

  return out;
}

function isAdminRole(role?: string) {
  return (
    role === "SUPER_ADMIN" || role === "HR_MANAGER" || role === "MODERATOR"
  );
}

export function useJobForm(initialData?: Partial<CreateJobDto>) {
  const [formData, setFormData] = useState<CreateJobDto>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
    companyId: (initialData?.companyId ?? DEFAULT_FORM_DATA.companyId) as any,
    categoryId: (initialData?.categoryId ??
      DEFAULT_FORM_DATA.categoryId) as any,
    expiresAt: (initialData?.expiresAt ?? DEFAULT_FORM_DATA.expiresAt) as any,
  });

  const [errors, setErrors] = useState<JobFormErrors>({} as JobFormErrors);

  const updateField = useCallback(
    <K extends keyof CreateJobDto>(field: K, value: CreateJobDto[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field as keyof JobFormErrors];
        return copy;
      });
    },
    [],
  );

  const updateMultipleFields = useCallback((updates: Partial<CreateJobDto>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
      companyId: (updates.companyId ?? prev.companyId ?? "") as any,
      categoryId: (updates.categoryId ?? prev.categoryId ?? "") as any,
      expiresAt: (updates.expiresAt ?? prev.expiresAt ?? "") as any,
    }));

    setErrors((prev) => {
      const copy = { ...prev };
      Object.keys(updates).forEach(
        (key) => delete copy[key as keyof JobFormErrors],
      );
      return copy;
    });
  }, []);

  const validateForm = useCallback(
    (userRole?: string, mode: ValidateMode = "SUBMIT"): boolean => {
      const e: JobFormErrors = {} as JobFormErrors;

      // Always required
      if (!formData.title?.trim()) e.title = "Job title is required";
      else if (formData.title.trim().length < 3)
        e.title = "Job title must be at least 3 characters";
      else if (formData.title.trim().length > 200)
        e.title = "Job title must not exceed 200 characters";

      if (!String(formData.categoryId || "").trim())
        e.categoryId = "Category is required";

      if (!formData.description?.trim())
        e.description = "Description is required ";
      if (!formData.location?.trim()) e.location = "Location is required ";

      if (isAdminRole(userRole)) {
        if (!String(formData.companyId || "").trim())
          e.companyId = "Company is required";
      }

      // Draft stops here
      if (mode === "DRAFT") {
        setErrors(e);
        return Object.keys(e).length === 0;
      }

      // Submit-only stricter rules
      if (
        formData.description?.trim() &&
        formData.description.trim().length < 50
      ) {
        e.description = "Description must be at least 50 characters";
      }

      // Deadline required on submit
      if (!String(formData.expiresAt || "").trim()) {
        e.expiresAt = "Application deadline is required";
      } else {
        const expiryDate = new Date(String(formData.expiresAt));
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        if (expiryDate < tomorrow)
          e.expiresAt = "Deadline must be at least tomorrow";
      }

      // Salary rules (submit only)
      if (formData.salaryType === "RANGE") {
        if (!formData.salaryMin || formData.salaryMin <= 0)
          e.salaryMin = "Minimum salary must be greater than 0";
        if (!formData.salaryMax || formData.salaryMax <= 0)
          e.salaryMax = "Maximum salary must be greater than 0";
        if (
          formData.salaryMin &&
          formData.salaryMax &&
          formData.salaryMin >= formData.salaryMax
        ) {
          e.salaryMax = "Maximum salary must be greater than minimum";
        }
      }

      if (formData.salaryType === "SPECIFIC") {
        if (!formData.specificSalary || formData.specificSalary <= 0) {
          e.specificSalary = "Salary amount must be greater than 0";
        }
      }

      setErrors(e);
      return Object.keys(e).length === 0;
    },
    [formData],
  );

  const buildPayload = useCallback(
    (isDraft: boolean) => {
      const normalized = normalizeForApi(formData);
      return { ...normalized, isDraft };
    },
    [formData],
  );

  const formatSalaryDisplay = useCallback((): string => {
    const currency = formData.currency || "KSH";
    switch (formData.salaryType as SalaryType) {
      case "RANGE":
        return formData.salaryMin && formData.salaryMax
          ? `${currency} ${formData.salaryMin.toLocaleString()} - ${formData.salaryMax.toLocaleString()}`
          : "Salary range not set";
      case "SPECIFIC":
        return formData.specificSalary
          ? `${currency} ${formData.specificSalary.toLocaleString()}`
          : "Salary not set";
      case "NEGOTIABLE":
        return "Negotiable";
      case "NOT_DISCLOSED":
        return "Competitive Salary";
      default:
        return "Not specified";
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({} as JobFormErrors);
  }, []);

  return {
    formData,
    errors,
    updateField,
    updateMultipleFields,
    validateForm,
    resetForm,
    formatSalaryDisplay,
    buildPayload,
  };
}
