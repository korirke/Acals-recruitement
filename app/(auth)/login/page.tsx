"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/careers/ui/use-toast";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const { toast } = useToast();

  useEffect(() => {
    if (registered === "true") {
      toast({
        title: "Registration Successful!",
        description: "Please check your email to verify your account before logging in.",
      });
    }
  }, [registered, toast]);

  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthCard
        title="Welcome Back"
        description="Sign in to your account to continue"
      >
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      </AuthCard>
    }>
      <LoginContent />
    </Suspense>
  );
}