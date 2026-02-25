"use client";

import { XCircle, X } from "lucide-react";
import { useError } from "@/context/ErrorContext";
import theme from "@/lib/theme";

export default function ErrorHandler() {
  const { errors, clearErrors, showToast } = useError();

  if (!errors || errors.length === 0) return null;

  const latest = errors[errors.length - 1];

  return (
    <div
      className={`w-full rounded-md p-3 mb-4 flex items-start gap-3 ${theme.errorBg} ${theme.errorText} border border-red-200 dark:border-red-800`}
    >
      <XCircle className="w-6 h-6 shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="font-semibold">{latest.severity.toUpperCase()}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {latest.timestamp.toLocaleString()}
          </div>
        </div>
        <div className="mt-1 text-sm">{latest.message}</div>
        <div className="mt-2 flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${theme.error} hover:opacity-90`}
            onClick={() => showToast("Logged error to console", "info")}
          >
            Log
          </button>
          <button
            className="px-3 py-1 rounded-md text-sm bg-neutral-200 dark:bg-neutral-700"
            onClick={clearErrors}
          >
            Dismiss
          </button>
        </div>
      </div>
      <button
        onClick={clearErrors}
        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
