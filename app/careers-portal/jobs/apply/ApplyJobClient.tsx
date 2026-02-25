"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCandidate } from "@/hooks/useCandidate";
import { candidateService } from "@/services/recruitment-services";
import { api } from "@/lib/apiClient";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Textarea } from "@/components/careers/ui/textarea";
import { Label } from "@/components/careers/ui/label";
import { Checkbox } from "@/components/careers/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Badge } from "@/components/careers/ui/badge";
import { Separator } from "@/components/careers/ui/separator";
import { useToast } from "@/components/admin/ui/Toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/careers/ui/dialog";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Send,
  Eye,
  Calendar,
  Shield,
  Banknote,
  Sparkles,
  Target,
} from "lucide-react";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";
import { getFileUrl } from "@/lib/configuration";

function ApplyJobContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { profile, loading: profileLoading, fetchProfile } = useCandidate();

  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState<any>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: "",
    portfolioUrl: "",
    expectedSalary: "",
    availableStartDate: "",
    privacyConsent: false,
  });

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/careers-portal/jobs/apply?jobId=${jobId}`);
      return;
    }
    if (user.role !== "CANDIDATE") {
      router.push("/careers-portal");
      return;
    }

    if (!jobId) {
      showToast({
        type: "error",
        title: "Error",
        message: "No job ID provided",
      });
      router.push("/careers-portal/jobs");
      return;
    }

    fetchProfile();
    fetchJobDetails();
  }, [user, jobId, router]);

  useEffect(() => {
    if (profile && !formData.portfolioUrl) {
      setFormData((prev) => ({
        ...prev,
        portfolioUrl: profile.portfolioUrl || "",
      }));
    }
  }, [profile]);

  const fetchJobDetails = async () => {
    try {
      setJobLoading(true);
      const response = await api.get(`/jobs/${jobId}`);
      if (response.success) {
        setJob(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch job:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load job details",
      });
    } finally {
      setJobLoading(false);
    }
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and empty string
    if (value === "" || /^\d+$/.test(value)) {
      setFormData({
        ...formData,
        expectedSalary: value,
      });
    }
  };

  const handleSubmit = async () => {
    setShowConfirmDialog(false);

    if (!profile?.resumeUrl) {
      showToast({
        type: "error",
        title: "Resume Required",
        message: "Please upload your resume before applying",
      });
      router.push("/careers-portal/profile?tab=resume");
      return;
    }

    try {
      setIsSubmitting(true);

      const applicationData = {
        jobId: jobId as string,
        coverLetter: formData.coverLetter.trim(),
        resumeUrl: profile.resumeUrl,
        portfolioUrl: formData.portfolioUrl?.trim() || undefined,
        expectedSalary: `${formData.expectedSalary}`,
        availableStartDate: new Date(formData.availableStartDate).toISOString(),
        privacyConsent: formData.privacyConsent,
      };

      console.log("Submitting application with data:", applicationData);

      const response = await candidateService.applyToJob(applicationData);

      console.log("Application response:", response);

      showToast({
        type: "success",
        title: "Application Submitted Successfully!",
        message: `Your application has been sent to ${
          job?.company?.name || "the employer"
        }. We'll notify you when they review your application.`,
      });

      setTimeout(() => {
        router.push("/careers-portal/applications");
      }, 2000);
    } catch (error: any) {
      console.error("Apply error:", error);

      let errorMessage = "Failed to submit application. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast({
        type: "error",
        title: "Application Failed",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreSubmitCheck = () => {
    if (!profile?.resumeUrl) {
      showToast({
        type: "error",
        title: "Resume Required",
        message: "Please upload your resume before applying",
      });
      router.push("/careers-portal/profile?tab=resume");
      return;
    }

    if (!formData.coverLetter.trim()) {
      showToast({
        type: "error",
        title: "Cover Letter Required",
        message: "Please write a cover letter to apply",
      });
      return;
    }

    if (formData.coverLetter.length < 50) {
      showToast({
        type: "error",
        title: "Cover Letter Too Short",
        message: "Your cover letter should be at least 50 characters",
      });
      return;
    }

    if (!formData.expectedSalary.trim()) {
      showToast({
        type: "error",
        title: "Expected Salary Required",
        message: "Please provide your expected salary",
      });
      return;
    }

    if (!formData.availableStartDate) {
      showToast({
        type: "error",
        title: "Start Date Required",
        message: "Please provide your available start date",
      });
      return;
    }

    if (!formData.privacyConsent) {
      showToast({
        type: "error",
        title: "Privacy Consent Required",
        message: "Please accept the privacy policy to continue",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (profileLoading || jobLoading) {
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Navbar />

      <main className="flex-1 py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <Button
            asChild
            variant="ghost"
            className="mb-6 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Link href={`/careers-portal/jobs/job-detail?id=${jobId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Job Details
            </Link>
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Application Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="animate-fade-in border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-linear-to-r from-primary-500 to-orange-500 rounded-lg">
                      <Send className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-neutral-900 dark:text-white">
                        Job Application
                      </CardTitle>
                      <CardDescription className="text-neutral-600 dark:text-neutral-400">
                        Applying for {job?.title || "this position"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resume Check */}
                  {!profile?.resumeUrl ? (
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-900 dark:text-orange-200 mb-1">
                          Resume Required
                        </p>
                        <p className="text-sm text-orange-800 dark:text-orange-300 mb-3">
                          You must upload your resume before applying to jobs
                        </p>
                        <Button
                          asChild
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Link href="/careers-portal/profile?tab=resume">
                            <FileText className="h-4 w-4 mr-2" />
                            Upload Resume Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <div>
                            <p className="font-semibold text-green-900 dark:text-green-200">
                              Resume Ready
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Last updated:{" "}
                              {profile.resumeUpdatedAt
                                ? formatDate(profile.resumeUpdatedAt)
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-green-300 dark:border-green-700"
                        >
                          <a
                            href={
                              getFileUrl(profile.resumeUrl ?? undefined) ??
                              undefined
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Cover Letter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold text-neutral-900 dark:text-white">
                        Cover Letter <span className="text-red-500">*</span>
                      </Label>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {formData.coverLetter.length} / 5000
                      </span>
                    </div>
                    <Textarea
                      value={formData.coverLetter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coverLetter: e.target.value,
                        })
                      }
                      placeholder="Write a compelling cover letter that highlights why you're the perfect fit for this role...

Example structure:
• Opening: Express your enthusiasm for the position
• Body: Highlight relevant skills and experiences
• Closing: Reiterate your interest and availability

Dear Hiring Manager,

I am excited to apply for [Position] at [Company]. With my [X years] of experience in [field/industry], I have developed strong skills in [relevant skills]...

[Explain why you're interested in this role and company]...

[Share specific achievements that demonstrate your qualifications]...

I am particularly drawn to this opportunity because [specific reasons]...

Thank you for considering my application. I look forward to discussing how I can contribute to your team.

Best regards,
[Your name]"
                      className="min-h-[350px] text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-mono text-sm leading-relaxed"
                      required
                      minLength={50}
                      maxLength={5000}
                    />
                    {formData.coverLetter.length > 0 &&
                      formData.coverLetter.length < 50 && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          At least {50 - formData.coverLetter.length} more
                          characters required
                        </p>
                      )}
                  </div>

                  <Separator />

                  {/* Expected Salary */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="expectedSalary"
                      className="text-base font-semibold text-neutral-900 dark:text-white"
                    >
                      Expected Salary (Monthly){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                        <Banknote className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                          KES
                        </span>
                      </div>
                      <Input
                        id="expectedSalary"
                        type="text"
                        inputMode="numeric"
                        value={formData.expectedSalary}
                        onChange={handleSalaryChange}
                        placeholder="50000"
                        className="pl-[70px] text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-medium text-lg"
                        required
                        maxLength={10}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      Enter your expected monthly salary amount
                    </p>
                    {formData.expectedSalary && (
                      <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        = KES{" "}
                        {parseInt(formData.expectedSalary).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Available Start Date */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="availableStartDate"
                      className="text-base font-semibold text-neutral-900 dark:text-white"
                    >
                      Available Start Date{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                      <Input
                        id="availableStartDate"
                        type="date"
                        value={formData.availableStartDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availableStartDate: e.target.value,
                          })
                        }
                        min={getMinDate()}
                        className="pl-10 text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
                        required
                      />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      When can you start working if selected?
                    </p>
                  </div>

                  <Separator />

                  {/* Portfolio URL */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="portfolioUrl"
                      className="text-base font-semibold text-neutral-900 dark:text-white"
                    >
                      Portfolio / Website (Optional)
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        id="portfolioUrl"
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            portfolioUrl: e.target.value,
                          })
                        }
                        placeholder="https://yourportfolio.com"
                        className="pl-10 text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
                      />
                    </div>
                    {profile?.portfolioUrl && !formData.portfolioUrl && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        💡 We've pre-filled this from your profile:{" "}
                        {profile.portfolioUrl}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Privacy Consent */}
                  <div className="space-y-4 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                      <div className="flex-1 space-y-3">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-base">
                          Privacy & Data Protection
                        </h4>

                        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                          By submitting this application, you consent to the
                          processing of your personal data for recruitment
                          purposes in accordance with our{" "}
                          <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-semibold hover:text-blue-700 dark:hover:text-blue-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Privacy Policy
                          </a>
                          .
                        </p>

                        <div className="flex items-start gap-3 pt-2 bg-white dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-700">
                          <Checkbox
                            id="privacyConsent"
                            checked={formData.privacyConsent}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                privacyConsent: checked as boolean,
                              })
                            }
                            className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            required
                          />

                          <Label
                            htmlFor="privacyConsent"
                            className="text-sm text-blue-900 dark:text-blue-200 cursor-pointer leading-relaxed font-medium flex-1"
                          >
                            I agree to the processing of my personal information
                            in accordance with the Privacy Policy{" "}
                            <span className="text-red-500 ml-0.5">*</span>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handlePreSubmitCheck}
                      disabled={isSubmitting || !profile?.resumeUrl}
                      className="w-full bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white text-lg py-6 shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Review & Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Profile Summary */}
            <div className="space-y-6">
              {/* Your Profile Card */}
              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary-500" />
                    Your Profile
                  </CardTitle>
                  <CardDescription>
                    Information that will be shared
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Personal Info */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-neutral-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {profile?.user?.firstName} {profile?.user?.lastName}
                        </p>
                        {profile?.title && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {profile.title}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-neutral-500 mt-0.5 shrink-0" />
                      <p className="text-neutral-700 dark:text-neutral-300 break-all">
                        {profile?.user?.email}
                      </p>
                    </div>

                    {profile?.user?.phone && (
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-neutral-500 mt-0.5 shrink-0" />
                        <p className="text-neutral-700 dark:text-neutral-300">
                          {profile.user.phone}
                        </p>
                      </div>
                    )}

                    {profile?.location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-neutral-500 mt-0.5 shrink-0" />
                        <p className="text-neutral-700 dark:text-neutral-300">
                          {profile.location}
                        </p>
                      </div>
                    )}

                    {profile?.experienceYears && (
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-4 w-4 text-neutral-500 mt-0.5 shrink-0" />
                        <p className="text-neutral-700 dark:text-neutral-300">
                          {profile.experienceYears}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Skills Summary */}
                  {profile?.skills && profile.skills.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary-500" />
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Top Skills
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills.slice(0, 6).map((cs: any) => (
                          <Badge
                            key={cs.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {cs.skill.name}
                          </Badge>
                        ))}
                        {profile.skills.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.skills.length - 6}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Education Summary */}
                  {profile?.educations && profile.educations.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-primary-500" />
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Latest Education
                        </p>
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {profile.educations[0].degree} in{" "}
                        {profile.educations[0].fieldOfStudy}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {profile.educations[0].institution}
                      </p>
                    </div>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                  >
                    <Link href="/careers-portal/profile">
                      <User className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Job Summary Card */}
              {job && (
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <CardHeader>
                    <CardTitle className="text-lg">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {job.title}
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        {job.company?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{job.location}</span>
                    </div>
                    <Badge>{job.type}</Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-3xl max-h-[95vh] overflow-hidden flex flex-col p-0">
          {/* Header - Fixed at top */}
          <div className="px-6 pt-6 pb-4 bg-linear-to-r from-primary-500 to-orange-500">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-white mb-1">
                    Ready to Submit?
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-base">
                    Let's make sure everything looks perfect before sending your
                    application
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Job Info - Prominent Display */}
              <Card className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      Applying For
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                    {job?.title}
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium">
                    {job?.company?.name}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job?.location}</span>
                    <span>•</span>
                    <Badge
                      variant="outline"
                      className="border-blue-300 dark:border-blue-700"
                    >
                      {job?.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Expected Salary
                      </span>
                    </div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      KES {parseInt(formData.expectedSalary).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Start Date
                      </span>
                    </div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {formatDate(formData.availableStartDate)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Applicant Quick Info */}
              <Card className="border-neutral-200 dark:border-neutral-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Your Information
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Name:
                      </span>
                      <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                        {profile?.user?.firstName} {profile?.user?.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Email:
                      </span>
                      <span className="ml-2 font-medium text-neutral-900 dark:text-white truncate">
                        {profile?.user?.email}
                      </span>
                    </div>
                    {profile?.user?.phone && (
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Phone:
                        </span>
                        <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                          {profile.user.phone}
                        </span>
                      </div>
                    )}
                    {profile?.location && (
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Location:
                        </span>
                        <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                          {profile.location}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter Preview - Compact */}
              <Card className="border-neutral-200 dark:border-neutral-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                        Cover Letter
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formData.coverLetter.length} characters
                    </span>
                  </div>
                  <div className="max-h-32 overflow-y-auto p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                      {formData.coverLetter}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Resume Attachment */}
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                          Resume Attached
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Updated{" "}
                          {profile?.resumeUpdatedAt
                            ? formatDate(profile.resumeUpdatedAt)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 border-green-300 dark:border-green-700"
                    >
                      <a
                        href={profile?.resumeUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio (if provided) */}
              {formData.portfolioUrl && (
                <Card className="border-neutral-200 dark:border-neutral-700">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                        Portfolio
                      </span>
                    </div>
                    <a
                      href={formData.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1 block truncate"
                    >
                      {formData.portfolioUrl}
                    </a>
                  </CardContent>
                </Card>
              )}

              {/* Privacy Confirmation */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Privacy consent confirmed ✓
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* What Happens Next */}
              <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                      What Happens Next
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>
                        Your application will be sent to {job?.company?.name}{" "}
                        instantly
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>
                        You'll receive email confirmation within minutes
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>
                        Track your application status in your dashboard
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>
                        We'll notify you when the employer reviews your
                        application
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
            <DialogFooter className="gap-3 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-1"
              >
                Go Back & Edit
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 sm:flex-1 bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white shadow-lg"
              >
                {isSubmitting ? (
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
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApplyJobContent;
