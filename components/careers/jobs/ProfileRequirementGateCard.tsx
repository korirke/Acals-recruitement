"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { PROFILE_REQUIREMENT_LABELS } from "@/lib/profileRequirementLabels";
import type { JobProfileEligibilityDTO } from "@/types";

export function ProfileRequirementGateCard(props: {
  eligibility: JobProfileEligibilityDTO;
  profileHref?: string;
}) {
  const { eligibility, profileHref = "/careers-portal/profile" } = props;

  // If job has no configured strict requirements, hide card entirely
  if (!eligibility || eligibility.totalRequired === 0) return null;

  const isEligible = eligibility.isEligible;
  const missing = eligibility.missingKeys || [];

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {isEligible ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              Profile ready to apply
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Complete your profile to apply
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            <span className="font-semibold text-neutral-900 dark:text-white">
              {eligibility.completionPercentage}%
            </span>
            <span>
              {eligibility.completedCount}/{eligibility.totalRequired} completed
            </span>
          </div>

          <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isEligible ? "bg-green-600" : "bg-orange-500"
              }`}
              style={{ width: `${Math.max(0, Math.min(100, eligibility.completionPercentage))}%` }}
            />
          </div>
        </div>

        {/* Missing list */}
        {!isEligible && missing.length > 0 && (
          <div className="text-sm">
            <p className="font-semibold text-neutral-900 dark:text-white mb-2">
              Missing items
            </p>
            <ul className="list-disc ml-5 space-y-1 text-neutral-700 dark:text-neutral-300">
              {missing.slice(0, 8).map((k) => (
                <li key={k}>{PROFILE_REQUIREMENT_LABELS[k] ?? k}</li>
              ))}
              {missing.length > 8 && <li>+ {missing.length - 8} more</li>}
            </ul>
          </div>
        )}

        <Button
          asChild
          className={isEligible ? "" : "bg-primary-600 hover:bg-primary-700 text-white"}
          variant={isEligible ? "outline" : "default"}
        >
          <Link href={profileHref}>Go to profile</Link>
        </Button>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          This job requires specific profile sections before applying.
        </p>
      </CardContent>
    </Card>
  );
}