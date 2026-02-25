"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <AuthCard
      title="Create New Password"
      description="Enter your new password below"
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthCard
        title="Create New Password"
        description="Enter your new password below"
      >
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      </AuthCard>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}