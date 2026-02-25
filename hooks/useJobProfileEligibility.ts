"use client";

import { useCallback, useEffect, useState } from "react";
import { jobEligibilityService } from "@/services/recruitment-services";
import type { JobProfileEligibilityDTO } from "@/types";

export function useJobProfileEligibility(params: {
  jobId: string | null;
  enabled: boolean; // only true for logged-in candidates
}) {
  const { jobId, enabled } = params;

  const [data, setData] = useState<JobProfileEligibilityDTO | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEligibility = useCallback(async () => {
    if (!enabled || !jobId) return;

    try {
      setLoading(true);
      const res = await jobEligibilityService.getEligibility(jobId);
      if (res.success && res.data) setData(res.data);
      else setData(null);
    } catch {
      // Fail open: do not block apply if API fails
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [enabled, jobId]);

  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  return { eligibility: data, loading, refetch: fetchEligibility };
}
