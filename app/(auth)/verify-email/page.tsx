"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/careers/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { useToast } from "@/components/admin/ui/Toast";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const token = searchParams.get("token");

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid verification link. Please check your email for the correct link.");
      setVerifying(false);
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { token });

      if (response.success) {
        setSuccess(true);
        showToast({
          type: 'success',
          title: 'Email Verified!',
          message: 'Your account has been verified successfully.',
        });

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to verify email. The link may be expired.";
      setError(errorMessage);
      showToast({
        type: 'error',
        title: 'Verification Failed',
        message: errorMessage,
      });
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <AuthCard
        title="Verifying Your Email"
        description="Please wait while we verify your email address"
      >
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Verifying your email address...
          </p>
        </div>
      </AuthCard>
    );
  }

  if (success) {
    return (
      <AuthCard
        title="Email Verified!"
        description="Your account has been successfully verified"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                Verification Complete
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Your account is now active. Redirecting to login...
              </p>
            </div>
          </div>

          <Button
            asChild
            className="w-full h-11 bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-semibold"
          >
            <Link href="/login">Continue to Login</Link>
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Verification Failed"
      description="We couldn't verify your email address"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              Verification Failed
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            asChild
            className="w-full h-11 bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-semibold"
          >
            <Link href="/register">Create New Account</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full h-11"
          >
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <AuthCard
        title="Verifying Your Email"
        description="Please wait while we verify your email address"
      >
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        </div>
      </AuthCard>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
