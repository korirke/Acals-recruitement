"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Progress } from "@/components/careers/ui/progress";
import {
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ProfileCompletionStatus } from "@/lib/profileCompletion";

interface ProfileCompletionBannerProps {
  status: ProfileCompletionStatus;
  onDismiss?: () => void;
}

export default function ProfileCompletionBanner({
  status,
  onDismiss,
}: ProfileCompletionBannerProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (status.isComplete) return null;

  const handleCompleteProfile = () => {
    router.push("/careers-portal/profile");
  };

  return (
    <Card className="mb-6 border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20 shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-0.5">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                  Complete Your Profile to Apply for Jobs
                </h3>
                <p className="text-sm text-orange-800 dark:text-orange-200/80">
                  Your profile is{" "}
                  <span className="font-semibold">
                    {status.completionPercentage}% complete
                  </span>
                  . Complete it to increase your chances of getting hired.
                </p>
              </div>

              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="shrink-0 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <Progress
                value={status.completionPercentage}
                className="h-2 bg-orange-200 dark:bg-orange-900/30"
              />
            </div>

            {/* Expandable Missing Fields */}
            {status.missingFields.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100 transition-colors"
                >
                  <span className="font-medium">
                    Missing {status.missingFields.length} required field{status.missingFields.length !== 1 ? 's' : ''}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-1.5 pl-4">
                    {status.requiredFields.map((field) => (
                      <div
                        key={field.field}
                        className="flex items-center gap-2 text-sm"
                      >
                        {field.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-orange-400 dark:border-orange-600 shrink-0" />
                        )}
                        <span
                          className={
                            field.completed
                              ? "text-green-700 dark:text-green-400 line-through"
                              : "text-orange-800 dark:text-orange-200"
                          }
                        >
                          {field.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleCompleteProfile}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              Complete Profile Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
