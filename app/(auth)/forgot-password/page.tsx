"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email and we'll send you reset instructions"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
