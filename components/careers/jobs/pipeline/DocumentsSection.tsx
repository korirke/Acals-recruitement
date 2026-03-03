"use client";

import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { Label } from "@/components/careers/ui/label";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";
import {
  AlertCircle,
  CheckCircle2,
  File,
  FileText,
  FolderOpen,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  missingKeys: string[];
  existingFiles: Array<{
    id: string;
    category: string;
    fileName: string;
    fileUrl: string;
    title?: string;
  }>;
}

interface RequiredDocInfo {
  label: string;
  category: string;
  description: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const REQUIRED_CATEGORY_MAP: Record<string, RequiredDocInfo> = {
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
  DOCUMENT_DRIVING_LICENSE: {
    label: "Driving License",
    category: "DRIVING_LICENSE",
    description: "Your valid driving license",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocumentsSection({
  missingKeys,
  existingFiles,
}: Props) {
  const { showToast } = useToast();

  // ── Required-document state ───────────────────────────────────────────────
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadedRequired, setUploadedRequired] = useState<
    Record<string, { fileName: string }>
  >({});

  // ── Other-documents state ─────────────────────────────────────────────────
  const [otherFiles, setOtherFiles] = useState<
    Array<{ id: string; fileName: string; title?: string }>
  >(existingFiles.filter((f) => f.category === "OTHER"));
  const [uploadingOther, setUploadingOther] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const otherInputRef = useRef<HTMLInputElement>(null);

  // Which required-doc keys are actually relevant
  const documentKeys = missingKeys.filter(
    (k) => k.startsWith("DOCUMENT_") && REQUIRED_CATEGORY_MAP[k],
  );
  const hasRequiredDocs = documentKeys.length > 0;

  // ── Required upload ───────────────────────────────────────────────────────
  const handleRequiredUpload = async (key: string, file: File | null) => {
    if (!file) return;
    const { category, label } = REQUIRED_CATEGORY_MAP[key];

    // Line ~88
    if (file.size > 2 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "File Too Large",
        message: "Maximum file size is 2 MB",
      });
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [key]: true }));
      const res = await candidateService.uploadCandidateFile({
        file,
        category,
        title: label,
      });
      if (res.success) {
        setUploadedRequired((prev) => ({
          ...prev,
          [key]: { fileName: res.data?.fileName ?? file.name },
        }));
        showToast({
          type: "success",
          title: "Uploaded",
          message: `${label} uploaded successfully`,
        });
      } else {
        showToast({
          type: "error",
          title: "Upload Failed",
          message: (res as any).message || `Failed to upload ${label}`,
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Upload Failed",
        message: err.message || `Failed to upload ${label}`,
      });
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getRequiredStatus = (
    key: string,
  ): "existing" | "uploaded" | "missing" => {
    if (uploadedRequired[key]) return "uploaded";
    const { category } = REQUIRED_CATEGORY_MAP[key];
    if (existingFiles.some((f) => f.category === category)) return "existing";
    return "missing";
  };

  // ── Other-document upload ─────────────────────────────────────────────────
  const handleOtherUpload = async (file: File | null) => {
    if (!file) return;

    // Line ~120
    if (file.size > 2 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "File Too Large",
        message: "Maximum file size is 2 MB",
      });
      return;
    }

    try {
      setUploadingOther(true);
      const res = await candidateService.uploadCandidateFile({
        file,
        category: "OTHER",
        title: file.name,
      });
      if (res.success && res.data) {
        setOtherFiles((prev) => [
          ...prev,
          { id: res.data.id, fileName: res.data.fileName ?? file.name },
        ]);
        showToast({
          type: "success",
          title: "Uploaded",
          message: `"${file.name}" added to your documents`,
        });
      } else {
        showToast({
          type: "error",
          title: "Upload Failed",
          message: (res as any).message || "Failed to upload file",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Upload Failed",
        message: err.message || "Failed to upload file",
      });
    } finally {
      setUploadingOther(false);
      // Reset so the same file can be re-chosen
      if (otherInputRef.current) otherInputRef.current.value = "";
    }
  };

  // ── Other-document delete ─────────────────────────────────────────────────
  const handleDeleteOther = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await candidateService.deleteCandidateFile(id);
      if (res.success !== false) {
        setOtherFiles((prev) => prev.filter((f) => f.id !== id));
        showToast({
          type: "success",
          title: "Removed",
          message: "Document removed",
        });
      } else {
        showToast({
          type: "error",
          title: "Error",
          message: (res as any).message || "Could not remove document",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to remove document",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-500" />
          Documents
          {hasRequiredDocs && <span className="text-red-500">*</span>}
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Upload required documents and any additional supporting materials
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ── REQUIRED DOCUMENTS ── */}
        {hasRequiredDocs && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs border border-red-200 dark:border-red-700">
                Required
              </Badge>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                PDF, JPG, PNG — max 2 MB each
              </span>
            </div>

            {documentKeys.map((key) => {
              const info = REQUIRED_CATEGORY_MAP[key];
              if (!info) return null;
              const status = getRequiredStatus(key);
              const inputId = `req-file-${key}`;

              return (
                <div
                  key={key}
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

                  {/* Already in profile */}
                  {status === "existing" && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-200">
                        Already uploaded in your profile ✓
                      </span>
                    </div>
                  )}

                  {/* Just uploaded */}
                  {status === "uploaded" && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-200">
                          Uploaded successfully ✓
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          {uploadedRequired[key]?.fileName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Missing */}
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
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) =>
                          handleRequiredUpload(key, e.target.files?.[0] ?? null)
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading[key]}
                        className="w-full h-12 border-dashed border-2 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10"
                        onClick={() =>
                          document.getElementById(inputId)?.click()
                        }
                      >
                        {uploading[key] ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading…
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
          </div>
        )}

        {/* Divider only when both sections are present */}
        {hasRequiredDocs && (
          <div className="border-t border-neutral-200 dark:border-neutral-700" />
        )}

        {/* ── OTHER DOCUMENTS (always visible) ── */}
        <div className="space-y-3">
          {/* Header row */}
          <div className="flex items-start gap-2">
            <FolderOpen className="h-4 w-4 text-neutral-500 mt-0.5 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Other Supporting Documents
                </span>
                <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs border border-neutral-200 dark:border-neutral-700">
                  Optional
                </Badge>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Testimonials, portfolio samples, cover pages, etc. — any format,
                max 2 MB each
              </p>
            </div>
          </div>

          {/* List of uploaded other-docs */}
          {otherFiles.length > 0 && (
            <div className="space-y-2">
              {otherFiles.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <File className="h-4 w-4 text-primary-500 shrink-0" />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                      {f.fileName || f.title || "Document"}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === f.id}
                    onClick={() => handleDeleteOther(f.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    {deletingId === f.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Hidden file input for other-docs */}
          <input
            type="file"
            ref={otherInputRef}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.zip"
            className="hidden"
            onChange={(e) => handleOtherUpload(e.target.files?.[0] ?? null)}
          />

          {/* Upload button */}
          <Button
            type="button"
            variant="outline"
            disabled={uploadingOther}
            className="w-full h-12 border-dashed border-2 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10"
            onClick={() => otherInputRef.current?.click()}
          >
            {uploadingOther ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2 text-primary-500" />
                <span className="text-primary-600 dark:text-primary-400 font-medium">
                  Add Supporting Document
                </span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
