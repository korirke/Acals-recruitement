"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  FileText,
  Upload as UploadIcon,
  X,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Textarea } from "@/components/careers/ui/textarea";
import { Label } from "@/components/careers/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { Checkbox } from "@/components/careers/ui/checkbox";
import { Separator } from "@/components/careers/ui/separator";

import { CompanySelector } from "@/components/jobs/CompanySelector";
import { useUpload } from "@/hooks/useUpload";

import type { CreateJobDto, JobCategory } from "@/types";
import {
  JOB_TYPE_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  SALARY_TYPE_LABELS,
} from "@/types";

import { JobEditorSections } from "./JobEditorSections";
import { JobEditorErrorSummary } from "./JobEditorErrorSummary";
import { JobSaveStatus } from "./JobSaveStatus";
import {
  countErrorsBySection,
  firstErrorField,
  scrollToField,
  sectionForField,
  type JobEditorSection,
} from "./jobEditorMap";

function isAdminRole(role?: string) {
  return (
    role === "SUPER_ADMIN" || role === "HR_MANAGER" || role === "MODERATOR"
  );
}

export function JobEditor(props: {
  mode: "NEW" | "EDIT";
  title: string;
  subtitle: string;
  backHref: string;

  editingJobTitle?: string;

  userRole?: string;
  isAdmin: boolean;

  categories: JobCategory[];
  categoriesLoading?: boolean;

  initialData: CreateJobDto;
  errors: Record<string, string>;

  isDirty: boolean;
  autosaveState?: any;
  lastSavedAt?: Date | null;

  onChange: <K extends keyof CreateJobDto>(k: K, v: CreateJobDto[K]) => void;

  onSaveDraft: () => Promise<void>;
  onSubmitOrSave: () => Promise<void>;

  previewHref?: string;
  primaryLabel: string;
  draftLabel?: string;
  savingDraft?: boolean;
  savingPrimary?: boolean;
}) {
  const [section, setSection] = useState<JobEditorSection>("basic");
  const errorCounts = useMemo(
    () => countErrorsBySection(props.errors),
    [props.errors],
  );

  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  // ── JD Document upload
  const {
    uploadSingleFile,
    uploading: jdUploading,
    progress: jdProgress,
  } = useUpload();

  const handleJDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadSingleFile(file);
    if (result?.url) {
      props.onChange("jdDocumentUrl", result.url as any);
    }
    // reset so the same file can be re-selected if removed
    e.target.value = "";
  };

  const showFirstError = () => {
    const field = firstErrorField(props.errors);
    if (!field) return;
    setSection(sectionForField(field));
    setTimeout(() => scrollToField(field), 60);
  };

  const ErrorText = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
        <AlertCircle className="h-4 w-4" />
        <span className="font-semibold">{message}</span>
      </div>
    );
  };

  const data = props.initialData;
  const adminNeedsCompany = props.isAdmin && isAdminRole(props.userRole);

  const Basic = (
    <Card className="rounded-2xl border-neutral-200 dark:border-neutral-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Basic information</CardTitle>
        <CardDescription>Core details shown on the job card</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="title">
            Job title <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2">
            <Input
              id="title"
              value={data.title ?? ""}
              placeholder="e.g., Senior Frontend Developer"
              onChange={(e) => props.onChange("title", e.target.value as any)}
              className={
                props.errors.title
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
          </div>
          <ErrorText message={props.errors.title} />
        </div>

        {props.isAdmin && (
          <div>
            <Label>
              Company <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <CompanySelector
                value={String(data.companyId ?? "")}
                onChange={(value) => props.onChange("companyId", value as any)}
                error={props.errors.companyId}
              />
            </div>
            <ErrorText message={props.errors.companyId} />
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <Label>
              Category <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <Select
                value={String(data.categoryId ?? "")}
                onValueChange={(v) => props.onChange("categoryId", v as any)}
              >
                <SelectTrigger
                  id="categoryId"
                  className={props.errors.categoryId ? "border-red-500" : ""}
                >
                  <SelectValue
                    placeholder={
                      props.categoriesLoading
                        ? "Loading..."
                        : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {props.categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ErrorText message={props.errors.categoryId} />
          </div>

          <div>
            <Label>Job type</Label>
            <div className="mt-2">
              <Select
                value={data.type ?? "FULL_TIME"}
                onValueChange={(v: any) => props.onChange("type", v)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label>Experience level</Label>
            <div className="mt-2">
              <Select
                value={data.experienceLevel ?? "MID_LEVEL"}
                onValueChange={(v: any) => props.onChange("experienceLevel", v)}
              >
                <SelectTrigger id="experienceLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPERIENCE_LEVEL_LABELS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const Location = (
    <Card className="rounded-2xl border-neutral-200 dark:border-neutral-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Location</CardTitle>
        <CardDescription>Where candidates will work from</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="location">
            Location <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2">
            <Input
              id="location"
              value={data.location ?? ""}
              placeholder="e.g., Nairobi, Kenya"
              onChange={(e) =>
                props.onChange("location", e.target.value as any)
              }
              className={props.errors.location ? "border-red-500" : ""}
            />
          </div>
          <ErrorText message={props.errors.location} />
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-5">
          <div className="flex items-center gap-3">
            <Checkbox
              id="isRemote"
              checked={!!data.isRemote}
              onCheckedChange={(v: boolean) =>
                props.onChange("isRemote", v as any)
              }
            />
            <Label htmlFor="isRemote" className="cursor-pointer font-semibold">
              Remote position
            </Label>
          </div>
        </div>

        <div>
          <Label htmlFor="expiresAt">
            Application deadline (required on submit)
          </Label>
          <div className="mt-2">
            <Input
              id="expiresAt"
              type="date"
              min={minDate}
              value={String(data.expiresAt ?? "")}
              onChange={(e) =>
                props.onChange("expiresAt", e.target.value as any)
              }
              className={props.errors.expiresAt ? "border-red-500" : ""}
            />
          </div>
          <ErrorText message={props.errors.expiresAt} />
        </div>
      </CardContent>
    </Card>
  );

  const Salary = (
    <Card className="rounded-2xl border-neutral-200 dark:border-neutral-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Compensation</CardTitle>
        <CardDescription>Salary details shown to candidates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Salary type</Label>
          <div className="mt-2">
            <Select
              value={data.salaryType ?? "NEGOTIABLE"}
              onValueChange={(v: any) => props.onChange("salaryType", v)}
            >
              <SelectTrigger id="salaryType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SALARY_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {data.salaryType === "RANGE" && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label>Minimum salary</Label>
              <div className="mt-2">
                <Input
                  id="salaryMin"
                  type="number"
                  value={(data.salaryMin ?? "") as any}
                  placeholder="e.g., 150000"
                  onChange={(e) =>
                    props.onChange(
                      "salaryMin",
                      e.target.value === ""
                        ? undefined
                        : (parseInt(e.target.value) as any),
                    )
                  }
                  className={props.errors.salaryMin ? "border-red-500" : ""}
                />
              </div>
              <ErrorText message={props.errors.salaryMin} />
            </div>

            <div>
              <Label>Maximum salary</Label>
              <div className="mt-2">
                <Input
                  id="salaryMax"
                  type="number"
                  value={(data.salaryMax ?? "") as any}
                  placeholder="e.g., 250000"
                  onChange={(e) =>
                    props.onChange(
                      "salaryMax",
                      e.target.value === ""
                        ? undefined
                        : (parseInt(e.target.value) as any),
                    )
                  }
                  className={props.errors.salaryMax ? "border-red-500" : ""}
                />
              </div>
              <ErrorText message={props.errors.salaryMax} />
            </div>
          </div>
        )}

        {data.salaryType === "SPECIFIC" && (
          <div>
            <Label>Salary amount</Label>
            <div className="mt-2">
              <Input
                id="specificSalary"
                type="number"
                value={(data.specificSalary ?? "") as any}
                placeholder="e.g., 200000"
                onChange={(e) =>
                  props.onChange(
                    "specificSalary",
                    e.target.value === ""
                      ? undefined
                      : (parseInt(e.target.value) as any),
                  )
                }
                className={props.errors.specificSalary ? "border-red-500" : ""}
              />
            </div>
            <ErrorText message={props.errors.specificSalary} />
          </div>
        )}

        <div>
          <Label htmlFor="benefits">Benefits </Label>
          <div className="mt-2">
            <Textarea
              id="benefits"
              value={String(data.benefits ?? "")}
              placeholder={
                "One per line:\n• Medical cover\n• Remote budget\n• Learning stipend"
              }
              onChange={(e) =>
                props.onChange("benefits", e.target.value as any)
              }
              rows={7}
              className="font-mono text-sm leading-6"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const Content = (
    <Card className="rounded-2xl border-neutral-200 dark:border-neutral-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Job content</CardTitle>
        <CardDescription>
          Description, responsibilities, requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="description">
            Job description <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2">
            <Textarea
              id="description"
              value={String(data.description ?? "")}
              placeholder="Describe the role, impact, and what success looks like…"
              onChange={(e) =>
                props.onChange("description", e.target.value as any)
              }
              rows={14}
              className={`text-base leading-7 ${props.errors.description ? "border-red-500" : ""}`}
            />
          </div>
          <ErrorText message={props.errors.description} />
        </div>

        <div>
          <Label htmlFor="responsibilities">Responsibilities </Label>
          <div className="mt-2">
            <Textarea
              id="responsibilities"
              value={String(data.responsibilities ?? "")}
              placeholder={
                "One per line:\n• Build reusable UI\n• Improve performance"
              }
              onChange={(e) =>
                props.onChange("responsibilities", e.target.value as any)
              }
              rows={12}
              className="font-mono text-sm leading-6"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="requirements">Requirements </Label>
          <div className="mt-2">
            <Textarea
              id="requirements"
              value={String(data.requirements ?? "")}
              placeholder={"One per line:\n• 3+ years React\n• TypeScript"}
              onChange={(e) =>
                props.onChange("requirements", e.target.value as any)
              }
              rows={12}
              className="font-mono text-sm leading-6"
            />
          </div>
        </div>

        {/* ──Key Skills and Competencies */}
        <div>
          <Label htmlFor="keySkillsAndCompetencies">
            Key Skills and Competencies{" "}
          </Label>
          <div className="mt-2">
            <Textarea
              id="keySkillsAndCompetencies"
              value={String(data.keySkillsAndCompetencies ?? "")}
              placeholder={
                "One per line:\n• Strong communication skills\n• Problem-solving mindset\n• Team collaboration"
              }
              onChange={(e) =>
                props.onChange(
                  "keySkillsAndCompetencies",
                  e.target.value as any,
                )
              }
              rows={12}
              className="font-mono text-sm leading-6"
            />
          </div>
        </div>
        {/* ────────────────────────────────────*/}

        <div>
          <Label htmlFor="niceToHave">Nice to have </Label>
          <div className="mt-2">
            <Textarea
              id="niceToHave"
              value={String(data.niceToHave ?? "")}
              placeholder="Optional extras that help a candidate stand out…"
              onChange={(e) =>
                props.onChange("niceToHave", e.target.value as any)
              }
              rows={8}
            />
          </div>
        </div>

        {/* ── JD Document Upload  */}
        <Separator />
        <div>
          <Label htmlFor="jdDocument">
            Job Description Document{" "}
            <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
              (Optional)
            </span>
          </Label>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-3">
            Upload a PDF, Word (.doc/.docx), or image for candidates to
            download. Max 10 MB.
          </p>

          {data.jdDocumentUrl ? (
            /* ── Uploaded state ── */
            <div className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 shrink-0">
                <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  Document uploaded
                </p>
                <a
                  href={data.jdDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Preview / Download
                </a>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 text-neutral-500 hover:text-red-500"
                onClick={() =>
                  props.onChange("jdDocumentUrl", undefined as any)
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            /* ── Upload dropzone ── */
            <div>
              <input
                type="file"
                id="jdDocument"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleJDUpload}
                disabled={jdUploading}
              />
              <label
                htmlFor="jdDocument"
                className={[
                  "flex flex-col items-center justify-center w-full h-32 rounded-xl",
                  "border-2 border-dashed transition-colors cursor-pointer",
                  jdUploading
                    ? "border-primary-400 bg-primary-50 dark:bg-primary-900/10 cursor-not-allowed"
                    : "border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-neutral-50 dark:hover:bg-neutral-900",
                ].join(" ")}
              >
                {jdUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Uploading… {jdProgress}%
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <UploadIcon className="h-6 w-6 text-neutral-400" />
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                      Click to upload JD document
                    </p>
                    <p className="text-xs text-neutral-400">
                      PDF, Word, JPG, PNG — max 10 MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {/* ── NEW: Back navigation link above the title ─────────────────────── */}
          <Link
            href={props.backHref}
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
          {/* ─────────────────────────────────────*/}

          <h1 className="text-3xl font-bold leading-tight">{props.title}</h1>

          {/* ── NEW: Show which job is being edited (EDIT mode only) ─────────── */}
          {props.mode === "EDIT" && props.editingJobTitle && (
            <p className="mt-1 text-base font-semibold text-primary-600 dark:text-primary-400 truncate max-w-xl">
              {props.editingJobTitle}
            </p>
          )}
          {/* ─────────────────────────────────────*/}

          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            {props.subtitle}
          </p>
          <div className="mt-4">
            <JobSaveStatus
              isDirty={props.isDirty}
              autosaveState={props.autosaveState}
              lastSavedAt={props.lastSavedAt}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* ── Back button (icon + label) in the action bar ─────────────────── */}
          <Button asChild variant="outline">
            <Link href={props.backHref}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          {/* ─────────────────────────────────────*/}

          {props.previewHref && (
            <Button asChild variant="outline">
              <Link href={props.previewHref} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
          )}
        </div>
      </div>

      <JobEditorErrorSummary errors={props.errors} setSection={setSection} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <JobEditorSections
            section={section}
            setSection={setSection}
            errorCounts={errorCounts}
            basic={Basic}
            location={Location}
            salary={Salary}
            content={Content}
          />

          <div className="pt-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={async () => {
                await props.onSaveDraft();
                if (Object.keys(props.errors).length) showFirstError();
              }}
              disabled={props.savingDraft || props.savingPrimary}
            >
              {props.savingDraft
                ? (props.draftLabel ?? "Saving…")
                : (props.draftLabel ?? "Save Draft")}
            </Button>

            <Button
              className="bg-primary-600 hover:bg-primary-700 text-white"
              onClick={async () => {
                await props.onSubmitOrSave();
                if (Object.keys(props.errors).length) showFirstError();
              }}
              disabled={props.savingDraft || props.savingPrimary}
            >
              {props.savingPrimary ? "Working…" : props.primaryLabel}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="rounded-2xl border-neutral-200 dark:border-neutral-800 lg:sticky lg:top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Summary</CardTitle>
              <CardDescription>Quick review</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="text-xs text-muted-foreground">Title</p>
                <p className="font-semibold wrap-break-word">
                  {data.title || "—"}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-semibold wrap-break-word">
                  {String(data.categoryId || "").trim()
                    ? (props.categories.find(
                        (c) => String(c.id) === String(data.categoryId),
                      )?.name ?? "Selected")
                    : "—"}
                </p>
              </div>

              {props.isAdmin && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="font-semibold wrap-break-word">
                      {String(data.companyId || "").trim() ? "Selected" : "—"}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* JD Document indicator in summary */}
              {data.jdDocumentUrl && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">JD Document</p>
                    <p className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      Uploaded
                    </p>
                  </div>
                  <Separator />
                </>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed">
                Draft requires{" "}
                <span className="font-semibold">
                  Title, Category, Description, Location
                </span>
                {adminNeedsCompany ? (
                  <>
                    {" "}
                    and <span className="font-semibold">Company</span> (admin).
                  </>
                ) : (
                  "."
                )}{" "}
                Submit requires all mandatory fields and validations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
