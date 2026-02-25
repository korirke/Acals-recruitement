"use client";

import { useState, useCallback } from "react";
import { jobsService } from "@/services/recruitment-services";
import { useError } from "@/context/ErrorContext";
import type {
  Job,
  JobCategory,
  CreateJobDto,
  UpdateJobDto,
  JobStatus,
} from "@/types";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  const { logError, showToast } = useError();

  const fetchMyJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobsService.getMyJobs();
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error: any) {
      logError(error);
      showToast(error.message || "Failed to fetch jobs", "error");
    } finally {
      setLoading(false);
    }
  }, [logError, showToast]);

  /**
   * AUTH manage endpoint so draft/pending/rejected jobs are accessible.
   */
  const fetchJobById = useCallback(
    async (id: string): Promise<Job | null> => {
      try {
        setLoading(true);
        const response = await jobsService.getJobForEdit(id);

        if (response.success && response.data) {
          setCurrentJob(response.data);
          return response.data;
        }
        return null;
      } catch (error: any) {
        logError(error);
        showToast(error.message || "Failed to fetch job details", "error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [logError, showToast],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await jobsService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      logError(error);
    }
  }, [logError]);

  const createJob = useCallback(
    async (data: CreateJobDto): Promise<Job | null> => {
      try {
        setLoading(true);
        const response = await jobsService.createJob(data);
        if (response.success && response.data) {
          showToast("Job created successfully", "success");
          return response.data;
        }
        return null;
      } catch (error: any) {
        logError(error);
        showToast(error.message || "Failed to create job", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [logError, showToast],
  );

  const updateJob = useCallback(
    async (id: string, data: UpdateJobDto): Promise<Job | null> => {
      try {
        setLoading(true);
        const response = await jobsService.updateJob(id, data);
        if (response.success && response.data) {
          showToast("Job updated successfully", "success");
          return response.data;
        }
        return null;
      } catch (error: any) {
        logError(error);
        showToast(error.message || "Failed to update job", "error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [logError, showToast],
  );

  const deleteJob = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await jobsService.deleteJob(id);
        if (response.success) {
          showToast("Job deleted successfully", "success");
          return true;
        }
        return false;
      } catch (error: any) {
        logError(error);
        showToast(error.message || "Failed to delete job", "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [logError, showToast],
  );

  const changeStatus = useCallback(
    async (id: string, newStatus: JobStatus): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await jobsService.changeJobStatus(id, newStatus);
        if (response.success) {
          showToast(`Job status changed to ${newStatus}`, "success");
          return true;
        }
        return false;
      } catch (error: any) {
        logError(error);
        showToast(error.message || "Failed to change job status", "error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [logError, showToast],
  );

  return {
    jobs,
    categories,
    currentJob,
    loading,
    fetchMyJobs,
    fetchJobById,
    fetchCategories,
    createJob,
    updateJob,
    deleteJob,
    changeStatus,
  };
}
