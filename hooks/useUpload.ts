"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/uploadUtils";
import type { UploadResponse } from "@/types/api/media.types";

/**
 * hook for file uploads only
 * Use this in forms that need to upload files
 */
export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadSingleFile = async (
    file: File,
  ): Promise<UploadResponse | null> => {
    try {
      setUploading(true);
      setProgress(0);

      const result = await uploadFile(file, (progressData) => {
        setProgress(progressData.percentage);
      });

      return result;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadSingleFile,
    uploading,
    progress,
  };
}
