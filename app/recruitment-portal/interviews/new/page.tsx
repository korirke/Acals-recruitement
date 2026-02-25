import { Suspense } from "react";
import NewInterviewClient from "./NewInterviewClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Schedule New Interview | Recruitment Portal",
  description: "Schedule an interview with a candidate",
};

export default function NewInterviewPage() {
  return (
    <Suspense fallback={<NewInterviewLoading />}>
      <NewInterviewClient />
    </Suspense>
  );
}

function NewInterviewLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}