"use client";

import { useState, useCallback } from "react";
import type { JobSearchParams } from "@/types";

export function useJobFilters(initialFilters?: Partial<JobSearchParams>) {
  const [filters, setFilters] = useState<JobSearchParams>({
    query: "",
    location: "",
    type: undefined,
    experienceLevel: undefined,
    categoryId: undefined,
    status: undefined,
    page: 1,
    limit: 20,
    ...initialFilters,
  });

  const updateFilter = useCallback((key: keyof JobSearchParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 on filter change
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      query: "",
      location: "",
      type: undefined,
      experienceLevel: undefined,
      categoryId: undefined,
      status: undefined,
      page: 1,
      limit: 20,
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    setPage,
  };
}
