"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/careers/ui/dialog";
import { Button } from "@/components/careers/ui/button";
import { Separator } from "@/components/careers/ui/separator";
import {
  Sparkles,
  Target,
  Banknote,
  Calendar,
  CheckCircle2,
  FileText,
  Globe,
  Shield,
  Send,
  Loader2,
  User,
  Award,
  Briefcase,
  GraduationCap,
  BookOpen,
  Users,
  BookText,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: any;
  pipelineData: any;
  submitting: boolean;
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  formData,
  pipelineData,
  submitting,
}: Props) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const additions = [
    { key: "skills", icon: Award, label: "skill", count: formData.skills.length },
    { key: "experience", icon: Briefcase, label: "experience", count: formData.experience.length },
    { key: "education", icon: GraduationCap, label: "education", count: formData.education.length },
    { key: "publications", icon: BookOpen, label: "publication", count: formData.publications.length },
    { key: "memberships", icon: Award, label: "membership", count: formData.memberships.length },
    { key: "clearances", icon: Shield, label: "clearance", count: formData.clearances.length },
    { key: "courses", icon: BookText, label: "course", count: formData.courses.length },
    { key: "referees", icon: Users, label: "referee", count: formData.referees.length },
  ].filter((a) => a.count > 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 bg-linear-to-r from-primary-500 to-orange-500 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border-2 border-white/30 shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Review Your Application
                </DialogTitle>
                <DialogDescription className="text-white/85 text-sm mt-0.5">
                  Please review all details carefully before submitting
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Job Info */}
          <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <Target className="w-4 h-4 text-primary-500 shrink-0" />
            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                Applying For
              </p>
              <p className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                {pipelineData?.job?.title}
              </p>
            </div>
          </div>

          {/* Key Details Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Banknote className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Expected Salary
                </span>
              </div>
              <p className="text-sm font-bold text-green-900 dark:text-green-100">
                KES {parseInt(formData.expectedSalary || "0").toLocaleString()}
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Start Date
                </span>
              </div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                {formData.availableStartDate ? formatDate(formData.availableStartDate) : "—"}
              </p>
            </div>
          </div>

          {/* Applicant Summary */}
          <div className="p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-neutral-500" />
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Applicant
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Name: </span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {pipelineData?.profileSnapshot?.user?.firstName}{" "}
                  {pipelineData?.profileSnapshot?.user?.lastName}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Email: </span>
                <span className="font-medium text-neutral-900 dark:text-white break-all">
                  {pipelineData?.profileSnapshot?.user?.email}
                </span>
              </div>
              {(pipelineData?.profileSnapshot?.user?.phone || formData.basic?.phone) && (
                <div>
                  <span className="text-neutral-500 dark:text-neutral-400">Phone: </span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {formData.basic?.phone || pipelineData.profileSnapshot.user.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter Preview */}
          <div className="p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Cover Letter
                </span>
              </div>
              <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-700 px-2 py-0.5 rounded-full">
                {formData.coverLetter.length} chars
              </span>
            </div>
            <div className="max-h-28 overflow-y-auto p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                {formData.coverLetter}
              </p>
            </div>
          </div>

          {/* Portfolio */}
          {formData.portfolioUrl && (
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
              <Globe className="w-4 h-4 text-blue-500 shrink-0" />
              <a
                href={formData.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline truncate flex-1"
              >
                {formData.portfolioUrl}
              </a>
            </div>
          )}

          {/* Profile Additions */}
          {additions.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-900 dark:text-green-200">
                  New Profile Additions
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {additions.map(({ icon: Icon, label, count }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                    <Icon className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>
                      {count} {label}{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Confirmed */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Privacy & data consent confirmed ✓
            </p>
          </div>

          {/* What Happens Next */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                What Happens Next
              </span>
            </div>
            <div className="space-y-2">
              {[
                "Your application will be submitted instantly",
                "Confirmation email sent to your inbox",
                "Track progress from your applications dashboard",
                "You'll be notified when your application is reviewed",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 h-11"
            >
              Go Back & Edit
            </Button>
            <Button
              onClick={onConfirm}
              disabled={submitting}
              className="flex-1 h-11 bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
