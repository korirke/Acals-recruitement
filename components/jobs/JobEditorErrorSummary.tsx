"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/careers/ui/alert";
import { Button } from "@/components/careers/ui/button";
import { AlertCircle } from "lucide-react";
import type { JobEditorSection } from "./jobEditorMap";
import { scrollToField, sectionForField } from "./jobEditorMap";

export function JobEditorErrorSummary(props: {
  errors: Record<string, string>;
  setSection: (s: JobEditorSection) => void;
}) {
  const entries = Object.entries(props.errors || {});
  if (!entries.length) return null;

  return (
    <Alert className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <AlertTitle className="text-red-900 dark:text-red-100">
            Please fix {entries.length} issue{entries.length > 1 ? "s" : ""} to continue
          </AlertTitle>
          <AlertDescription>
            <div className="mt-3 space-y-2">
              {entries.slice(0, 7).map(([field, message]) => (
                <div key={field} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-semibold text-red-900 dark:text-red-100">{field}</span>
                    <span className="text-red-800/90 dark:text-red-200/90"> — {message}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      props.setSection(sectionForField(field));
                      setTimeout(() => scrollToField(field), 50);
                    }}
                  >
                    Go
                  </Button>
                </div>
              ))}
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}