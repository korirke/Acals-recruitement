import { useState, useEffect, useCallback } from "react";
import { candidateService } from "@/services/recruitment-services";
import { useAuth } from "@/context/AuthContext";
import type { CandidateProfile } from "@/types";

export function useCandidateProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (force = false) => {
    if (!isAuthenticated || user?.role !== "CANDIDATE") {
      setLoading(false);
      return null;
    }

    if (profile && !force) {
      setLoading(false);
      return profile;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await candidateService.getProfile();

      if (response.success && response.data) {
        setProfile(response.data);
        return response.data;
      }

      return null;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch profile";
      setError(errorMessage);
      console.error("Profile fetch error:", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, profile]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "CANDIDATE") {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const refreshProfile = useCallback(() => {
    return fetchProfile(true);
  }, [fetchProfile]);

  const updateProfileCache = useCallback((updatedProfile: CandidateProfile) => {
    setProfile(updatedProfile);
  }, []);

  const clearProfileCache = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  return {
    profile,
    loading,
    error,
    refreshProfile,
    updateProfileCache,
    clearProfileCache,
  };
}
