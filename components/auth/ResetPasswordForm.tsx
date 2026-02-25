"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/careers/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/admin/ui/Toast";
import { api } from "@/lib/apiClient";
import { ENDPOINTS } from "@/lib/endpoints";
import { validators } from "@/lib/utils/validation";
import { FormInput } from "./FormInput";
import { FormError } from "./FormError";

interface ResetPasswordFormProps {
  token: string | null;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setGlobalError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGlobalError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};

    const passwordValidation = validators.password(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    const passwordMatchValidation = validators.passwordMatch(
      formData.password,
      formData.confirmPassword
    );
    if (!passwordMatchValidation.isValid) {
      newErrors.confirmPassword = passwordMatchValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError(null);

    if (!token) {
      setGlobalError("Invalid or missing reset token");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword: formData.password,
      });

      if (response.success) {
        setSuccess(true);
        showToast({
          type: 'success',
          title: 'Password Reset!',
          message: 'Your password has been successfully reset.',
        });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reset password. Please try again.";
      setGlobalError(errorMessage);
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </div>

        <Button
          asChild
          className="w-full h-11 bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-semibold"
        >
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {globalError && <FormError message={globalError} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="password"
          name="password"
          type="password"
          label="New Password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading || !token}
          error={errors.password}
          showPasswordToggle
          helperText="Must be at least 8 characters with uppercase, lowercase, and number"
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading || !token}
          error={errors.confirmPassword}
          showPasswordToggle
        />

        <Button
          type="submit"
          className="w-full h-11 bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          disabled={loading || !token}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </>
  );
}
