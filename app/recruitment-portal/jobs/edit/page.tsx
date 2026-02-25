"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import EditJobClient from "./EditJobClient";
import { Loader2 } from "lucide-react";

function EditJobPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get("id");

  if (!jobId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-600 mb-4">Error: Job ID not found in URL</p>
        <button
          onClick={() => router.push("/recruitment-portal/jobs")}
          className="text-blue-600 hover:underline"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return <EditJobClient jobId={jobId} />;
}

export default function EditJobPage() {
  return (
    <Suspense fallback={<EditJobLoading />}>
      <EditJobPageContent />
    </Suspense>
  );
}

function EditJobLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      <span className="ml-3 text-neutral-600 dark:text-neutral-400">
        Loading job...
      </span>
    </div>
  );
}