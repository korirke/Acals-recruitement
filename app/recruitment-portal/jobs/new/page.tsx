"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/hooks/useJobs";
import { useJobForm } from "@/hooks/useJobForm";
import { JobEditor } from "@/components/jobs/JobEditor";

export default function NewJobPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { categories, loading, fetchCategories, createJob } = useJobs();
  const { formData, errors, updateField, validateForm, buildPayload } =
    useJobForm();

  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = useMemo(() => {
    const roles = ["SUPER_ADMIN", "HR_MANAGER", "MODERATOR"];
    return roles.includes(user?.role || "");
  }, [user?.role]);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/recruitment-portal/jobs/new");
      return;
    }
    fetchCategories();
  }, [user, fetchCategories, router]);

  const onSaveDraft = async () => {
    const ok = validateForm(user?.role, "DRAFT");
    if (!ok) return;

    setSavingDraft(true);
    try {
      const job = await createJob(buildPayload(true));
      if (job) {
        // Redirect to edit page to allow setting requirements
        router.push(`/recruitment-portal/jobs/edit?id=${job.id}`);
      }
    } finally {
      setSavingDraft(false);
    }
  };

  const onSubmit = async () => {
    const ok = validateForm(user?.role, "SUBMIT");
    if (!ok) return;

    setSubmitting(true);
    try {
      const job = await createJob(buildPayload(false));
      if (job) {
        // Redirect to edit page to allow setting requirements before final submission
        router.push(`/recruitment-portal/jobs/edit?id=${job.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <JobEditor
        mode="NEW"
        title="Create Job"
        subtitle="Create a job posting. Save a draft anytime or submit for approval when ready. After creation, you'll be able to set job profile requirements."
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
        onSubmitOrSave={onSubmit}
        primaryLabel="Submit for Approval"
        draftLabel="Save Draft"
        savingDraft={savingDraft}
        savingPrimary={submitting}
      />

      {/* Note: Requirements editor only available after job is created */}
      <div className="container mx-auto px-4 py-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium">📋 Job Profile Requirements</p>
          <p className="mt-1 text-blue-700">
            After creating this job, you'll be redirected to the edit page where
            you can set specific profile requirements for candidates.
          </p>
        </div>
      </div>
    </div>
  );
}
