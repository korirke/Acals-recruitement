import { Suspense } from "react";
import AdminCandidateDetailClient from "./AdminCandidateDetailClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Candidate Details | Admin Portal",
  description: "View and manage candidate profile and applications",
};

export default function AdminCandidateDetailPage() {
  return (
    <Suspense fallback={<AdminCandidateDetailLoading />}>
      <AdminCandidateDetailClient />
    </Suspense>
  );
}

function AdminCandidateDetailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}