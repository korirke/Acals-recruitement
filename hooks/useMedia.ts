"use client";

import { useState, useEffect, useCallback } from "react";
import { mediaService } from "@/services/system-services";
import { uploadFile, uploadMultipleFiles } from "@/lib/uploadUtils";
import { useErrorHandler } from "./useErrorHandler";
import type {
  MediaFile,
  MediaStats,
  MediaFilters,
  UploadResponse,
} from "@/types";

export function useMedia(initialFilters?: MediaFilters) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>(
    {},
  );
  const { handleError, handleSuccess } = useErrorHandler();

  const [filters, setFilters] = useState<MediaFilters | undefined>(
    initialFilters,
  );

  const fetchFiles = useCallback(async () => {
    try {
      const data = await mediaService.getMediaFiles(filters);
      setFiles(data);
    } catch (error: any) {
      handleError(error, false);
      setFiles([]);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await mediaService.getMediaStats();
      setStats(data);
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchFiles(), fetchStats()]);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchFiles();
    }
  }, [filters]);

  const uploadSingleFile = async (
    file: File,
  ): Promise<UploadResponse | null> => {
    try {
      setUploading(true);
      const result = await uploadFile(file, (progress) => {
        setUploadProgress({ 0: progress.percentage });
      });

      handleSuccess("File uploaded successfully!");
      await Promise.all([fetchFiles(), fetchStats()]);
      setUploadProgress({});
      return result;
    } catch (error: any) {
      handleError(error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadFilesHandler = async (fileList: FileList): Promise<boolean> => {
    try {
      setUploading(true);
      const filesArray = Array.from(fileList);

      const results = await uploadMultipleFiles(
        filesArray,
        (index, progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [index]: progress.percentage,
          }));
        },
      );

      handleSuccess(`${results.length} file(s) uploaded successfully!`);
      await Promise.all([fetchFiles(), fetchStats()]);
      setUploadProgress({});
      return true;
    } catch (error: any) {
      handleError(error);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteFileHandler = async (id: string): Promise<boolean> => {
    try {
      await mediaService.deleteFile(id);
      handleSuccess("File deleted successfully!");
      await Promise.all([fetchFiles(), fetchStats()]);
      return true;
    } catch (error: any) {
      handleError(error);
      return false;
    }
  };

  const bulkDeleteFilesHandler = async (ids: string[]): Promise<boolean> => {
    try {
      await mediaService.bulkDeleteFiles(ids);
      handleSuccess(`${ids.length} file(s) deleted successfully!`);
      await Promise.all([fetchFiles(), fetchStats()]);
      return true;
    } catch (error: any) {
      handleError(error);
      return false;
    }
  };

  return {
    files,
    stats,
    loading,
    uploading,
    uploadProgress,
    filters,
    setFilters,
    uploadSingleFile,
    uploadFiles: uploadFilesHandler,
    deleteFile: deleteFileHandler,
    bulkDeleteFiles: bulkDeleteFilesHandler,
    refetch: fetchFiles,
  };
}
