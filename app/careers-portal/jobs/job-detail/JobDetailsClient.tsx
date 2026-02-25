"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { candidateService, jobsService } from "@/services/recruitment-services";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { Separator } from "@/components/careers/ui/separator";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";

import {
  Loader2,
  ArrowLeft,
  MapPin,
  Banknote,
  Clock,
  Building2,
  Briefcase,
  CheckCircle2,
  Calendar,
  Globe,
  Share2,
  Send,
  Award,
  Target,
  TrendingUp,
  Package,
  Info,
} from "lucide-react";

import { useToast } from "@/components/admin/ui/Toast";
import type { Job } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { normalizeImageUrl } from "@/lib/imageUtils";

// ✅ REMOVED: Profile eligibility gate imports (no longer blocking apply)
// import { useJobProfileEligibility } from "@/hooks/useJobProfileEligibility";
// import { ProfileRequirementGateCard } from "@/components/careers/jobs/ProfileRequirementGateCard";

/**
 * Supports string | string[] | null | undefined
 */
const parseTextToList = (text?: string | string[] | null) => {
  if (!text) return [];
  if (Array.isArray(text)) {
    return text.map((x) => String(x).trim()).filter(Boolean);
  }
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
};

export default function JobDetailsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();

  const jobId = searchParams.get("id");

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);

  // ✅ REMOVED: Eligibility checking logic (no longer needed)
  // const eligibilityEnabled = !!user && user.role === "CANDIDATE" && !!jobId;
  // const { eligibility } = useJobProfileEligibility({
  //   jobId,
  //   enabled: eligibilityEnabled,
  // });

  // ✅ REMOVED: blockApply logic (apply button is never blocked)
  // const blockApply =
  //   user?.role === "CANDIDATE" &&
  //   eligibility &&
  //   eligibility.totalRequired > 0 &&
  //   !eligibility.isEligible;

  // Memoized function to check application status
  const checkApplicationStatus = useCallback(async () => {
    if (!user || user.role !== "CANDIDATE" || !jobId) {
      setCheckingApplication(false);
      return;
    }

    try {
      setCheckingApplication(true);
      const response = await candidateService.getApplications();
      if (response.success && response.data) {
        // Exclude WITHDRAWN applications from hasApplied check
        const applied = response.data.applications.some(
          (app: any) => app.jobId === jobId && app.status !== "WITHDRAWN",
        );
        setHasApplied(applied);
      }
    } catch (error) {
      console.error("Failed to check application status:", error);
    } finally {
      setCheckingApplication(false);
    }
  }, [jobId, user]);

  useEffect(() => {
    if (!jobId) {
      router.push("/careers-portal/jobs");
      return;
    }
    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    if (user && user.role === "CANDIDATE") {
      checkApplicationStatus();
    } else {
      setCheckingApplication(false);
    }
  }, [user, checkApplicationStatus]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user && user.role === "CANDIDATE") {
        checkApplicationStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, checkApplicationStatus]);

  useEffect(() => {
    const handleFocus = () => {
      if (user && user.role === "CANDIDATE") {
        checkApplicationStatus();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, checkApplicationStatus]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobsService.getJobById(jobId!);
      if (response.success && response.data) {
        setJob(response.data);
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to load job details",
      });
      router.push("/careers-portal/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${job?.title} at ${job?.company?.name}`;
    const shareText = `Check out this job opportunity: ${job?.title} at ${job?.company?.name}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showToast({
          type: "success",
          title: "Shared Successfully!",
          message: "Job link has been shared",
        });
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
          fallbackCopyToClipboard(shareUrl);
        }
      }
    } else {
      fallbackCopyToClipboard(shareUrl);
    }
  };

  const fallbackCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast({
        type: "success",
        title: "Link Copied!",
        message: "Job link has been copied to your clipboard",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast({
        type: "error",
        title: "Copy Failed",
        message: "Failed to copy link to clipboard",
      });
    }
  };

  const formatSalary = (job: Job) => {
    const currencySymbol =
      job.currency === "USD"
        ? "$"
        : job.currency === "KSH"
          ? "KSh"
          : job.currency || "$";

    switch (job.salaryType) {
      case "RANGE":
        if (job.salaryMin && job.salaryMax) {
          return `${currencySymbol}${(job.salaryMin / 1000).toFixed(
            0,
          )}k - ${currencySymbol}${(job.salaryMax / 1000).toFixed(0)}k`;
        }
        return "Competitive Salary";
      case "SPECIFIC":
        return job.specificSalary
          ? `${currencySymbol}${(job.specificSalary / 1000).toFixed(0)}k`
          : "Competitive Salary";
      case "NEGOTIABLE":
        return "Negotiable";
      case "NOT_DISCLOSED":
        return "Competitive Salary";
      default:
        return "Competitive Salary";
    }
  };

  const formatDate = (dateString: string): string => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const formatExperienceLevel = (level: string) => {
    return level.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatJobType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Compute parsed lists once
  const responsibilitiesList = useMemo(
    () => parseTextToList(job?.responsibilities),
    [job?.responsibilities],
  );
  const requirementsList = useMemo(
    () => parseTextToList(job?.requirements),
    [job?.requirements],
  );
  const niceToHaveList = useMemo(
    () => parseTextToList(job?.niceToHave),
    [job?.niceToHave],
  );
  const benefitsList = useMemo(
    () => parseTextToList(job?.benefits),
    [job?.benefits],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Info className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Job Not Found
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="bg-primary-500 hover:bg-primary-600">
              <Link href="/careers-portal/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Navbar />

      <main className="flex-1 bg-neutral-50 dark:bg-neutral-900">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-primary-500 to-orange-500 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <Button
              asChild
              variant="ghost"
              className="mb-6 text-white/90 hover:text-white hover:bg-white/10"
            >
              <Link href="/careers-portal/jobs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>

            <div className="flex items-start gap-6">
              {/* Company Logo */}
              <div className="shrink-0">
                {job.company.logo ? (
                  <img
                    src={normalizeImageUrl(job.company.logo)}
                    alt={job.company.name}
                    className="h-20 w-20 rounded-xl object-cover bg-white border-2 border-white/20 shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logo.png";
                    }}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 shadow-lg">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>

              {/* Job Title & Meta */}
              <div className="flex-1 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {job.category.name}
                  </Badge>
                  {job.featured && (
                    <Badge className="bg-orange-500 text-white border-none">
                      Featured
                    </Badge>
                  )}
                  {job.isRemote && (
                    <Badge className="bg-green-500 text-white border-none">
                      Remote
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold mb-3">{job.title}</h1>

                <p className="text-xl text-white/90 font-medium mb-4">
                  {job.company.name}
                </p>

                <div className="flex flex-wrap gap-4 text-white/80">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {formatJobType(job.type)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Banknote className="h-4 w-4" />
                    {formatSalary(job)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {formatDate(job.publishedAt || job.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Job Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Description */}
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary-500" />
                      Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                      {job.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Responsibilities */}
                {responsibilitiesList.length > 0 && (
                  <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-500" />
                        Key Responsibilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {responsibilitiesList.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Requirements */}
                {requirementsList.length > 0 && (
                  <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Requirements & Qualifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {requirementsList.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Nice to Have */}
                {niceToHaveList.length > 0 && (
                  <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        Nice to Have
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {niceToHaveList.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary-500" />
                        Required Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((jobSkill) => (
                          <Badge
                            key={jobSkill.id}
                            className={
                              jobSkill.required
                                ? "bg-primary-500 text-white hover:bg-primary-600"
                                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                            }
                          >
                            {jobSkill.skill.name}
                            {jobSkill.required && " *"}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">
                        * Required skills
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Benefits */}
                {benefitsList.length > 0 && (
                  <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Package className="h-5 w-5 text-purple-500" />
                        Benefits & Perks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {benefitsList.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800"
                          >
                            <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* About Company */}
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary-500" />
                      About {job.company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {job.company.description && (
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {job.company.description}
                      </p>
                    )}

                    <Separator />

                    <div className="grid md:grid-cols-2 gap-4">
                      {job.company.industry && (
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            Industry
                          </p>
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {job.company.industry}
                          </p>
                        </div>
                      )}
                      {job.company.companySize && (
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            Company Size
                          </p>
                          <p className="font-semibold text-neutral-900 dark:text-white">
                            {job.company.companySize}
                          </p>
                        </div>
                      )}
                      {job.company.location && (
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            Headquarters
                          </p>
                          <p className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.company.location}
                          </p>
                        </div>
                      )}
                      {job.company.website && (
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            Website
                          </p>
                          <a
                            href={job.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                          >
                            {job.company.website
                              .replace(/^https?:\/\//, "")
                              .split("/")[0]}
                            <Globe className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    {job.company.verified && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-200">
                          Verified Company
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* ✅ REMOVED: ProfileRequirementGateCard (no longer blocks apply) */}

                {/* Apply Card */}
                <Card className="sticky top-24 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    {checkingApplication ? (
                      <Button disabled className="w-full" size="lg">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Checking Status...
                      </Button>
                    ) : user && user.role === "CANDIDATE" ? (
                      hasApplied ? (
                        <div className="space-y-3">
                          <Button
                            disabled
                            size="lg"
                            className="w-full bg-green-600 hover:bg-green-600"
                          >
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            Already Applied
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full border-neutral-300 dark:border-neutral-700"
                          >
                            <Link href="/careers-portal/applications">
                              View My Applications
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        // ✅ SIMPLIFIED: Always allow apply if not already applied
                        <Button
                          asChild
                          size="lg"
                          className="w-full bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white shadow-lg"
                        >
                          <Link href={`/careers-portal/jobs/apply?jobId=${jobId}`}>
                            <Send className="h-5 w-5 mr-2" />
                            Apply for this Job
                          </Link>
                        </Button>
                      )
                    ) : (
                      <Button
                        asChild
                        size="lg"
                        className="w-full bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white shadow-lg"
                      >
                        <Link
                          href={`/login?redirect=/careers-portal/job-detail?id=${jobId}`}
                        >
                          <Send className="h-5 w-5 mr-2" />
                          Login to Apply
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="w-full border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      size="lg"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Share Job
                    </Button>
                  </CardContent>
                </Card>

                {/* Job Overview */}
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                      Job Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Job Type
                      </p>
                      <p className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary-500" />
                        {formatJobType(job.type)}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Experience Level
                      </p>
                      <p className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary-500" />
                        {formatExperienceLevel(job.experienceLevel)}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Salary Range
                      </p>
                      <p className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-green-500" />
                        {formatSalary(job)}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Location
                      </p>
                      <p className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        {job.location}
                        {job.isRemote && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            Remote OK
                          </Badge>
                        )}
                      </p>
                    </div>

                    {job.expiresAt && (
                      <>
                        <Separator />
                        <div className="space-y-1">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Application Deadline
                          </p>
                          <p className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-red-500" />
                            {new Date(job.expiresAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </>
                    )}

                    {job.domains && job.domains.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Domains
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.domains.map((jobDomain) => (
                              <Badge
                                key={jobDomain.id}
                                variant="outline"
                                className="border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300"
                              >
                                {jobDomain.domain.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
