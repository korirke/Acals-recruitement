import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import JobApplicationsClient from "./JobApplicationsClient";

export const metadata = {
  title: "Job Applications | Recruitment Portal",
  description: "Manage applications for specific job posting",
};

export default function JobApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      }
    >
      <JobApplicationsClient />
    </Suspense>
  );
}