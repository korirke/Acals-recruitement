import { Suspense } from "react";
import EditInterviewClient from "./EditInterviewClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Edit Interview | Recruitment Portal",
  description: "Update interview details and status",
};

export default function EditInterviewPage() {
  return (
    <Suspense fallback={<EditInterviewLoading />}>
      <EditInterviewClient />
    </Suspense>
  );
}

function EditInterviewLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}