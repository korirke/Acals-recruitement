"use client";

import React, { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import theme from "@/lib/theme";

interface Props {
  message?: string | null;
  onClose?: () => void;
}

export default function SuccessMessage({ message, onClose }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), 4000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`w-full rounded-md p-3 mb-4 flex items-start gap-3 ${theme.successBg} ${theme.successText} border border-green-200 dark:border-green-800`}
    >
      <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="font-semibold">Success</div>
        <div className="mt-1 text-sm">{message}</div>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
