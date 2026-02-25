"use client";

import { useState, useEffect, useCallback } from "react";
import { candidateService } from "@/services/recruitment-services";
import type {
  CandidateProfile,
  Application,
  ApplicationStats,
  ApplicationStatus,
  Skill,
  Domain,
} from "@/types";

// Profile Management Hook
export const useCandidate = () => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (params?: { include?: string[] }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await candidateService.getProfile(params);

      if (response.success && response.data) {
        setProfile(response.data);
        return response.data;
      }

      return null;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch profile";
      setError(errorMessage);
      console.error("Fetch profile error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<CandidateProfile>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await candidateService.updateProfile(data);

      if (response.success && response.data) {
        setProfile(response.data);
        return response.data;
      }

      throw new Error("Update failed");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadResume = useCallback(
    async (file: File) => {
      try {
        setLoading(true);
        setError(null);

        const response = await candidateService.uploadResume(file);

        if (response.success) {
          // refresh full profile by default (keeps backward behavior)
          await fetchProfile();
          return response.data;
        }

        throw new Error("Failed to upload resume");
      } catch (err: any) {
        const errorMessage = err.message || "Failed to upload resume";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile],
  );

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadResume,
  };
};

// Applications Management Hook
export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    interview: 0,
    offered: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(
    async (filters?: { status?: ApplicationStatus; jobId?: string }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await candidateService.getApplications(filters);

        if (response.success && response.data) {
          setApplications(response.data.applications || []);
          setStats(
            response.data.stats || {
              total: 0,
              pending: 0,
              reviewed: 0,
              shortlisted: 0,
              interview: 0,
              offered: 0,
              accepted: 0,
              rejected: 0,
            },
          );
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to fetch applications";
        console.error("Fetch applications error:", err);
        setError(errorMessage);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const applyToJob = useCallback(
    async (data: {
      jobId: string;
      coverLetter?: string;
      resumeUrl?: string;
      portfolioUrl?: string;
      expectedSalary?: number;
      availableStartDate?: string;
      privacyConsent?: boolean;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await candidateService.applyToJob(data as any);

        if (response.success) {
          await fetchApplications();
          return response.data;
        }

        throw new Error("Failed to apply");
      } catch (err: any) {
        const errorMessage = err.message || "Failed to apply to job";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchApplications],
  );

  const withdrawApplication = useCallback(
    async (applicationId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await candidateService.withdrawApplication(applicationId);

        if (response.success) {
          await fetchApplications();
          return true;
        }

        throw new Error("Failed to withdraw application");
      } catch (err: any) {
        const errorMessage = err.message || "Failed to withdraw application";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchApplications],
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    stats,
    loading,
    error,
    fetchApplications,
    applyToJob,
    withdrawApplication,
  };
};

// Skills Management Hook
export const useSkills = () => {
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await candidateService.getAvailableSkills();

      if (response.success && response.data) {
        setAvailableSkills(response.data);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch skills";
      setError(errorMessage);
      console.error("Fetch skills error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSkill = useCallback(
    async (data: {
      skillName: string;
      level?: string;
      yearsOfExp?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await candidateService.addSkill(data);

        if (response.success) {
          await fetchAvailableSkills();
          return response.data;
        }

        throw new Error("Failed to add skill");
      } catch (err: any) {
        const errorMessage = err.message || "Failed to add skill";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchAvailableSkills],
  );

  const removeSkill = useCallback(
    async (skillId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await candidateService.removeSkill(skillId);

        if (response.success) {
          await fetchAvailableSkills();
          return true;
        }

        throw new Error("Failed to remove skill");
      } catch (err: any) {
        const errorMessage = err.message || "Failed to remove skill";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchAvailableSkills],
  );

  useEffect(() => {
    fetchAvailableSkills();
  }, [fetchAvailableSkills]);

  return {
    availableSkills,
    loading,
    error,
    fetchAvailableSkills,
    addSkill,
    removeSkill,
  };
};

// Domains Management Hook
export const useDomains = () => {
  const [availableDomains, setAvailableDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableDomains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await candidateService.getAvailableDomains();

      if (response.success && response.data) {
        setAvailableDomains(response.data);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch domains";
      setError(errorMessage);
      console.error("Fetch domains error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDomain = useCallback(
    async (data: { domainId: string; isPrimary?: boolean }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await candidateService.addDomain(data);

        if (response.success) {
          await fetchAvailableDomains();
          return response.data;
        }

        throw new Error("Failed to add domain");
      } catch (err: any) {
        const errorMessage = err.message || "Failed to add domain";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchAvailableDomains],
  );

  const removeDomain = useCallback(
    async (domainId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await candidateService.removeDomain(domainId);

        if (response.success) {
          await fetchAvailableDomains();
          return true;
        }

        throw new Error("Failed to remove domain");
      } catch (err: any) {
        const errorMessage = err.message || "Failed to remove domain";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchAvailableDomains],
  );

  useEffect(() => {
    fetchAvailableDomains();
  }, [fetchAvailableDomains]);

  return {
    availableDomains,
    loading,
    error,
    fetchAvailableDomains,
    addDomain,
    removeDomain,
  };
};

// Education Management Hook
export const useEducation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEducation = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await candidateService.addEducation(data);

      if (response.success) {
        return response.data;
      }

      throw new Error("Failed to add education");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add education";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEducation = useCallback(
    async (educationId: string, data: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await candidateService.updateEducation(
          educationId,
          data,
        );

        if (response.success) {
          return response.data;
        }

        throw new Error("Failed to update education");
      } catch (err: any) {
        const errorMessage = err.message || "Failed to update education";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteEducation = useCallback(async (educationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await candidateService.deleteEducation(educationId);

      if (response.success) {
        return true;
      }

      throw new Error("Failed to delete education");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete education";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    addEducation,
    updateEducation,
    deleteEducation,
  };
};

// Experience Management Hook
export const useExperience = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExperience = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await candidateService.addExperience(data);

      if (response.success) {
        return response.data;
      }

      throw new Error("Failed to add experience");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add experience";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExperience = useCallback(
    async (experienceId: string, data: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await candidateService.updateExperience(
          experienceId,
          data,
        );

        if (response.success) {
          return response.data;
        }

        throw new Error("Failed to update experience");
      } catch (err: any) {
        const errorMessage = err.message || "Failed to update experience";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteExperience = useCallback(async (experienceId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await candidateService.deleteExperience(experienceId);

      if (response.success) {
        return true;
      }

      throw new Error("Failed to delete experience");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete experience";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    addExperience,
    updateExperience,
    deleteExperience,
  };
};
