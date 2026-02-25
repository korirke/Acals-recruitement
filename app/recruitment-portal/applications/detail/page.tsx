import { Suspense } from "react";
import ApplicationDetailsClient from "./ApplicationDetailsClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Application Details | Recruitment Portal",
  description: "Review and manage job application details",
};

export default function ApplicationDetailsPage() {
  return (
    <Suspense fallback={<ApplicationDetailsLoading />}>
      <ApplicationDetailsClient />
    </Suspense>
  );
}

function ApplicationDetailsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}