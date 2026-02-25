import { Suspense } from "react";
import JobDetailsClient from "./JobDetailsClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Job Details | Careers Portal",
  description: "View detailed job information and apply now",
};

export default function JobDetailPage() {
  return (
    <Suspense fallback={<JobDetailsLoading />}>
      <JobDetailsClient />
    </Suspense>
  );
}

function JobDetailsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <div className="h-16 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
      <div className="h-16 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    </div>
  );
}