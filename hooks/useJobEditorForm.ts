"use client";

import { useCallback, useMemo, useState } from "react";
import type { CreateJobDto, SalaryType } from "@/types";

export type EditorMode = "DRAFT" | "SUBMIT";

export type JobEditorErrors = Record<string, string>;

const DEFAULTS: CreateJobDto = {
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

export function useJobEditorForm(initial?: Partial<CreateJobDto>) {
  const [data, setData] = useState<CreateJobDto>({
    ...DEFAULTS,
    ...initial,
    companyId: (initial?.companyId ?? "") as any,
    expiresAt: (initial?.expiresAt ?? "") as any,
  });

  const [errors, setErrors] = useState<JobEditorErrors>({});
  const [baseline, setBaseline] = useState<string>(() =>
    JSON.stringify({ ...DEFAULTS, ...initial }),
  );

  const isDirty = useMemo(
    () => JSON.stringify(data) !== baseline,
    [data, baseline],
  );

  const setInitial = useCallback((fresh: Partial<CreateJobDto>) => {
    const merged: CreateJobDto = {
      ...DEFAULTS,
      ...fresh,
      companyId: (fresh.companyId ?? "") as any,
      expiresAt: (fresh.expiresAt ?? "") as any,
    };
    setData(merged);
    setErrors({});
    setBaseline(JSON.stringify(merged));
  }, []);

  const markSaved = useCallback(() => {
    setBaseline(JSON.stringify(data));
  }, [data]);

  const update = useCallback(
    <K extends keyof CreateJobDto>(key: K, value: CreateJobDto[K]) => {
      setData((p) => ({ ...p, [key]: value }));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[String(key)];
        return copy;
      });
    },
    [],
  );

  const validate = useCallback(
    (mode: EditorMode, userRole?: string) => {
      const e: JobEditorErrors = {};

      // Draft: title only (backend expectation)
      if (!data.title?.trim()) e.title = "Job title is required";
      else if (data.title.trim().length < 3)
        e.title = "Job title must be at least 3 characters";

      if (mode === "DRAFT") {
        setErrors(e);
        return Object.keys(e).length === 0;
      }

      // Submit: required fields
      if (!data.description?.trim())
        e.description = "Job description is required";
      else if (data.description.trim().length < 50)
        e.description = "Description must be at least 50 characters";

      if (!data.categoryId) e.categoryId = "Category is required";
      if (!data.location?.trim()) e.location = "Location is required";

      // Admin roles must select company
      if (
        userRole === "SUPER_ADMIN" ||
        userRole === "HR_MANAGER" ||
        userRole === "MODERATOR"
      ) {
        if (!String(data.companyId || "").trim())
          e.companyId = "Company is required";
      }

      // Submit requires deadline
      if (!String(data.expiresAt || "").trim()) {
        e.expiresAt = "Application deadline is required";
      } else {
        const expiry = new Date(String(data.expiresAt));
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        if (expiry < tomorrow)
          e.expiresAt = "Deadline must be at least tomorrow";
      }

      // Salary rules
      if (data.salaryType === "RANGE") {
        if (!data.salaryMin || data.salaryMin <= 0)
          e.salaryMin = "Minimum salary must be greater than 0";
        if (!data.salaryMax || data.salaryMax <= 0)
          e.salaryMax = "Maximum salary must be greater than 0";
        if (
          data.salaryMin &&
          data.salaryMax &&
          data.salaryMin >= data.salaryMax
        )
          e.salaryMax = "Maximum must be greater than minimum";
      }
      if (data.salaryType === "SPECIFIC") {
        if (!data.specificSalary || data.specificSalary <= 0)
          e.specificSalary = "Salary amount must be greater than 0";
      }

      setErrors(e);
      return Object.keys(e).length === 0;
    },
    [data],
  );

  const salaryPreview = useMemo(() => {
    const currency = data.currency || "KSH";
    switch (data.salaryType as SalaryType) {
      case "RANGE":
        return data.salaryMin && data.salaryMax
          ? `${currency} ${data.salaryMin.toLocaleString()} - ${data.salaryMax.toLocaleString()}`
          : "Salary range not set";
      case "SPECIFIC":
        return data.specificSalary
          ? `${currency} ${data.specificSalary.toLocaleString()}`
          : "Salary not set";
      case "NEGOTIABLE":
        return "Negotiable";
      case "NOT_DISCLOSED":
        return "Competitive salary";
      default:
        return "Not specified";
    }
  }, [data]);

  return {
    data,
    errors,
    update,
    validate,
    setInitial,
    isDirty,
    markSaved,
    salaryPreview,
  };
}
