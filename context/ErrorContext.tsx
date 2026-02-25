"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  severity: "info" | "warning" | "error" | "critical";
}

interface ErrorContextValue {
  errors: ErrorLog[];
  logError: (error: Error | string, severity?: ErrorLog["severity"]) => void;
  clearErrors: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);

  const logError = useCallback(
    (error: Error | string, severity: ErrorLog["severity"] = "error") => {
      const errorLog: ErrorLog = {
        id: Date.now().toString(),
        message: typeof error === "string" ? error : error.message,
        stack: typeof error === "string" ? undefined : error.stack,
        timestamp: new Date(),
        severity,
      };

      setErrors((prev) => [...prev, errorLog]);

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.error("Error logged:", errorLog);
      }

      // Send to monitoring service in production
      if (process.env.NODE_ENV === "production") {
        // TODO: Send to Sentry, LogRocket, etc.
      }
    },
    [],
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        default:
          toast(message);
      }
    },
    [],
  );

  const value: ErrorContextValue = {
    errors,
    logError,
    clearErrors,
    showToast,
  };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextValue => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
