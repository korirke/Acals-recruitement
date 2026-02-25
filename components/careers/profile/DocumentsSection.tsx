"use client";

import { useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/components/careers/ui/use-toast";
import { candidateService } from "@/services/recruitment-services";
import type { CandidateProfile, CandidateFileCategory } from "@/types";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { getFileUrl } from "@/lib/configuration";

const categories: { value: CandidateFileCategory; label: string }[] = [
  { value: "NATIONAL_ID", label: "National ID" },
  { value: "ACADEMIC_CERT", label: "Academic Certificates" },
  { value: "PROFESSIONAL_CERT", label: "Professional Certificates" },
  { value: "TESTIMONIAL", label: "Testimonials" },
  { value: "CLEARANCE_CERT", label: "Clearance Certificates" },
  { value: "PUBLICATION_EVIDENCE", label: "Publication Evidence" },
  { value: "OTHER", label: "Other" },
];

export default function DocumentsSection({
  profile,
  onUpdate,
}: {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] =
    useState<CandidateFileCategory>("NATIONAL_ID");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const files = (profile as any)?.files || [];

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const f of files) {
      map[f.category] = map[f.category] || [];
      map[f.category].push(f);
    }
    return map;
  }, [files]);

  const pick = () => inputRef.current?.click();

  const upload = async () => {
    if (!file) {
      toast({
        title: "Select a file",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }
    try {
      setUploading(true);
      await candidateService.uploadCandidateFile({
        file,
        category,
        title: title || undefined,
      });
      toast({
        title: "Uploaded",
        description: "Document uploaded successfully",
      });
      setFile(null);
      setTitle("");
      if (inputRef.current) inputRef.current.value = "";
      onUpdate();
    } catch (e: any) {
      toast({
        title: "Upload failed",
        description: e.message || "Failed",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    try {
      await candidateService.deleteCandidateFile(id);
      toast({ title: "Deleted", description: "File deleted" });
      onUpdate();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-500" />
          Documents / Attachments
        </CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          Upload National ID, certificates, testimonials, and other documents
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* uploader */}
        <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/30 space-y-4">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. KRA Tax Compliance 2025"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" onClick={pick} disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              Select file
            </Button>

            {file && (
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Selected: <b>{file.name}</b> ({Math.round(file.size / 1024)} KB)
              </span>
            )}

            <Button
              onClick={upload}
              disabled={uploading || !file}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" /> Upload
                </>
              )}
            </Button>
          </div>
        </div>

        {/* list */}
        <div className="space-y-4">
          {categories.map((c) => (
            <div key={c.value} className="space-y-2">
              <h4 className="font-semibold text-neutral-900 dark:text-white">
                {c.label}
              </h4>
              {(grouped[c.value] || []).length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No files uploaded
                </p>
              ) : (
                <div className="space-y-2">
                  {(grouped[c.value] || []).map((f: any) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900 dark:text-white truncate">
                          {f.title || f.fileName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {f.fileName}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a
                            href={getFileUrl(f.fileUrl) || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4 mr-2" /> Download
                          </a>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => remove(f.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
