"use client";

import { Suspense } from "react";
import ApplyJobPipelineContent from "@/components/careers/jobs/ApplyJobPipelineContent";
import { Loader2 } from "lucide-react";

export default function ApplyJobPipelinePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      }
    >
      <ApplyJobPipelineContent />
    </Suspense>
  );
}
