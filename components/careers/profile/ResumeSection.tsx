"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useToast } from "../ui/use-toast";
import { useCandidate } from "@/hooks/useCandidate";
import {
  Upload,
  FileText,
  Download,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import type { CandidateProfile } from "@/types";
import { getFileUrl } from "@/lib/configuration";

interface ResumeSectionProps {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function ResumeSection({
  profile,
  onUpdate,
}: ResumeSectionProps) {
  const { toast } = useToast();
  const { uploadResume } = useCandidate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file type
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
      toast({
        title: "Invalid File",
        description: error,
        variant: "destructive",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

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

      await uploadResume(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Success",
        description: "Your resume has been uploaded successfully",
      });

      setSelectedFile(null);
      onUpdate();

      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to upload resume",
        variant: "destructive",
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
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-500" />
          Resume / CV
        </CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          Upload your latest resume. Supported formats: PDF, DOC, DOCX (Max 5MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center bg-neutral-50 dark:bg-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              <Upload className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              PDF, DOC or DOCX (max. 5MB)
            </p>

            {!selectedFile ? (
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
            ) : (
              <div className="w-full max-w-md space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    disabled={isUploading}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {isUploading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-center text-neutral-600 dark:text-neutral-400">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
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
        </div>

        {/* Current Resume */}
        {profile?.resumeUrl && (
          <Card className="bg-linear-to-br from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 border-primary-200 dark:border-primary-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                      Current Resume
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        Active
                      </Badge>
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Last updated:{" "}
                      {profile.resumeUpdatedAt
                        ? formatDate(profile.resumeUpdatedAt)
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                >
                  <a
                    href={getFileUrl(profile.resumeUrl) || "#"}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resume History */}
        {profile?.resumes && profile.resumes.length > 0 && (
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              Resume History
            </h3>
            <div className="space-y-3">
              {profile.resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg shrink-0">
                      <FileText className="h-5 w-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                        {resume.fileName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs border-neutral-300 dark:border-neutral-700"
                        >
                          Version {resume.version}
                        </Badge>
                        <span>•</span>
                        <span>{formatFileSize(resume.fileSize)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(resume.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  >
                    <a
                      href={getFileUrl(resume.fileUrl) || "#"}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        {!profile?.resumeUrl && (
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-200">
              <p className="font-medium mb-1">No resume uploaded yet</p>
              <p className="text-blue-700 dark:text-blue-300">
                Upload your resume to increase your chances of getting noticed
                by employers
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
