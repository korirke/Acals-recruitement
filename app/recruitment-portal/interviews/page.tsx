import { Suspense } from "react";
import InterviewManagementClient from "./InterviewManagementClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Interview Management | Recruitment Portal",
  description: "Schedule and track candidate interviews",
};

export default function InterviewManagementPage() {
  return (
    <Suspense fallback={<InterviewManagementLoading />}>
      <InterviewManagementClient />
    </Suspense>
  );
}

function InterviewManagementLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}