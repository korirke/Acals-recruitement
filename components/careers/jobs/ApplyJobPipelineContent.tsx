"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { ApplicationPipelineFormData } from "@/types";
import { jobApplicationPipelineService } from "@/services/recruitment-services";
import { jobQuestionnaireService } from "@/services/recruitment-services/jobQuestionnaire.service";
import { useToast } from "@/components/admin/ui/Toast";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";
import { Button } from "@/components/careers/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Loader2, ArrowLeft, Send, Sparkles, FileText } from "lucide-react";
import Link from "next/link";

import ResumeUploadSection from "./pipeline/ResumeUploadSection";
import BasicInfoSection from "./pipeline/BasicInfoSection";
import QuestionnaireSection, {
  QuestionnaireAnswersState,
} from "./pipeline/QuestionnaireSection";
import SkillsSection from "./pipeline/SkillsSection";
import ExperienceSection from "./pipeline/ExperienceSection";
import GeneralExperienceSection from "./pipeline/GeneralExperienceSection";
import SpecificExperienceSection from "./pipeline/SpecificExperienceSection";
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

import type {
  JobApplicationConfigDTO,
  SectionKey,
} from "@/types/recruitment/profileRequirements.types";
import { DEFAULT_SECTION_ORDER } from "@/types/recruitment/profileRequirements.types";

// ─── Helpers ───

/** Normalise any PHP-returned plwd value (0 / 1 / "0" / "1" / bool) to boolean */
function normalisePlwd(value: unknown): boolean {
  if (value === true || value === 1 || value === "1") return true;
  return false;
}

// ─── Form State 

interface FormState {
  basic: {
    title?: string;
    location?: string;
    bio?: string;
    phone?: string;
    portfolioUrl?: string;
  };

  questionnaireAnswers: QuestionnaireAnswersState;

  personalInfo: {
    fullName?: string;
    dob?: string;
    gender?: "M" | "F" | "Other";
    idNumber?: string;
    nationality?: string;
    countyOfOrigin?: string;
    plwd?: boolean;
  };

  coverLetter: string;
  portfolioUrl: string;
  expectedSalary: string;
  currentSalary?: string;
  availableStartDate: string;
  privacyConsent: boolean;

  coverLetterFileUrl?: string;
  coverLetterFileName?: string;

  resumeUrl?: string;
}

// ─── Component ─

export default function ApplyJobPipelineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const jobId = searchParams.get("jobId");

  const [loading, setLoading] = useState(true);
  const [questionnaireLoading, setQuestionnaireLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [pipelineData, setPipelineData] = useState<any>(null);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);

  const [formData, setFormData] = useState<FormState>({
    basic: {},
    questionnaireAnswers: {},
    // Sensible defaults so gender is never undefined on first render
    personalInfo: { gender: "M", plwd: false },
    coverLetter: "",
    portfolioUrl: "",
    expectedSalary: "",
    currentSalary: "",
    availableStartDate: "",
    privacyConsent: false,
    resumeUrl: undefined,
    coverLetterFileUrl: undefined,
    coverLetterFileName: undefined,
  });

  // ── Auth guard + initial load 
  useEffect(() => {
    if (authLoading) return;

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

    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, jobId]);

  const loadAll = async () => {
    await Promise.all([fetchPipelineData(), fetchQuestionnaire()]);
  };

  // ── Fetch pipeline / profile snapshot ────────────────────────────────────
  const fetchPipelineData = async () => {
    try {
      setLoading(true);
      const response = await jobApplicationPipelineService.getFormData(jobId!);
      console.log(
        "profileSnapshot.user:",
        response.data?.profileSnapshot?.user,
      );

      if (response.success && response.data) {
        setPipelineData(response.data);

        const snapshot = response.data.profileSnapshot;
        const piSnap = snapshot?.personalInfo;

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

          // ── NEW: pre-fill personalInfo from snapshot ─────────────────────
          // Normalise plwd so integer 0 / string "0" never appears as checked
          personalInfo: piSnap
            ? {
                fullName: piSnap.fullName || "",
                dob: (piSnap.dob || "").slice(0, 10),
                gender: (piSnap.gender as "M" | "F" | "Other") || "M",
                idNumber: piSnap.idNumber || "",
                nationality: piSnap.nationality || "",
                countyOfOrigin: piSnap.countyOfOrigin || "",
                plwd: normalisePlwd(piSnap.plwd),
              }
            : { gender: "M" as const, plwd: false },
          // ──
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

  // ── Fetch questionnaire ──────
  const fetchQuestionnaire = async () => {
    try {
      setQuestionnaireLoading(true);
      const res = await jobQuestionnaireService.get(jobId!);
      if (res.success && res.data) {
        setQuestionnaireData(res.data);
      } else {
        setQuestionnaireData(null);
      }
    } catch {
      setQuestionnaireData(null);
    } finally {
      setQuestionnaireLoading(false);
    }
  };

  // ── Questionnaire helpers ────
  const questionnaire =
    questionnaireData || pipelineData?.questionnaire || null;

  const questionnaireEnabled = !!questionnaire?.enabled;
  const questionnaireQuestions = (questionnaire?.questions || [])
    .slice()
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const validateQuestionnaire = () => {
    if (!questionnaireEnabled || questionnaireQuestions.length === 0)
      return true;

    for (const q of questionnaireQuestions) {
      if (!q.isRequired) continue;

      const a = formData.questionnaireAnswers?.[q.id];

      if (q.type === "YES_NO") {
        if (!a || a.answerBool === null || a.answerBool === undefined) {
          showToast({
            type: "error",
            title: "Validation Error",
            message: `Please answer: "${q.questionText}"`,
          });
          return false;
        }
      } else {
        const txt = (a?.answerText || "").trim();
        if (!txt) {
          showToast({
            type: "error",
            title: "Validation Error",
            message: `Please answer: "${q.questionText}"`,
          });
          return false;
        }
      }
    }
    return true;
  };

  // ── Pre-submit validation ────
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
    const todayStr = new Date().toISOString().split("T")[0];
    if (formData.availableStartDate < todayStr) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Available start date cannot be in the past",
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

    if (!validateQuestionnaire()) return;

    setShowConfirmModal(true);
  };

  // ── Confirmed submit ─────────
  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);

    try {
      setSubmitting(true);

      const questionnaireAnswersPayload =
        questionnaireEnabled && questionnaireQuestions.length > 0
          ? questionnaireQuestions.map((q: any) => {
              const a = formData.questionnaireAnswers?.[q.id];
              return {
                questionId: q.id,
                type: q.type,
                answerText:
                  q.type === "OPEN_ENDED" ? (a?.answerText || "").trim() : null,
                answerBool:
                  q.type === "YES_NO" ? (a?.answerBool ?? null) : null,
              };
            })
          : undefined;

      // Lightweight payload: profile sections are already saved silently
      const payload: ApplicationPipelineFormData = {
        jobId: jobId!,
        basic: formData.basic,

        personalInfo: formData.personalInfo.fullName
          ? {
              fullName: formData.personalInfo.fullName!,
              dob: formData.personalInfo.dob!,
              gender: formData.personalInfo.gender!,
              idNumber: formData.personalInfo.idNumber!,
              nationality: formData.personalInfo.nationality!,
              countyOfOrigin: formData.personalInfo.countyOfOrigin!,
              // Ensure we always send a real boolean — never undefined
              plwd: formData.personalInfo.plwd === true,
            }
          : undefined,

        questionnaireAnswers: questionnaireAnswersPayload,

        coverLetter: formData.coverLetter,
        coverLetterFileUrl: formData.coverLetterFileUrl, // snapshot-only usage
        portfolioUrl: formData.portfolioUrl,
        expectedSalary: formData.expectedSalary,
        currentSalary: formData.currentSalary,
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

  // ── Section ordering ─────────
  const applicationConfig: JobApplicationConfigDTO | null =
    pipelineData?.applicationConfig || null;

  const orderedSections: SectionKey[] = useMemo(() => {
    const order = applicationConfig?.sectionOrder?.length
      ? applicationConfig.sectionOrder
      : DEFAULT_SECTION_ORDER;

    // Filter out questionnaire if not enabled
    return order.filter((k) =>
      k === "questionnaire" ? questionnaireEnabled : true,
    );
  }, [applicationConfig, questionnaireEnabled]);

  // ── Loading state ────────────
  if (authLoading || loading || questionnaireLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {authLoading
              ? "Checking authentication…"
              : "Loading application form…"}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Derived display flags ────
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

  const showJobDescription =
    !!applicationConfig?.showDescription && !!pipelineData?.job?.description;

  // Convenience snapshot pointer for initial items
  const snap = pipelineData?.profileSnapshot;

  // ──────────
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back button */}
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

          {/* Page header */}
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
                  Sections auto-save as you add information. Most of your
                  profile may already be pre-filled.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* ── Always first: Resume ── */}
            <ResumeUploadSection
              resumeUrl={formData.resumeUrl}
              onResumeUploaded={(url) =>
                setFormData((prev) => ({ ...prev, resumeUrl: url }))
              }
            />

            {/* ── Job description (config controlled) ── */}
            {showJobDescription && (
              <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary-500" />
                    Job Description
                  </CardTitle>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Read the full job description while completing your
                    application
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {/* Render as plain text to avoid XSS risks */}
                    <pre className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
                      {pipelineData?.job?.description}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Basic info (conditionally shown) ── */}
            {showBasic && (
              <BasicInfoSection
                data={formData.basic}
                onChange={(basic) =>
                  setFormData((prev) => ({ ...prev, basic }))
                }
                missingKeys={effectiveMissingKeys}
              />
            )}

            {/* ── Ordered middle sections ── */}
            {orderedSections.map((sk) => {
              switch (sk) {
                // ── Questionnaire ───────────────────────────────────────────
                case "questionnaire":
                  return questionnaireEnabled &&
                    questionnaireQuestions.length > 0 ? (
                    <QuestionnaireSection
                      key={sk}
                      title={
                        questionnaire?.questionnaire?.title ||
                        "Screening Questions"
                      }
                      description={
                        questionnaire?.questionnaire?.description || null
                      }
                      questions={questionnaireQuestions}
                      answers={formData.questionnaireAnswers}
                      onChange={(next) =>
                        setFormData((prev) => ({
                          ...prev,
                          questionnaireAnswers: next,
                        }))
                      }
                    />
                  ) : null;

                // ── Skills ─────
                case "skills":
                  return effectiveMissingKeys.includes("SKILLS") ? (
                    <SkillsSection
                      key={sk}
                      initialSkills={snap?.skills || []}
                    />
                  ) : null;

                // ── General experience ───────────────────────────────────────
                case "experience_general":
                  return applicationConfig?.showGeneralExperience ||
                    effectiveMissingKeys.includes("EXPERIENCE") ? (
                    <GeneralExperienceSection
                      key={sk}
                      initialExperience={snap?.experience || []}
                      description={
                        applicationConfig?.generalExperienceText || ""
                      }
                    />
                  ) : null;

                // ── Specific experience ──────────────────────────────────────
                case "experience_specific":
                  return applicationConfig?.showSpecificExperience ? (
                    <SpecificExperienceSection
                      key={sk}
                      initialExperience={snap?.experience || []}
                      description={
                        applicationConfig?.specificExperienceText || ""
                      }
                    />
                  ) : null;

                // ── Education ──
                case "education":
                  return effectiveMissingKeys.includes("EDUCATION") ? (
                    <EducationSection
                      key={sk}
                      initialEducation={snap?.education || []}
                      requiredEducationLevels={
                        applicationConfig?.requiredEducationLevels || []
                      }
                    />
                  ) : null;

                // ── Personal info ────────────────────────────────────────────
                // NEW: passes userFirstName/userLastName and pre-filled data
                case "personal_info":
                  return effectiveMissingKeys.includes("PERSONAL_INFO") ? (
                    <PersonalInfoSection
                      key={sk}
                      data={formData.personalInfo}
                      onChange={(personalInfo) =>
                        setFormData((prev) => ({ ...prev, personalInfo }))
                      }
                      userFirstName={snap?.user?.firstName || ""}
                      userLastName={snap?.user?.lastName || ""}
                    />
                  ) : null;

                // ── Publications 
                case "publications":
                  return effectiveMissingKeys.includes("PUBLICATIONS") ? (
                    <PublicationsSection
                      key={sk}
                      initialPublications={snap?.publications || []}
                    />
                  ) : null;

                // ── Memberships ─
                case "memberships":
                  return effectiveMissingKeys.includes("MEMBERSHIPS") ? (
                    <MembershipsSection
                      key={sk}
                      initialMemberships={snap?.memberships || []}
                    />
                  ) : null;

                // ── Clearances ──
                case "clearances":
                  return effectiveMissingKeys.includes("CLEARANCES") ? (
                    <ClearancesSection
                      key={sk}
                      initialClearances={snap?.clearances || []}
                    />
                  ) : null;

                // ── Courses ─────
                case "courses":
                  return effectiveMissingKeys.includes("COURSES") ? (
                    <CoursesSection
                      key={sk}
                      initialCourses={snap?.courses || []}
                    />
                  ) : null;

                // ── Referees ────
                case "referees":
                  return effectiveMissingKeys.includes("REFEREES") ? (
                    <RefereesSection
                      key={sk}
                      initialReferees={snap?.referees || []}
                      refereesRequired={
                        applicationConfig?.refereesRequired ?? 0
                      }
                      required={true}
                    />
                  ) : null;

                // ── Documents ───
                // CHANGED: always render — DocumentsSection itself handles which
                // required docs to show, and ALWAYS shows "Other Documents".
                case "documents":
                  return (
                    <DocumentsSection
                      key={sk}
                      missingKeys={effectiveMissingKeys}
                      existingFiles={snap?.files || []}
                    />
                  );

                default:
                  return null;
              }
            })}

            {/* ── Always last: application details ── */}
            <ApplicationDetailsSection
              data={{
                coverLetter: formData.coverLetter,
                coverLetterFileUrl: formData.coverLetterFileUrl,
                coverLetterFileName: formData.coverLetterFileName,
                portfolioUrl: formData.portfolioUrl,
                expectedSalary: formData.expectedSalary,
                currentSalary: formData.currentSalary,
                availableStartDate: formData.availableStartDate,
                privacyConsent: formData.privacyConsent,
              }}
              onChange={(details) =>
                setFormData((prev) => ({
                  ...prev,
                  coverLetter: details.coverLetter,
                  coverLetterFileUrl: details.coverLetterFileUrl,
                  coverLetterFileName: details.coverLetterFileName,
                  portfolioUrl: details.portfolioUrl,
                  expectedSalary: details.expectedSalary,
                  currentSalary: details.currentSalary,
                  availableStartDate: details.availableStartDate,
                  privacyConsent: details.privacyConsent,
                }))
              }
              resumeUrl={formData.resumeUrl}
            />

            {/* ── Submit button ── */}
            <Button
              onClick={handlePreSubmit}
              disabled={submitting}
              className="w-full h-14 text-base font-semibold bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white shadow-lg shadow-primary-500/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Review &amp; Submit Application
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
