"use client";

import { useState } from "react";
import { applicationsService } from "@/services/recruitment-services";
import type {
  ApplicationForEmployer,
  ApplicationStats,
  DashboardStats,
} from "@/types";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useApplications = () => {
  const [applications, setApplications] = useState<ApplicationForEmployer[]>(
    [],
  );
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationsForJob = async (
    jobId: string,
    params?: { status?: string; page?: number; limit?: number },
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsService.getApplicationsForJob(
        jobId,
        params,
      );
      if (response.success && response.data) {
        setApplications(response.data.applications);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
        return response.data.pagination;
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch applications");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = async (filters: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsService.filterApplications(filters);
      if (response.success && response.data) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
        return response.data.pagination;
      }
    } catch (err: any) {
      setError(err.message || "Failed to filter applications");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    data: {
      status: string;
      internalNotes?: string;
      rating?: number;
      reason?: string;
    },
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsService.updateStatus(id, data);
      if (response.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id
              ? { ...app, status: data.status, rating: data.rating }
              : app,
          ),
        );
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || "Failed to update status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkUpdate = async (data: {
    applicationIds: string[];
    status: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsService.bulkUpdate(data);
      if (response.success) {
        setApplications((prev) =>
          prev.map((app) =>
            data.applicationIds.includes(app.id)
              ? { ...app, status: data.status }
              : app,
          ),
        );
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || "Failed to bulk update");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    applications,
    stats,
    pagination,
    loading,
    error,
    fetchApplicationsForJob,
    filterApplications,
    updateStatus,
    bulkUpdate,
  };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<
    ApplicationForEmployer[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsService.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data.stats);
        setRecentApplications(response.data.recentApplications);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch stats");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    recentApplications,
    loading,
    error,
    fetchStats,
  };
};
