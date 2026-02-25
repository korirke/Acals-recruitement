"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import EditCompanyClient from "./EditCompanyClient";
import { Loader2 } from "lucide-react";

function EditCompanyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("id");

  if (!companyId) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-600 mb-4">Error: Company ID not found in URL</p>
        <button
          onClick={() => router.push("/recruitment-portal/admin/companies")}
          className="text-blue-600 hover:underline"
        >
          Back to Companies
        </button>
      </div>
    );
  }

  return <EditCompanyClient companyId={companyId} />;
}

export default function EditCompanyPage() {
  return (
    <Suspense fallback={<EditCompanyLoading />}>
      <EditCompanyPageContent />
    </Suspense>
  );
}

function EditCompanyLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      <span className="ml-3 text-neutral-600 dark:text-neutral-400">
        Loading company...
      </span>
    </div>
  );
}
