"use client";

import { Textarea } from "@/components/careers/ui/textarea";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Checkbox } from "@/components/careers/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import {
  FileText,
  Globe,
  Banknote,
  Calendar,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const MIN_COVER_LETTER = 150;

interface Props {
  data: {
    coverLetter: string;
    portfolioUrl: string;
    expectedSalary: string;
    availableStartDate: string;
    privacyConsent: boolean;
  };
  onChange: (data: any) => void;
  resumeUrl?: string;
}

export default function ApplicationDetailsSection({ data, onChange, resumeUrl }: Props) {
  const coverLetterChars = data.coverLetter.length;
  const coverLetterMet = coverLetterChars >= MIN_COVER_LETTER;

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-500" />
          Application Details
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Complete the final details of your application
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Resume Status */}
        {resumeUrl ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <span className="text-sm font-medium text-green-900 dark:text-green-200">
              Resume is attached and ready ✓
            </span>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                No resume uploaded
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                Please upload your resume in the section above before submitting
              </p>
            </div>
          </div>
        )}

        {/* Cover Letter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="coverLetter" className="text-sm font-medium text-neutral-900 dark:text-white">
              Cover Letter <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {coverLetterMet && (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              )}
              <span
                className={`text-xs font-medium ${
                  coverLetterMet
                    ? "text-green-600"
                    : coverLetterChars > 0
                    ? "text-orange-600"
                    : "text-neutral-500"
                }`}
              >
                {coverLetterChars} / 5000
              </span>
            </div>
          </div>
          <Textarea
            id="coverLetter"
            value={data.coverLetter}
            onChange={(e) => onChange({ ...data, coverLetter: e.target.value })}
            placeholder={`Write a compelling cover letter explaining:\n• Why you're interested in this role\n• Your relevant experience and key achievements\n• Why you're the best fit for this position\n• What value you'll bring to the team\n\n(Minimum ${MIN_COVER_LETTER} characters)`}
            className="min-h-60 resize-none text-sm leading-relaxed"
            maxLength={5000}
          />
          {coverLetterChars > 0 && !coverLetterMet && (
            <p className="text-xs text-orange-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {MIN_COVER_LETTER - coverLetterChars} more characters needed
            </p>
          )}
          {coverLetterMet && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Cover letter meets minimum requirements
            </p>
          )}
        </div>

        {/* Portfolio URL */}
        <div className="space-y-2">
          <Label htmlFor="portfolioUrl" className="text-sm font-medium text-neutral-900 dark:text-white">
            Portfolio / Website{" "}
            <span className="text-xs font-normal text-neutral-500">(Optional)</span>
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <Input
              id="portfolioUrl"
              type="url"
              value={data.portfolioUrl}
              onChange={(e) => onChange({ ...data, portfolioUrl: e.target.value })}
              placeholder="https://yourportfolio.com"
              className="pl-10 h-11"
            />
          </div>
        </div>

        {/* Expected Salary + Start Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Expected Salary */}
          <div className="space-y-2">
            <Label htmlFor="expectedSalary" className="text-sm font-medium text-neutral-900 dark:text-white">
              Expected Monthly Salary (KES) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 pointer-events-none">
                KES
              </span>
              <Input
                id="expectedSalary"
                type="text"
                inputMode="numeric"
                value={data.expectedSalary}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    onChange({ ...data, expectedSalary: value });
                  }
                }}
                placeholder="e.g. 80000"
                className="pl-16 h-11"
                required
              />
            </div>
            {data.expectedSalary && (
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                = KES {parseInt(data.expectedSalary).toLocaleString()} /month
              </p>
            )}
          </div>

          {/* Available Start Date */}
          <div className="space-y-2">
            <Label htmlFor="availableStartDate" className="text-sm font-medium text-neutral-900 dark:text-white">
              Available Start Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <Input
                id="availableStartDate"
                type="date"
                value={data.availableStartDate}
                onChange={(e) => onChange({ ...data, availableStartDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
        </div>

        {/* Privacy Consent */}
        <div className="space-y-3 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg shrink-0">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                Privacy & Data Protection
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                Your personal data will be processed securely in accordance with our{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-100"
                >
                  Privacy Policy
                </a>
                . Your information will only be shared with relevant hiring parties.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <Checkbox
              id="privacyConsent"
              checked={data.privacyConsent}
              onCheckedChange={(checked) => onChange({ ...data, privacyConsent: !!checked })}
              className="mt-0.5"
            />
            <Label
              htmlFor="privacyConsent"
              className="text-sm text-blue-900 dark:text-blue-200 cursor-pointer leading-relaxed"
            >
              I consent to the processing of my personal information for the purpose of this job
              application and agree to the terms outlined in the Privacy Policy.{" "}
              <span className="text-red-500 font-semibold">*</span>
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
