import { Suspense } from "react";
import InterviewDetailClient from "./InterviewDetailClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Interview Details | Recruitment Portal",
  description: "View complete interview information",
};

export default function InterviewDetailPage() {
  return (
    <Suspense fallback={<InterviewDetailLoading />}>
      <InterviewDetailClient />
    </Suspense>
  );
}

function InterviewDetailLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}