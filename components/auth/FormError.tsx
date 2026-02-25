"use client";

import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message: string;
}

export function FormError({ message }: FormErrorProps) {
  return (
    <div
      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}
