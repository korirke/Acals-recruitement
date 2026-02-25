import { Suspense } from "react";
import ApplicationDetailClient from "./ApplicationDetailClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Application Details | Careers Portal",
  description: "View your job application details and status",
};

export default function ApplicationDetailPage() {
  return (
    <Suspense fallback={<ApplicationDetailLoading />}>
      <ApplicationDetailClient />
    </Suspense>
  );
}

function ApplicationDetailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}