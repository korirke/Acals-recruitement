"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApplicationPipelineFormData } from "@/types";
import { jobApplicationPipelineService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";
import { Button } from "@/components/careers/ui/button";
import { Loader2, ArrowLeft, Send, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Form sections
import ResumeUploadSection from "./pipeline/ResumeUploadSection";
import BasicInfoSection from "./pipeline/BasicInfoSection";
import SkillsSection from "./pipeline/SkillsSection";
import ExperienceSection from "./pipeline/ExperienceSection";
import EducationSection from "./pipeline/EducationSection";
import PersonalInfoSection from "./pipeline/PersonalInfoSection";
import PublicationsSection from "./pipeline/PublicationsSection";
import MembershipsSection from "./pipeline/MembershipsSection";
import ClearancesSection from "./pipeline/ClearancesSection";
import CoursesSection from "./pipeline/CoursesSection";
import RefereesSection from "./pipeline/RefereesSection";
import DocumentsSection from "./pipeline/DocumentsSection";
import ApplicationDetailsSection from "./pipeline/ApplicationDetailsSection";
import ConfirmationModal from "./pipeline/ConfirmationModal";

interface FormState {
  basic: {
    title?: string;
    location?: string;
    bio?: string;
    phone?: string;
    portfolioUrl?: string;
  };
  skills: Array<{ skillName: string; level?: string; yearsOfExp?: number }>;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    grade?: string;
  }>;
  personalInfo: {
    fullName?: string;
    dob?: string;
    gender?: "M" | "F" | "Other";
    idNumber?: string;
    nationality?: string;
    countyOfOrigin?: string;
    plwd?: boolean;
  };
  publications: Array<{
    title: string;
    type: string;
    journalOrPublisher?: string;
    year: number;
    link?: string;
  }>;
  memberships: Array<{
    bodyName: string;
    membershipNumber?: string;
    isActive?: boolean;
    goodStanding?: boolean;
  }>;
  clearances: Array<{
    type: string;
    certificateNumber?: string;
    issueDate: string;
    expiryDate?: string;
    status?: "VALID" | "EXPIRED" | "PENDING";
  }>;
  courses: Array<{
    name: string;
    institution: string;
    durationWeeks: number;
    year: number;
  }>;
  referees: Array<{
    name: string;
    position?: string;
    organization?: string;
    phone?: string;
    email?: string;
  }>;
  coverLetter: string;
  portfolioUrl: string;
  expectedSalary: string;
  availableStartDate: string;
  privacyConsent: boolean;
  // track uploaded resume url (may differ from profile's existing one)
  resumeUrl?: string;
}

export default function ApplyJobPipelineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const jobId = searchParams.get("jobId");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pipelineData, setPipelineData] = useState<any>(null);

  const [formData, setFormData] = useState<FormState>({
    basic: {},
    skills: [],
    experience: [],
    education: [],
    personalInfo: {},
    publications: [],
    memberships: [],
    clearances: [],
    courses: [],
    referees: [],
    coverLetter: "",
    portfolioUrl: "",
    expectedSalary: "",
    availableStartDate: "",
    privacyConsent: false,
    resumeUrl: undefined,
  });

  // Wait for auth to resolve before redirecting
  useEffect(() => {
    if (authLoading) return; // don't act while auth is still loading

    if (!user || user.role !== "CANDIDATE") {
      router.push(`/login?redirect=/careers-portal/jobs/apply?jobId=${jobId}`);
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

    fetchPipelineData();
  }, [user, authLoading, jobId]);

  const fetchPipelineData = async () => {
    try {
      setLoading(true);
      const response = await jobApplicationPipelineService.getFormData(jobId!);

      if (response.success && response.data) {
        setPipelineData(response.data);

        console.log("Backend requirements:", response.data.requirements);

        // Pre-fill from profile snapshot
        const snapshot = response.data.profileSnapshot;
        setFormData((prev) => ({
          ...prev,
          resumeUrl: snapshot?.resumeUrl || undefined,
          basic: {
            title: snapshot?.basic?.title || "",
            location: snapshot?.basic?.location || "",
            bio: snapshot?.basic?.bio || "",
            phone: snapshot?.user?.phone || "",
            portfolioUrl: snapshot?.basic?.portfolioUrl || "",
          },
          portfolioUrl: snapshot?.basic?.portfolioUrl || "",
        }));
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to load form data",
      });
      router.push("/careers-portal/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handlePreSubmit = () => {
    if (!formData.coverLetter || formData.coverLetter.length < 150) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Cover letter must be at least 150 characters",
      });
      return;
    }
    if (!formData.expectedSalary) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Expected salary is required",
      });
      return;
    }
    if (!formData.availableStartDate) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Available start date is required",
      });
      return;
    }
    if (!formData.privacyConsent) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "You must accept the privacy policy",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);

    try {
      setSubmitting(true);

      const payload: ApplicationPipelineFormData = {
        jobId: jobId!,
        basic: formData.basic,
        skills: formData.skills.length > 0 ? formData.skills : undefined,
        experience:
          formData.experience.length > 0 ? formData.experience : undefined,
        education:
          formData.education.length > 0 ? formData.education : undefined,
        personalInfo: formData.personalInfo.fullName
          ? {
              fullName: formData.personalInfo.fullName!,
              dob: formData.personalInfo.dob!,
              gender: formData.personalInfo.gender!,
              idNumber: formData.personalInfo.idNumber!,
              nationality: formData.personalInfo.nationality!,
              countyOfOrigin: formData.personalInfo.countyOfOrigin!,
              plwd: formData.personalInfo.plwd,
            }
          : undefined,
        publications:
          formData.publications.length > 0 ? formData.publications : undefined,
        memberships:
          formData.memberships.length > 0 ? formData.memberships : undefined,
        clearances:
          formData.clearances.length > 0 ? formData.clearances : undefined,
        courses: formData.courses.length > 0 ? formData.courses : undefined,
        referees: formData.referees.length > 0 ? formData.referees : undefined,
        coverLetter: formData.coverLetter,
        portfolioUrl: formData.portfolioUrl,
        expectedSalary: formData.expectedSalary,
        availableStartDate: formData.availableStartDate,
        privacyConsent: formData.privacyConsent,
      };

      const response =
        await jobApplicationPipelineService.submitWithInlineUpdates(
          jobId!,
          payload,
        );

      if (response.success) {
        showToast({
          type: "success",
          title: "Success!",
          message: "Application submitted successfully!",
        });
        setTimeout(() => {
          router.push("/careers-portal/applications");
        }, 1500);
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Submission Failed",
        message: error.message || "Failed to submit application",
      });
    } finally {
      setSubmitting(false);
    }
  };

  //Show loading spinner while auth OR pipeline data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {authLoading
              ? "Checking authentication..."
              : "Loading application form..."}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const missingKeys = pipelineData?.requirements || [];
  const coreSections = [
    "BASIC_TITLE",
    "BASIC_LOCATION",
    "SKILLS",
    "EXPERIENCE",
    "EDUCATION",
  ];
  const effectiveMissingKeys = [...new Set([...coreSections, ...missingKeys])];

  const showBasic =
    effectiveMissingKeys.includes("BASIC_TITLE") ||
    effectiveMissingKeys.includes("BASIC_LOCATION") ||
    effectiveMissingKeys.includes("BASIC_BIO") ||
    effectiveMissingKeys.includes("BASIC_PHONE");

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Button */}
          <Button
            asChild
            variant="ghost"
            className="mb-6 -ml-2 text-neutral-600 dark:text-neutral-400"
          >
            <Link href={`/careers-portal/jobs/job-detail?id=${jobId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Job
            </Link>
          </Button>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-linear-to-r from-primary-500 to-orange-500 rounded-xl shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  Apply for {pipelineData?.job?.title}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 text-sm">
                  Complete the sections below. Pre-filled from your existing
                  profile.
                </p>
              </div>
            </div>
          </div>

          {/* Eligibility Banner */}
          {/* {pipelineData?.eligibility && (
            <div className="mb-6 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Profile Completion
                </span>
                <span className="text-sm font-bold text-primary-600">
                  {pipelineData.eligibility.completionPercentage ?? 0}%
                </span>
              </div>
              <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${pipelineData.eligibility.completionPercentage ?? 0}%` }}
                />
              </div>
              {pipelineData.eligibility.isEligible && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                    You meet all requirements for this position
                  </span>
                </div>
              )}
            </div>
          )} */}

          {/* Form Sections Stack */}
          <div className="space-y-5">
            {/* ① Resume Upload — ALWAYS at top */}
            <ResumeUploadSection
              resumeUrl={formData.resumeUrl}
              onResumeUploaded={(url) =>
                setFormData((prev) => ({ ...prev, resumeUrl: url }))
              }
            />

            {/* ② Basic Info */}
            {showBasic && (
              <BasicInfoSection
                data={formData.basic}
                onChange={(basic) => setFormData({ ...formData, basic })}
                missingKeys={effectiveMissingKeys}
              />
            )}

            {/* ③ Skills */}
            {effectiveMissingKeys.includes("SKILLS") && (
              <SkillsSection
                data={formData.skills}
                onChange={(skills) => setFormData({ ...formData, skills })}
                existingSkills={pipelineData?.profileSnapshot?.skills || []}
              />
            )}

            {/* ④ Experience */}
            {effectiveMissingKeys.includes("EXPERIENCE") && (
              <ExperienceSection
                data={formData.experience}
                onChange={(experience) =>
                  setFormData({ ...formData, experience })
                }
                existingExperience={
                  pipelineData?.profileSnapshot?.experience || []
                }
              />
            )}

            {/* ⑤ Education */}
            {effectiveMissingKeys.includes("EDUCATION") && (
              <EducationSection
                data={formData.education}
                onChange={(education) =>
                  setFormData({ ...formData, education })
                }
                existingEducation={
                  pipelineData?.profileSnapshot?.education || []
                }
              />
            )}

            {/* ⑥ Personal Info */}
            {effectiveMissingKeys.includes("PERSONAL_INFO") && (
              <PersonalInfoSection
                data={formData.personalInfo}
                onChange={(personalInfo) =>
                  setFormData({ ...formData, personalInfo })
                }
              />
            )}

            {/* ⑦ Compliance Sections */}
            {effectiveMissingKeys.includes("PUBLICATIONS") && (
              <PublicationsSection
                data={formData.publications}
                onChange={(publications) =>
                  setFormData({ ...formData, publications })
                }
                existingPublications={
                  pipelineData?.profileSnapshot?.publications || []
                }
              />
            )}

            {effectiveMissingKeys.includes("MEMBERSHIPS") && (
              <MembershipsSection
                data={formData.memberships}
                onChange={(memberships) =>
                  setFormData({ ...formData, memberships })
                }
                existingMemberships={
                  pipelineData?.profileSnapshot?.memberships || []
                }
              />
            )}

            {effectiveMissingKeys.includes("CLEARANCES") && (
              <ClearancesSection
                data={formData.clearances}
                onChange={(clearances) =>
                  setFormData({ ...formData, clearances })
                }
                existingClearances={
                  pipelineData?.profileSnapshot?.clearances || []
                }
              />
            )}

            {effectiveMissingKeys.includes("COURSES") && (
              <CoursesSection
                data={formData.courses}
                onChange={(courses) => setFormData({ ...formData, courses })}
                existingCourses={pipelineData?.profileSnapshot?.courses || []}
              />
            )}

            {effectiveMissingKeys.includes("REFEREES") && (
              <RefereesSection
                data={formData.referees}
                onChange={(referees) => setFormData({ ...formData, referees })}
                existingReferees={pipelineData?.profileSnapshot?.referees || []}
              />
            )}

            {/* ⑧ Documents */}
            {(effectiveMissingKeys.includes("DOCUMENT_NATIONAL_ID") ||
              effectiveMissingKeys.includes("DOCUMENT_ACADEMIC_CERT") ||
              effectiveMissingKeys.includes("DOCUMENT_PROFESSIONAL_CERT")) && (
              <DocumentsSection
                missingKeys={effectiveMissingKeys}
                existingFiles={pipelineData?.profileSnapshot?.files || []}
              />
            )}

            {/* ⑨ Application Details — ALWAYS last */}
            <ApplicationDetailsSection
              data={{
                coverLetter: formData.coverLetter,
                portfolioUrl: formData.portfolioUrl,
                expectedSalary: formData.expectedSalary,
                availableStartDate: formData.availableStartDate,
                privacyConsent: formData.privacyConsent,
              }}
              onChange={(details) =>
                setFormData({
                  ...formData,
                  coverLetter: details.coverLetter,
                  portfolioUrl: details.portfolioUrl,
                  expectedSalary: details.expectedSalary,
                  availableStartDate: details.availableStartDate,
                  privacyConsent: details.privacyConsent,
                })
              }
              resumeUrl={formData.resumeUrl}
            />

            {/* Submit Button */}
            <Button
              onClick={handlePreSubmit}
              disabled={submitting}
              className="w-full h-14 text-base font-semibold bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white shadow-lg shadow-primary-500/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Review & Submit Application
                </>
              )}
            </Button>

            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 pb-4">
              By submitting, your profile will be updated with any new
              information provided above.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {showConfirmModal && (
        <ConfirmationModal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmedSubmit}
          formData={formData}
          pipelineData={pipelineData}
          submitting={submitting}
        />
      )}
    </div>
  );
}
