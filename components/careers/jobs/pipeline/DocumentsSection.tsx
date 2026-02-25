"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Label } from "@/components/careers/ui/label";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";
import {
  FileText,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  File,
} from "lucide-react";

interface Props {
  missingKeys: string[];
  existingFiles: any[];
}

const CATEGORY_MAP: Record<string, { label: string; category: string; description: string }> = {
  DOCUMENT_NATIONAL_ID: {
    label: "National ID",
    category: "NATIONAL_ID",
    description: "Front and back copy of your National ID card",
  },
  DOCUMENT_ACADEMIC_CERT: {
    label: "Academic Certificates",
    category: "ACADEMIC_CERT",
    description: "Your highest academic qualification certificate",
  },
  DOCUMENT_PROFESSIONAL_CERT: {
    label: "Professional Certificates",
    category: "PROFESSIONAL_CERT",
    description: "Relevant professional certification documents",
  },
};

export default function DocumentsSection({ missingKeys, existingFiles }: Props) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>>({});

  const documentKeys = missingKeys.filter((k) => k.startsWith("DOCUMENT_"));

  const handleFileUpload = async (requirementKey: string, file: File | null) => {
    if (!file) return;
    const { category, label } = CATEGORY_MAP[requirementKey];

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      showToast({ type: "error", title: "File Too Large", message: "Maximum file size is 5MB" });
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [requirementKey]: true }));

      const response = await candidateService.uploadCandidateFile({
        file,
        category,
        title: label,
      });

      if (response.success) {
        setUploadedFiles((prev) => ({ ...prev, [requirementKey]: response.data }));
        showToast({ type: "success", title: "Uploaded", message: `${label} uploaded successfully` });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Upload Failed",
        message: error.message || `Failed to upload ${label}`,
      });
    } finally {
      setUploading((prev) => ({ ...prev, [requirementKey]: false }));
    }
  };

  const getStatus = (requirementKey: string) => {
    const { category } = CATEGORY_MAP[requirementKey];
    if (uploadedFiles[requirementKey]) return "uploaded";
    if (existingFiles.some((f) => f.category === category)) return "existing";
    return "missing";
  };

  if (documentKeys.length === 0) return null;

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-500" />
          Required Documents <span className="text-red-500">*</span>
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Upload all required compliance documents (PDF, JPG, PNG — max 5MB each)
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {documentKeys.map((requirementKey) => {
          const info = CATEGORY_MAP[requirementKey];
          if (!info) return null;

          const status = getStatus(requirementKey);
          const inputId = `file-${requirementKey}`;

          return (
            <div
              key={requirementKey}
              className="p-5 border border-neutral-200 dark:border-neutral-700 rounded-lg space-y-3"
            >
              <div>
                <Label className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {info.label} <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {info.description}
                </p>
              </div>

              {status === "existing" && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-200">
                    Already uploaded in your profile ✓
                  </span>
                </div>
              )}

              {status === "uploaded" && (
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-200">
                      Uploaded successfully ✓
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {uploadedFiles[requirementKey]?.fileName}
                    </p>
                  </div>
                </div>
              )}

              {status === "missing" && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0" />
                    <span className="text-sm text-orange-900 dark:text-orange-200">
                      This document has not been uploaded yet
                    </span>
                  </div>

                  <input
                    type="file"
                    id={inputId}
                    onChange={(e) => handleFileUpload(requirementKey, e.target.files?.[0] || null)}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-dashed border-2 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10"
                    onClick={() => document.getElementById(inputId)?.click()}
                    disabled={uploading[requirementKey]}
                  >
                    {uploading[requirementKey] ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2 text-primary-500" />
                        <span className="text-primary-600 dark:text-primary-400 font-medium">
                          Upload {info.label}
                        </span>
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
