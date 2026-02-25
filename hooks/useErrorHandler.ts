"use client";

import { useCallback } from "react";
import { useError } from "@/context/ErrorContext";

export function useErrorHandler() {
  const { logError, showToast } = useError();

  const handleError = useCallback(
    (error: Error | string, showNotification = true) => {
      logError(error, "error");

      if (showNotification) {
        const message = typeof error === "string" ? error : error.message;
        showToast(message, "error");
      }
    },
    [logError, showToast],
  );

  const handleSuccess = useCallback(
    (message: string) => {
      showToast(message, "success");
    },
    [showToast],
  );

  const handleInfo = useCallback(
    (message: string) => {
      showToast(message, "info");
    },
    [showToast],
  );

  return {
    handleError,
    handleSuccess,
    handleInfo,
  };
}
