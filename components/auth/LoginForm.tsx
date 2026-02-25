"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/careers/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/admin/ui/Toast";
import { validators } from "@/lib/utils/validation";
import { FormInput } from "./FormInput";
import { FormError } from "./FormError";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login, loading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGlobalError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    const emailValidation = validators.email(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    const passwordValidation = validators.required(formData.password, "Password");
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      showToast({
        type: 'success',
        title: 'Welcome back!',
        message: "You've successfully logged in.",
      });
    } catch (err: any) {
      const errorMessage = err.message || "Invalid credentials. Please try again.";
      setGlobalError(errorMessage);
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: errorMessage,
      });
    }
  };

  return (
    <>
      {globalError && <FormError message={globalError} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          error={errors.email}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span></span>
            <Link
              href="/forgot-password"
              className="text-xs text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            error={errors.password}
            showPasswordToggle
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200 dark:border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
            Don't have an account?
          </span>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/register"
          className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-semibold hover:underline transition-colors"
        >
          Create a new account
        </Link>
      </div>
    </>
  );
}
