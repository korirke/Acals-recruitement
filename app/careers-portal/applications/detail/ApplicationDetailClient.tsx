"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { candidateService } from "@/services/recruitment-services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { Separator } from "@/components/careers/ui/separator";
import {
  Loader2,
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Globe,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { getFileUrl } from "@/lib/configuration";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";

const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string; icon: any; label: string }> =
    {
      PENDING: {
        color: "bg-yellow-500",
        icon: Clock,
        label: "Pending Review",
      },
      REVIEWED: { color: "bg-blue-500", icon: CheckCircle2, label: "Reviewed" },
      SHORTLISTED: {
        color: "bg-purple-500",
        icon: CheckCircle2,
        label: "Shortlisted",
      },
      INTERVIEW: {
        color: "bg-indigo-500",
        icon: Calendar,
        label: "Interview Scheduled",
      },
      OFFERED: {
        color: "bg-green-500",
        icon: CheckCircle2,
        label: "Offer Extended",
      },
      ACCEPTED: {
        color: "bg-green-600",
        icon: CheckCircle2,
        label: "Offer Accepted",
      },
      REJECTED: {
        color: "bg-red-500",
        icon: XCircle,
        label: "Not Selected",
      },
      WITHDRAWN: {
        color: "bg-gray-500",
        icon: XCircle,
        label: "Withdrawn",
      },
    };
  return configs[status] || configs.PENDING;
};

export default function ApplicationDetailClient() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("id");

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push(
        `/login?redirect=/careers-portal/applications/detail?id=${applicationId}`
      );
      return;
    }
    if (user.role !== "CANDIDATE") {
      router.push("/careers-portal");
      return;
    }

    if (!applicationId) {
      router.push("/careers-portal/applications");
      return;
    }

    fetchApplication();
  }, [user, applicationId, router]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await candidateService.getApplication(applicationId!);
      if (response.success) {
        setApplication(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch application:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return "Not disclosed";
    if (min && max)
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
    return "Negotiable";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Application Not Found
            </h2>
            <Button asChild>
              <Link href="/careers-portal/applications">
                Back to Applications
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <Navbar />
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/careers-portal/applications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Link>
          </Button>

          {/* Status Header */}
          <Card className="mb-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 ${statusConfig.color} rounded-full`}>
                  <StatusIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {statusConfig.label}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Applied on {formatDate(application.appliedAt)}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              {application.statusHistory &&
                application.statusHistory.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                      Application Timeline
                    </h3>
                    <div className="space-y-3">
                      {application.statusHistory.map(
                        (history: any, index: number) => (
                          <div
                            key={history.id}
                            className="flex items-start gap-3"
                          >
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                index === 0
                                  ? "bg-primary-500"
                                  : "bg-neutral-300 dark:bg-neutral-700"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-neutral-900 dark:text-white">
                                {getStatusConfig(history.toStatus).label}
                              </p>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {formatDate(history.changedAt)}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card className="mb-6 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary-500" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  {application.job.title}
                </h3>
                <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">
                      {application.job.company.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{application.job.location}</span>
                  </div>
                  <Badge>{application.job.type}</Badge>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Salary Range
                  </p>
                  <p className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary(
                      application.job.salaryMin,
                      application.job.salaryMax,
                      application.job.currency || "USD"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Category
                  </p>
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {application.job.category.name}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Description
                </p>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {application.job.description}
                </p>
              </div>

              <Button asChild variant="outline" className="w-full">
                <Link href={`/careers-portal/jobs/job-detail?id=${application.job.id}`}>
                  View Full Job Details
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Your Application */}
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-500" />
                Your Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.coverLetter && (
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Cover Letter
                  </p>
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                      {application.coverLetter}
                    </p>
                  </div>
                </div>
              )}

              {application.resumeUrl && (
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Resume
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={getFileUrl(application.resumeUrl!) ?? undefined}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download Resume
                    </a>
                  </Button>
                </div>
              )}

              {application.portfolioUrl && (
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Portfolio
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={application.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      View Portfolio
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}