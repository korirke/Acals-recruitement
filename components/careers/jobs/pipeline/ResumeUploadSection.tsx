"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Progress } from "@/components/careers/ui/progress";
import { useToast } from "@/components/admin/ui/Toast";
import { candidateService } from "@/services/recruitment-services";
import { 
  Upload, 
  FileText, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface Props {
  resumeUrl?: string;
  onResumeUploaded: (url: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function ResumeUploadSection({ resumeUrl, onResumeUploaded }: Props) {
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Only PDF, DOC, and DOCX files are allowed.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 5MB limit.";
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext || "")) {
      return "Invalid file extension. Only .pdf, .doc, and .docx are allowed.";
    }
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      showToast({
        type: "error",
        title: "Invalid File",
        message: error,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await candidateService.uploadResume(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success && response.data?.resumeUrl) {
        showToast({
          type: "success",
          title: "Success",
          message: "Resume uploaded successfully",
        });
        onResumeUploaded(response.data.resumeUrl);
        setSelectedFile(null);
      }

      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Upload Failed",
        message: error.message || "Failed to upload resume",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-500" />
          Resume / CV <span className="text-red-500">*</span>
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Upload your resume (PDF, DOC, DOCX - Max 5MB)
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Resume Status */}
        {resumeUrl && !selectedFile && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <span className="text-sm font-medium text-green-900 dark:text-green-200 flex-1">
              Resume attached and ready
            </span>
          </div>
        )}

        {!resumeUrl && !selectedFile && (
          <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
            <span className="text-sm text-orange-900 dark:text-orange-200 flex-1">
              Please upload your resume to continue
            </span>
          </div>
        )}

        {/* File Selection / Upload */}
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!selectedFile ? (
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              variant="outline"
              className="w-full h-auto py-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10"
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 text-primary-500" />
                <span className="font-medium text-neutral-900 dark:text-white">
                  {resumeUrl ? "Upload New Resume" : "Upload Resume"}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  PDF, DOC or DOCX (max. 5MB)
                </span>
              </div>
            </Button>
          ) : (
            <div className="space-y-3">
              {/* Selected File Display */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isUploading}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Upload Progress */}
              {isUploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-center text-neutral-600 dark:text-neutral-400">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Upload Actions */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
