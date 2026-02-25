"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { applicationsService } from "@/services/recruitment-services";
import type { ApplicationForEmployer } from "@/types";
import { getFileUrl } from "@/lib/configuration";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { Textarea } from "@/components/careers/ui/textarea";
import { Label } from "@/components/careers/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/careers/ui/tabs";

import ScheduleInterviewModal from "@/components/recruitment/ScheduleInterviewModal";

import {
  ArrowLeft,
  Award,
  Banknote,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  Download,
  FileText,
  Globe,
  GraduationCap,
  IdCard,
  Languages,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  User,
  Users,
  CheckCircle2,
  XCircle,
  Paperclip,
  BadgeCheck,
  Building2,
  Link as LinkIcon,
} from "lucide-react";

/**
 * Utility: safe array
 */
function asArray<T>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

/**
 * Utility: safe string
 */
function s(v: any, fallback = "N/A"): string {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "string" && v.trim() === "") return fallback;
  return String(v);
}

/**
 * Utility: bytes -> human readable
 */
function formatBytes(bytes?: number | null) {
  if (!bytes || Number.isNaN(bytes)) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let b = bytes;
  let i = 0;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i++;
  }
  return `${b.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function formatDateTime(dateString?: string) {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
}

function StatusPill({ value }: { value: string }) {
  const yes =
    value?.toUpperCase?.() === "Y" ||
    value?.toLowerCase?.() === "yes" ||
    value === "1" ||
    value === "true";
  const no =
    value?.toUpperCase?.() === "N" ||
    value?.toLowerCase?.() === "no" ||
    value === "0" ||
    value === "false";
  const unknown = !value || value === "N/A";

  if (unknown) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-[11px] text-neutral-600 dark:text-neutral-300">
        <Clock className="h-3 w-3" />
        Unknown
      </span>
    );
  }

  if (yes) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-2 py-0.5 text-[11px] text-green-700 dark:text-green-300">
        <CheckCircle2 className="h-3 w-3" />
        Yes
      </span>
    );
  }

  if (no) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-2 py-0.5 text-[11px] text-red-700 dark:text-red-300">
        <XCircle className="h-3 w-3" />
        No
      </span>
    );
  }

  // fallback
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 text-[11px] text-neutral-700 dark:text-neutral-200">
      {value}
    </span>
  );
}

function TableShell({
  title,
  icon,
  children,
  empty,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <span className="text-primary-600 dark:text-primary-400">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {empty ? (
          <div className="text-center py-10 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            No records found
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SimpleKV({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="mt-0.5 text-neutral-500 dark:text-neutral-400">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] sm:text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {label}
        </div>
        <div className="text-xs sm:text-sm text-neutral-900 dark:text-white wrap-break-word">
          {value}
        </div>
      </div>
    </div>
  );
}

function FileDownloadButton({
  url,
  fileName,
  variant = "outline",
}: {
  url?: string | null;
  fileName?: string;
  variant?: any;
}) {
  if (!url) return null;
  const href = getFileUrl(url) ?? url;

  return (
    <Button asChild variant={variant} size="sm" className="whitespace-nowrap">
      <a href={href} target="_blank" rel="noopener noreferrer" download>
        <Download className="h-4 w-4 mr-2" />
        {fileName ? `Download ${fileName}` : "Download"}
      </a>
    </Button>
  );
}

export default function ApplicationDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const applicationId = searchParams.get("id");

  const [application, setApplication] = useState<ApplicationForEmployer | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [newStatus, setNewStatus] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);

  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    if (
      !user ||
      !["EMPLOYER", "HR_MANAGER", "MODERATOR", "SUPER_ADMIN"].includes(
        user.role,
      )
    ) {
      router.push("/careers-portal");
      return;
    }
    if (!applicationId) {
      router.push("/recruitment-portal/applications");
      return;
    }
    fetchApplication();
  }, [user, applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await applicationsService.getApplicationDetails(
        applicationId!,
      );
      if (response.success && response.data) {
        setApplication(response.data);
        setNewStatus(response.data.status);
        setInternalNotes(response.data.internalNotes || "");
        setRating(response.data.rating);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load application");
      router.push("/recruitment-portal/applications");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!application) return;

    try {
      setUpdating(true);
      await applicationsService.updateStatus(application.id, {
        status: newStatus,
        internalNotes,
        rating,
      });
      toast.success("Application status updated successfully");

      if (newStatus === "INTERVIEW" && application.status !== "INTERVIEW") {
        setShowScheduleModal(true);
      }

      fetchApplication();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const statusBadgeClass = useMemo(() => {
    const statusClasses: Record<string, string> = {
      PENDING: "bg-yellow-500 text-white",
      REVIEWED: "bg-blue-500 text-white",
      SHORTLISTED: "bg-purple-500 text-white",
      INTERVIEW: "bg-indigo-500 text-white",
      OFFERED: "bg-green-500 text-white",
      ACCEPTED: "bg-green-600 text-white",
      REJECTED: "bg-red-500 text-white",
      WITHDRAWN: "bg-gray-500 text-white",
    };
    return statusClasses[application?.status || ""] || "bg-gray-500 text-white";
  }, [application?.status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!application) return null;

  const candidate = application.candidate;
  const profile: any = candidate?.candidateProfile || {};

  // New backend fields (all live under candidate.candidateProfile.*)
  const personalInfo = profile?.personalInfo || null;
  const publications = asArray<any>(profile?.publications);
  const memberships = asArray<any>(profile?.memberships);
  const clearances = asArray<any>(profile?.clearances);
  const courses = asArray<any>(profile?.courses);
  const referees = asArray<any>(profile?.referees);
  const files = asArray<any>(profile?.files);
  const certifications = asArray<any>(profile?.certifications);
  const languages = asArray<any>(profile?.languages);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/recruitment-portal/applications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Link>
          </Button>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Application Review
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              {application.job?.title ? (
                <>
                  Applied for{" "}
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {application.job.title}
                  </span>
                </>
              ) : (
                "Application details"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={statusBadgeClass}>{application.status}</Badge>
          {typeof application.rating === "number" && (
            <Badge variant="secondary" className="text-xs">
              Rating: {application.rating}/5
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Candidate summary */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Candidate Overview
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-linear-to-r from-primary-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shrink-0 shadow-sm">
                  {candidate.firstName?.[0]}
                  {candidate.lastName?.[0]}
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">
                        {candidate.firstName} {candidate.lastName}
                      </h2>
                      {profile?.title && (
                        <p className="text-sm sm:text-base font-medium text-primary-700 dark:text-primary-300 truncate">
                          {profile.title}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <a href={`mailto:${candidate.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      </Button>
                      {candidate.phone && (
                        <Button asChild variant="outline" size="sm">
                          <a href={`tel:${candidate.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <SimpleKV
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={
                        <a
                          className="text-primary-600 hover:underline"
                          href={`mailto:${candidate.email}`}
                        >
                          {candidate.email}
                        </a>
                      }
                    />
                    <SimpleKV
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={
                        candidate.phone ? (
                          <a
                            className="text-primary-600 hover:underline"
                            href={`tel:${candidate.phone}`}
                          >
                            {candidate.phone}
                          </a>
                        ) : (
                          "N/A"
                        )
                      }
                    />
                    <SimpleKV
                      icon={<MapPin className="h-4 w-4" />}
                      label="Location"
                      value={s(profile?.location)}
                    />
                    <SimpleKV
                      icon={<Briefcase className="h-4 w-4" />}
                      label="Experience"
                      value={
                        profile?.experienceYears
                          ? `${profile.experienceYears}`
                          : "N/A"
                      }
                    />
                  </div>

                  {/* Application-specific row */}
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <SimpleKV
                      icon={
                        <Banknote className="h-4 w-4 text-green-600 dark:text-green-400" />
                      }
                      label="Expected Salary"
                      value={
                        application.expectedSalary
                          ? `KSh ${application.expectedSalary}`
                          : "N/A"
                      }
                    />
                    <SimpleKV
                      icon={
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      }
                      label="Available From"
                      value={formatDate(application.availableStartDate)}
                    />
                    <SimpleKV
                      icon={
                        <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                      }
                      label="Privacy Consent"
                      value={
                        application.privacyConsent ? (
                          <StatusPill value="Y" />
                        ) : (
                          <StatusPill value="N" />
                        )
                      }
                    />
                    <SimpleKV
                      icon={
                        <Globe className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      }
                      label="Portfolio"
                      value={
                        application.portfolioUrl ? (
                          <a
                            className="text-primary-600 hover:underline break-all inline-flex items-center gap-1"
                            href={application.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LinkIcon className="h-3.5 w-3.5" />
                            {application.portfolioUrl}
                          </a>
                        ) : (
                          "N/A"
                        )
                      }
                    />
                  </div>

                  {/* Domains */}
                  {asArray<any>(profile?.domains).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-orange-500" />
                        <h4 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                          Expertise Domains
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.domains.map((d: any, idx: number) => (
                          <Badge
                            key={d?.domain?.id || idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {d?.domain?.name || "Domain"}
                            {d?.isPrimary ? (
                              <Star className="h-3 w-3 ml-1 inline text-orange-500" />
                            ) : null}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {asArray<any>(profile?.skills).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        <h4 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                          Skills
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((sRow: any, idx: number) => (
                          <Badge
                            key={sRow?.skill?.id || idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {sRow?.skill?.name || "Skill"}
                            {sRow?.level ? ` (${sRow.level})` : ""}
                            {typeof sRow?.yearsOfExp === "number"
                              ? ` • ${sRow.yearsOfExp}y`
                              : ""}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs: now includes all new sections */}
          <Tabs defaultValue="cover-letter" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="cover-letter" className="text-xs sm:text-sm">
                Cover Letter
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-xs sm:text-sm">
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs sm:text-sm">
                Education
              </TabsTrigger>
              <TabsTrigger value="personal" className="text-xs sm:text-sm">
                Personal
              </TabsTrigger>
              <TabsTrigger value="credentials" className="text-xs sm:text-sm">
                Credentials
              </TabsTrigger>
              <TabsTrigger value="attachments" className="text-xs sm:text-sm">
                Attachments
              </TabsTrigger>
            </TabsList>

            {/* Cover Letter */}
            <TabsContent value="cover-letter">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    Cover Letter
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  {application.coverLetter ? (
                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-line leading-relaxed">
                      {application.coverLetter}
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 italic">
                      No cover letter provided
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience */}
            <TabsContent value="experience">
              <div className="space-y-3 sm:space-y-4">
                {asArray<any>(profile?.experiences).length > 0 ? (
                  profile.experiences.map((exp: any) => (
                    <Card key={exp.id}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/40 rounded-xl shrink-0">
                            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white truncate">
                              {s(exp.title)}
                            </h4>
                            <p className="text-sm sm:text-base text-orange-700 dark:text-orange-300 font-medium truncate">
                              {s(exp.company)}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              {exp.location && (
                                <span className="truncate">{exp.location}</span>
                              )}
                              {exp.employmentType && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <span>{exp.employmentType}</span>
                                </>
                              )}
                              <span className="hidden sm:inline">•</span>
                              <span className="truncate">
                                {formatDate(exp.startDate)} -{" "}
                                {exp.isCurrent
                                  ? "Present"
                                  : formatDate(exp.endDate)}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2 sm:mt-3 whitespace-pre-line">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      No experience listed
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Education */}
            <TabsContent value="education">
              <div className="space-y-3 sm:space-y-4">
                {asArray<any>(profile?.educations).length > 0 ? (
                  profile.educations.map((edu: any) => (
                    <Card key={edu.id}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="p-2 sm:p-3 bg-primary-100 dark:bg-primary-900/40 rounded-xl shrink-0">
                            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white truncate">
                              {s(edu.degree)}
                            </h4>
                            <p className="text-sm sm:text-base text-primary-700 dark:text-primary-300 font-medium truncate">
                              {s(edu.fieldOfStudy)}
                            </p>
                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1 truncate">
                              {s(edu.institution)}
                              {edu.location ? ` • ${edu.location}` : ""}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              <Calendar className="h-4 w-4 shrink-0" />
                              <span className="truncate">
                                {formatDate(edu.startDate)} -{" "}
                                {edu.isCurrent
                                  ? "Present"
                                  : formatDate(edu.endDate)}
                              </span>
                              {edu.grade && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <span>Grade: {edu.grade}</span>
                                </>
                              )}
                            </div>
                            {edu.description && (
                              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                                {edu.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      No education listed
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Personal Info */}
            <TabsContent value="personal">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    {!personalInfo ? (
                      <div className="py-10 text-center text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                        No personal info provided
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <SimpleKV
                          icon={<User className="h-4 w-4" />}
                          label="Full Name"
                          value={s(personalInfo.fullName)}
                        />
                        <SimpleKV
                          icon={<Calendar className="h-4 w-4" />}
                          label="Date of Birth"
                          value={formatDate(personalInfo.dob)}
                        />
                        <SimpleKV
                          icon={<BadgeCheck className="h-4 w-4" />}
                          label="Gender"
                          value={s(personalInfo.gender)}
                        />
                        <SimpleKV
                          icon={<IdCard className="h-4 w-4" />}
                          label="ID Number"
                          value={s(personalInfo.idNumber)}
                        />
                        <SimpleKV
                          icon={<Globe className="h-4 w-4" />}
                          label="Nationality"
                          value={s(personalInfo.nationality)}
                        />
                        <SimpleKV
                          icon={<MapPin className="h-4 w-4" />}
                          label="County of Origin"
                          value={s(personalInfo.countyOfOrigin)}
                        />
                        <SimpleKV
                          icon={<Shield className="h-4 w-4" />}
                          label="PLWD"
                          value={
                            personalInfo.plwd ? (
                              <StatusPill value="Y" />
                            ) : (
                              <StatusPill value="N" />
                            )
                          }
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <TableShell
                  title="Referees"
                  icon={<Users className="h-4 w-4" />}
                  empty={referees.length === 0}
                >
                  <table className="min-w-[720px] w-full text-xs sm:text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-semibold">Name</th>
                        <th className="px-3 py-2 font-semibold">Position</th>
                        <th className="px-3 py-2 font-semibold">
                          Organization
                        </th>
                        <th className="px-3 py-2 font-semibold">Phone</th>
                        <th className="px-3 py-2 font-semibold">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referees.map((r: any) => (
                        <tr
                          key={r.id}
                          className="border-t border-neutral-200 dark:border-neutral-800"
                        >
                          <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white">
                            {s(r.name)}
                          </td>
                          <td className="px-3 py-2">{s(r.position)}</td>
                          <td className="px-3 py-2">{s(r.organization)}</td>
                          <td className="px-3 py-2">
                            {r.phone ? (
                              <a
                                className="text-primary-600 hover:underline"
                                href={`tel:${r.phone}`}
                              >
                                {r.phone}
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {r.email ? (
                              <a
                                className="text-primary-600 hover:underline"
                                href={`mailto:${r.email}`}
                              >
                                {r.email}
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </div>
            </TabsContent>

            {/* Credentials: publications, memberships, clearances, courses, certifications, languages */}
            <TabsContent value="credentials">
              <div className="space-y-4 sm:space-y-6">
                <TableShell
                  title="Certifications"
                  icon={<BadgeCheck className="h-4 w-4" />}
                  empty={certifications.length === 0}
                >
                  <table className="min-w-[900px] w-full text-xs sm:text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-semibold">Name</th>
                        <th className="px-3 py-2 font-semibold">Issuing Org</th>
                        <th className="px-3 py-2 font-semibold">Issue Date</th>
                        <th className="px-3 py-2 font-semibold">Expiry Date</th>
                        <th className="px-3 py-2 font-semibold">Credential</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certifications.map((c: any) => (
                        <tr
                          key={c.id}
                          className="border-t border-neutral-200 dark:border-neutral-800"
                        >
                          <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white">
                            {s(c.name)}
                          </td>
                          <td className="px-3 py-2">{s(c.issuingOrg)}</td>
                          <td className="px-3 py-2">
                            {formatDateTime(c.issueDate)}
                          </td>
                          <td className="px-3 py-2">
                            {c.expiryDate ? formatDateTime(c.expiryDate) : "—"}
                          </td>
                          <td className="px-3 py-2">
                            {c.credentialUrl ? (
                              <a
                                className="text-primary-600 hover:underline inline-flex items-center gap-1"
                                href={c.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <LinkIcon className="h-3.5 w-3.5" />
                                Link
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>

                <TableShell
                  title="Languages"
                  icon={<Languages className="h-4 w-4" />}
                  empty={languages.length === 0}
                >
                  <table className="min-w-[640px] w-full text-xs sm:text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-semibold">Language</th>
                        <th className="px-3 py-2 font-semibold">Proficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {languages.map((l: any, idx: number) => (
                        <tr
                          key={l.id || idx}
                          className="border-t border-neutral-200 dark:border-neutral-800"
                        >
                          <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white">
                            {s(l?.language?.name || l?.name)}
                          </td>
                          <td className="px-3 py-2">{s(l.proficiency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>

                <TableShell
                  title="Publications"
                  icon={<BookOpen className="h-4 w-4" />}
                  empty={publications.length === 0}
                >
                  <table className="min-w-[980px] w-full text-xs sm:text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-semibold">Title</th>
                        <th className="px-3 py-2 font-semibold">Type</th>
                        <th className="px-3 py-2 font-semibold">
                          Journal / Publisher
                        </th>
                        <th className="px-3 py-2 font-semibold">Year</th>
                        <th className="px-3 py-2 font-semibold">Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {publications.map((p: any) => (
                        <tr
                          key={p.id}
                          className="border-t border-neutral-200 dark:border-neutral-800"
                        >
                          <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white">
                            {s(p.title)}
                          </td>
                          <td className="px-3 py-2">{s(p.type)}</td>
                          <td className="px-3 py-2">
                            {s(p.journalOrPublisher, "—")}
                          </td>
                          <td className="px-3 py-2">{s(p.year, "—")}</td>
                          <td className="px-3 py-2">
                            {p.link ? (
                              <a
                                className="text-primary-600 hover:underline inline-flex items-center gap-1"
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <LinkIcon className="h-3.5 w-3.5" />
                                Open
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>

                <TableShell
                  title="Professional Memberships"
                  icon={<Award className="h-4 w-4" />}
                  empty={memberships.length === 0}
                >
                  <table className="min-w-[900px] w-full text-xs sm:text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-semibold">Body Name</th>
                        <th className="px-3 py-2 font-semibold">
                          Membership No.
                        </th>
                        <th className="px-3 py-2 font-semibold">Active</th>
                        <th className="px-3 py-2 font-semibold">
                          Good Standing
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberships.map((m: any) => (
                        <tr
                          key={m.id}
                          className="border-t border-neutral-200 dark:border-neutral-800"
                        >
                          <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white">
                            {s(m.bodyName)}
                          </td>
                          <td className="px-3 py-2">
                            {s(m.membershipNumber, "—")}
                          </td>
                          <td className="px-3 py-2">
                            <StatusPill value={String(m.isActive)} />
                          </td>
                          <td className="px-3 py-2">
                            <StatusPill value={String(m.goodStanding)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>

                <TableShell
                  title="Clearances"
                  icon={<Shield className="h-4 w-4" />}
                  empty={clearances.length === 0}
                >
                  <table className="min-w-[980px] w-full text-xs sm:text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-semibold">Type</th>
                        <th className="px-3 py-2 font-semibold">
                          Certificate No.
                        </th>
                        <th className="px-3 py-2 font-semibold">Issue Date</th>
                        <th className="px-3 py-2 font-semibold">Expiry Date</th>
                        <th className="px-3 py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clearances.map((c: any) => (
                        <tr
                          key={c.id}
                          className="border-t border-neutral-200 dark:border-neutral-800"
                        >
                          <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white">
                            {s(c.type)}
                          </td>
                          <td className="px-3 py-2">
                            {s(c.certificateNumber, "—")}
                          </td>
                          <td className="px-3 py-2">
                            {c.issueDate ? formatDate(c.issueDate) : "—"}
                          </td>
                          <td className="px-3 py-2">
                            {c.expiryDate ? formatDate(c.expiryDate) : "—"}
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant="secondary" className="text-xs">
                              {s(c.status)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>

                <TableShell
                  title="Courses"
                  icon={<GraduationCap className="h-4 w-4" />}
                  empty={courses.length === 0}
                >
                  <table className="min-w-[980px] w-full text-xs sm:text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr className="text-left">
                        <th className="px-3 py-2 font-semibold">Course</th>
                        <th className="px-3 py-2 font-semibold">Institution</th>
                        <th className="px-3 py-2 font-semibold">
                          Duration (weeks)
                        </th>
                        <th className="px-3 py-2 font-semibold">Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c: any) => (
                        <tr
                          key={c.id}
                          className="border-t border-neutral-200 dark:border-neutral-800"
                        >
                          <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white">
                            {s(c.name)}
                          </td>
                          <td className="px-3 py-2">{s(c.institution)}</td>
                          <td className="px-3 py-2">{s(c.durationWeeks)}</td>
                          <td className="px-3 py-2">{s(c.year)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </div>
            </TabsContent>

            {/* Attachments */}
            <TabsContent value="attachments">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      Files & Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                    {/* Quick downloads */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 bg-neutral-50/60 dark:bg-neutral-900/40">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Quick Downloads
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          Resume from profile or the application itself
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <FileDownloadButton
                          url={application.resumeUrl || null}
                          fileName="Application Resume"
                        />
                        <FileDownloadButton
                          url={profile?.resumeUrl || null}
                          fileName="Profile Resume"
                        />
                      </div>
                    </div>

                    {/* Candidate files table */}
                    <TableShell
                      title="Candidate Uploaded Files"
                      icon={<Paperclip className="h-4 w-4" />}
                      empty={files.length === 0}
                    >
                      <table className="min-w-[1100px] w-full text-xs sm:text-sm">
                        <thead className="bg-neutral-50 dark:bg-neutral-900">
                          <tr className="text-left">
                            <th className="px-3 py-2 font-semibold">
                              Category
                            </th>
                            <th className="px-3 py-2 font-semibold">Title</th>
                            <th className="px-3 py-2 font-semibold">
                              Filename
                            </th>
                            <th className="px-3 py-2 font-semibold">Type</th>
                            <th className="px-3 py-2 font-semibold">Size</th>
                            <th className="px-3 py-2 font-semibold">
                              Uploaded
                            </th>
                            <th className="px-3 py-2 font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {files.map((f: any) => {
                            const href = f.fileUrl
                              ? (getFileUrl(f.fileUrl) ?? f.fileUrl)
                              : null;
                            return (
                              <tr
                                key={f.id}
                                className="border-t border-neutral-200 dark:border-neutral-800"
                              >
                                <td className="px-3 py-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {s(f.category, "OTHER")}
                                  </Badge>
                                </td>
                                <td className="px-3 py-2">{s(f.title, "—")}</td>
                                <td className="px-3 py-2 font-medium text-neutral-900 dark:text-white">
                                  {s(f.fileName)}
                                </td>
                                <td className="px-3 py-2">
                                  {s(f.mimeType, "—")}
                                </td>
                                <td className="px-3 py-2">
                                  {formatBytes(f.fileSize)}
                                </td>
                                <td className="px-3 py-2">
                                  {f.createdAt
                                    ? formatDateTime(f.createdAt)
                                    : "—"}
                                </td>
                                <td className="px-3 py-2">
                                  {href ? (
                                    <Button asChild size="sm" variant="outline">
                                      <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                      </a>
                                    </Button>
                                  ) : (
                                    "—"
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </TableShell>
                  </CardContent>
                </Card>

                {/* Timeline stays separate here for convenience */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      Application Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    {application.statusHistory &&
                    application.statusHistory.length > 0 ? (
                      <div className="space-y-4">
                        {application.statusHistory.map((history, index) => (
                          <div key={history.id} className="flex gap-3 sm:gap-4">
                            <div className="relative">
                              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
                              </div>
                              {index <
                                application.statusHistory!.length - 1 && (
                                <div className="absolute top-9 sm:top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-neutral-200 dark:bg-neutral-800" />
                              )}
                            </div>
                            <div className="flex-1 pb-6 sm:pb-8 min-w-0">
                              <p className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">
                                Status changed to {history.toStatus}
                              </p>
                              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                {formatDateTime(history.changedAt)}
                              </p>
                              {history.reason && (
                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                                  {history.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                        No timeline available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="lg:sticky lg:top-24">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Application Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                    <SelectItem value="INTERVIEW">Interview</SelectItem>
                    <SelectItem value="OFFERED">Offered</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Rating (1–5)</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          rating && rating >= star
                            ? "fill-orange-500 text-orange-500"
                            : "text-neutral-300 dark:text-neutral-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Internal Notes</Label>
                <Textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add private notes about this candidate..."
                  className="min-h-[110px] text-xs sm:text-sm"
                />
              </div>

              <Button
                onClick={handleUpdateStatus}
                disabled={updating}
                size="sm"
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>

              {(newStatus === "INTERVIEW" ||
                application.status === "INTERVIEW") && (
                <Button
                  onClick={() => setShowScheduleModal(true)}
                  size="sm"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              )}

              <div className="grid gap-2">
                <FileDownloadButton
                  url={profile?.resumeUrl || null}
                  fileName="Resume"
                />
                {application.portfolioUrl ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <a
                      href={application.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Open Portfolio
                    </a>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
              <SimpleKV
                icon={<Briefcase className="h-4 w-4" />}
                label="Applied For"
                value={s(application.job?.title)}
              />
              <SimpleKV
                icon={<Building2 className="h-4 w-4" />}
                label="Company"
                value={s(application.job?.company?.name)}
              />
              <SimpleKV
                icon={<Calendar className="h-4 w-4" />}
                label="Applied On"
                value={formatDateTime(application.appliedAt)}
              />
              <SimpleKV
                icon={<Clock className="h-4 w-4" />}
                label="Reviewed On"
                value={
                  application.reviewedAt
                    ? formatDateTime(application.reviewedAt)
                    : "—"
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interview scheduling modal */}
      <ScheduleInterviewModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
        application={
          application
            ? {
                id: application.id,
                jobId: application.job.id,
                candidateId: application.candidate.id,
                candidate: {
                  firstName: application.candidate.firstName,
                  lastName: application.candidate.lastName,
                  email: application.candidate.email,
                  phone: application.candidate.phone,
                },
                job: {
                  title: application.job.title,
                },
              }
            : null
        }
        onSuccess={() => {
          fetchApplication();
          toast.success("Interview scheduled! Status updated automatically.");
        }}
      />
    </div>
  );
}
