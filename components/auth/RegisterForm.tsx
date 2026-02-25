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

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export function RegisterForm() {
  const { register, loading } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setGlobalError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    const firstNameValidation = validators.name(formData.firstName, "First name");
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.error;
    }

    const lastNameValidation = validators.name(formData.lastName, "Last name");
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.error;
    }

    const emailValidation = validators.email(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

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

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "CANDIDATE",
      });

      showToast({
        type: 'success',
        title: 'Account Created!',
        message: 'Please check your email to verify your account.',
      });
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed. Please try again.";
      setGlobalError(errorMessage);
      showToast({
        type: 'error',
        title: 'Registration Failed',
        message: errorMessage,
      });
    }
  };

  return (
    <>
      {globalError && <FormError message={globalError} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            id="firstName"
            name="firstName"
            label="First Name"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={loading}
            error={errors.firstName}
          />
          <FormInput
            id="lastName"
            name="lastName"
            label="Last Name"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={loading}
            error={errors.lastName}
          />
        </div>

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

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          error={errors.password}
          showPasswordToggle
          helperText="Must be at least 8 characters with uppercase, lowercase, and number"
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
          error={errors.confirmPassword}
          showPasswordToggle
        />

        <Button
          type="submit"
          className="w-full h-11 bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200 dark:border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
            Already have an account?
          </span>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-semibold hover:underline transition-colors"
        >
          Sign in to your account
        </Link>
      </div>
    </>
  );
}