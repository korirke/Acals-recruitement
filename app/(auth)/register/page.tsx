"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create Your Account"
      description="Join CareerHub to start your journey"
    >
      <RegisterForm />
    </AuthCard>
  );
}
