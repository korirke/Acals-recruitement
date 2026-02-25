"use client";

import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface FormInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  showPasswordToggle?: boolean;
  helperText?: string;
}

export function FormInput({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  showPasswordToggle = false,
  helperText,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 h-11 ${
            showPasswordToggle ? "pr-10" : ""
          } ${error ? "border-red-500 dark:border-red-500" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {helperText && !error && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
