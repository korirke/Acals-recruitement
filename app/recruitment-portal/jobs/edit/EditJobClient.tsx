"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/hooks/useJobs";
import { useJobForm } from "@/hooks/useJobForm";
import { JobEditor } from "@/components/jobs/JobEditor";
import { JobProfileRequirementsEditor } from "@/components/jobs/JobProfileRequirementsEditor";

export default function EditJobClient({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const { categories, loading, fetchCategories, fetchJobById, updateJob } =
    useJobs();
  const {
    formData,
    errors,
    updateMultipleFields,
    updateField,
    validateForm,
    buildPayload,
  } = useJobForm();

  const [ready, setReady] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdmin = useMemo(() => {
    const roles = ["SUPER_ADMIN", "HR_MANAGER", "MODERATOR"];
    return roles.includes(user?.role || "");
  }, [user?.role]);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/recruitment-portal/jobs");
      return;
    }

    fetchCategories();

    (async () => {
      const job = await fetchJobById(jobId);
      if (!job) {
        router.push("/recruitment-portal/jobs");
        return;
      }

      updateMultipleFields({
        title: job.title || "",
        description: job.description || "",
        responsibilities: job.responsibilities || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        niceToHave: job.niceToHave || "",
        type: job.type,
        experienceLevel: job.experienceLevel,
        location: job.location || "",
        isRemote: !!job.isRemote,
        salaryType: job.salaryType,
        salaryMin: job.salaryMin || undefined,
        salaryMax: job.salaryMax || undefined,
        specificSalary: job.specificSalary || undefined,
        currency: job.currency || "KSH",
        companyId: job.companyId || "",
        categoryId: job.categoryId || "",
        expiresAt: job.expiresAt
          ? new Date(job.expiresAt).toISOString().split("T")[0]
          : "",
      });

      setReady(true);
    })();
  }, [user, jobId]);

  if (!ready || loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground">
        Loading job…
      </div>
    );
  }

  const onSaveDraft = async () => {
    const ok = validateForm(user?.role, "DRAFT");
    if (!ok) return;

    setSavingDraft(true);
    try {
      const updated = await updateJob(jobId, buildPayload(true));
      if (updated) router.push("/recruitment-portal/jobs");
    } finally {
      setSavingDraft(false);
    }
  };

  const onSave = async () => {
    const ok = validateForm(user?.role, "SUBMIT");
    if (!ok) return;

    setSaving(true);
    try {
      const updated = await updateJob(jobId, buildPayload(false));
      if (updated) router.push("/recruitment-portal/jobs");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Job Editor */}
      <JobEditor
        mode="EDIT"
        title="Edit Job"
        subtitle="Update job details. Save as draft or save changes."
        backHref="/recruitment-portal/jobs"
        userRole={user?.role}
        isAdmin={isAdmin}
        categories={categories}
        categoriesLoading={loading}
        initialData={formData}
        errors={errors as any}
        isDirty={true}
        onChange={(k, v) => updateField(k as any, v as any)}
        onSaveDraft={onSaveDraft}
        onSubmitOrSave={onSave}
        primaryLabel="Save Changes"
        draftLabel="Save Draft"
        savingDraft={savingDraft}
        savingPrimary={saving}
        previewHref={`/careers-portal/jobs/job-detail?id=${jobId}`}
      />

      {/* Job Profile Requirements Editor - Only in EDIT mode */}
      <div className="container mx-auto px-4 py-6">
        <JobProfileRequirementsEditor jobId={jobId} />
      </div>
    </div>
  );
}
