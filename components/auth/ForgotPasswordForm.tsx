"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/careers/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/careers/ui/use-toast";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { validators } from "@/lib/utils/validation";
import { FormInput } from "./FormInput";
import { FormError } from "./FormError";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const emailValidation = validators.email(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error!);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });

      if (response.success) {
        setSuccess(true);
        toast({
          title: "Email Sent!",
          description: "Check your inbox for password reset instructions.",
        });
      } else {
        throw new Error(response.message || "Failed to send reset email");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send reset email. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 text-center mt-2">
            Didn't receive the email? Check your spam folder or try again in a few minutes.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="w-full h-11 border-neutral-200 dark:border-neutral-700"
        >
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>
      </>
    );
  }

  return (
    <>
      {error && <FormError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          required
          disabled={loading}
        />

        <Button
          type="submit"
          className="w-full h-11 bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Back to Login
        </Link>
      </div>
    </>
  );
}
