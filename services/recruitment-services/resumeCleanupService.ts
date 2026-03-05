import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";

// ── Types

export interface ResumeDeleteItem {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: string | null;
}

export interface ResumePreviewDetail {
  candidateId: string;
  candidateName: string;
  email: string | null;
  keeping: { fileName: string; fileSize: number };
  toDelete: ResumeDeleteItem[];
  bytesToFree: number;
}

export interface ResumePreviewResult {
  candidatesAffected: number;
  resumesToDelete: number;
  bytesToFree: number;
  bytesToFreeHuman: string;
  details: ResumePreviewDetail[];
}

export interface FileDeleteItem {
  id: string;
  category: string;
  fileName: string;
  fileSize: number;
  createdAt: string | null;
}

export interface FilePreviewDetail {
  candidateId: string;
  candidateName: string;
  email: string | null;
  toDelete: FileDeleteItem[];
  bytesToFree: number;
}

export interface FilePreviewResult {
  candidatesAffected: number;
  filesToDelete: number;
  bytesToFree: number;
  bytesToFreeHuman: string;
  details: FilePreviewDetail[];
}

export interface ResumeCleanupResult {
  candidatesProcessed: number;
  resumesDeleted: number;
}

export interface FileCleanupResult {
  candidatesProcessed: number;
  filesDeleted: number;
}

// ── Service

const BASE = ENDPOINTS.ADMIN.CANDIDATES;

export const resumeCleanupService = {
  async previewResumeCleanup(): Promise<ResumePreviewResult | null> {
    try {
      const response = await api.get(`${BASE}/preview-resume-cleanup`);
      return response.success ? (response.data ?? null) : null;
    } catch (error) {
      console.error("Failed to preview resume cleanup:", error);
      return null;
    }
  },

  async previewDuplicateFiles(): Promise<FilePreviewResult | null> {
    try {
      const response = await api.get(`${BASE}/preview-duplicate-files`);
      return response.success ? (response.data ?? null) : null;
    } catch (error) {
      console.error("Failed to preview duplicate files:", error);
      return null;
    }
  },

  // selectedIds = only the IDs the admin checked — backend deletes exactly these
  async cleanupOldResumes(
    selectedIds: string[],
  ): Promise<ResumeCleanupResult | null> {
    try {
      const response = await api.post(`${BASE}/cleanup-resumes`, {
        selectedIds,
      });
      return response.success ? (response.data ?? null) : null;
    } catch (error) {
      console.error("Failed to cleanup old resumes:", error);
      return null;
    }
  },

  async cleanupDuplicateFiles(
    selectedIds: string[],
  ): Promise<FileCleanupResult | null> {
    try {
      const response = await api.post(`${BASE}/cleanup-duplicate-files`, {
        selectedIds,
      });
      return response.success ? (response.data ?? null) : null;
    } catch (error) {
      console.error("Failed to cleanup duplicate files:", error);
      return null;
    }
  },
};
