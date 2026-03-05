"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  Loader2,
  ArrowLeft,
  Send,
  Sparkles,
  FileText,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

import ResumeUploadSection from "./pipeline/ResumeUploadSection";
import BasicInfoSection from "./pipeline/BasicInfoSection";
import QuestionnaireSection, {
  QuestionnaireAnswersState,
} from "./pipeline/QuestionnaireSection";
import SkillsSection from "./pipeline/SkillsSection";
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

function normalisePlwd(value: unknown): boolean {
  if (value === true || value === 1 || value === "1") return true;
  return false;
}

const MIN_COVER_LETTER = 150;

// Must match DocumentsSection required categories
const REQUIRED_DOC_CATEGORY_MAP: Record<
  string,
  { label: string; category: string }
> = {
  DOCUMENT_NATIONAL_ID: { label: "National ID", category: "NATIONAL_ID" },
  DOCUMENT_ACADEMIC_CERT: {
    label: "Academic Certificates",
    category: "ACADEMIC_CERT",
  },
  DOCUMENT_PROFESSIONAL_CERT: {
    label: "Professional Certificates",
    category: "PROFESSIONAL_CERT",
  },
  DOCUMENT_DRIVING_LICENSE: {
    label: "Driving License",
    category: "DRIVING_LICENSE",
  },
};

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

type SectionCounts = {
  skills: number;
  experience: number;
  education: number;
  publications: number;
  memberships: number;
  clearances: number;
  courses: number;
  referees: number;
};

type DocsReadyMap = Record<string, boolean>;

type MissingItem = {
  key: string;
  label: string;
  detail?: string;
};

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

  const [counts, setCounts] = useState<SectionCounts>({
    skills: 0,
    experience: 0,
    education: 0,
    publications: 0,
    memberships: 0,
    clearances: 0,
    courses: 0,
    referees: 0,
  });

  const [docsReady, setDocsReady] = useState<DocsReadyMap>({});

  // callback
  const handleRequiredDocsReadyChange = useCallback(
    (map: Record<string, boolean>) => {
      setDocsReady((prev) => {
        let changed = false;
        const next: DocsReadyMap = { ...prev };

        for (const [k, v] of Object.entries(map)) {
          if (next[k] !== v) {
            next[k] = v;
            changed = true;
          }
        }

        return changed ? next : prev;
      });
    },
    [],
  );

  // ── Derived config /──────────────
  const applicationConfig: JobApplicationConfigDTO | null =
    pipelineData?.applicationConfig || null;

  const snap = pipelineData?.profileSnapshot;

  const existingFiles = useMemo(() => snap?.files || [], [snap?.files]);

  const questionnaire = useMemo(
    () => questionnaireData || pipelineData?.questionnaire || null,
    [questionnaireData, pipelineData],
  );

  const questionnaireEnabled = !!questionnaire?.enabled;

  const questionnaireQuestions = useMemo(() => {
    const qs = questionnaire?.questions || [];
    return qs
      .slice()
      .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [questionnaire]);

  const missingKeys = useMemo<string[]>(
    () =>
      Array.isArray(pipelineData?.requirements)
        ? pipelineData.requirements
        : [],
    [pipelineData],
  );

  const coreSections = useMemo(
    () => [
      "BASIC_TITLE",
      "BASIC_LOCATION",
      "SKILLS",
      "EXPERIENCE",
      "EDUCATION",
    ],
    [],
  );

  const effectiveMissingKeys = useMemo(() => {
    return [...new Set([...coreSections, ...missingKeys])];
  }, [coreSections, missingKeys]);

  const showBasic = useMemo(() => {
    return (
      effectiveMissingKeys.includes("BASIC_TITLE") ||
      effectiveMissingKeys.includes("BASIC_LOCATION") ||
      effectiveMissingKeys.includes("BASIC_BIO") ||
      effectiveMissingKeys.includes("BASIC_PHONE")
    );
  }, [effectiveMissingKeys]);

  const showJobDescription = useMemo(() => {
    return (
      !!applicationConfig?.showDescription && !!pipelineData?.job?.description
    );
  }, [applicationConfig?.showDescription, pipelineData?.job?.description]);

  const orderedSections: SectionKey[] = useMemo(() => {
    const order = applicationConfig?.sectionOrder?.length
      ? applicationConfig.sectionOrder
      : DEFAULT_SECTION_ORDER;

    return order.filter((k) =>
      k === "questionnaire" ? questionnaireEnabled : true,
    );
  }, [applicationConfig, questionnaireEnabled]);

  // ── Auth guard + initial load ────────────────────
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

  // ── Fetch pipeline / profile snapshot ────────────
  const fetchPipelineData = async () => {
    try {
      setLoading(true);
      const response = await jobApplicationPipelineService.getFormData(jobId!);

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
        }));

        // Initialize counts from snapshot
        setCounts({
          skills: Array.isArray(snapshot?.skills) ? snapshot.skills.length : 0,
          experience: Array.isArray(snapshot?.experience)
            ? snapshot.experience.length
            : 0,
          education: Array.isArray(snapshot?.education)
            ? snapshot.education.length
            : 0,
          publications: Array.isArray(snapshot?.publications)
            ? snapshot.publications.length
            : 0,
          memberships: Array.isArray(snapshot?.memberships)
            ? snapshot.memberships.length
            : 0,
          clearances: Array.isArray(snapshot?.clearances)
            ? snapshot.clearances.length
            : 0,
          courses: Array.isArray(snapshot?.courses)
            ? snapshot.courses.length
            : 0,
          referees: Array.isArray(snapshot?.referees)
            ? snapshot.referees.length
            : 0,
        });

        // Initialize docs readiness from snapshot files
        const files = Array.isArray(snapshot?.files) ? snapshot.files : [];
        const nextDocsReady: DocsReadyMap = {};
        Object.keys(REQUIRED_DOC_CATEGORY_MAP).forEach((k) => {
          const cat = REQUIRED_DOC_CATEGORY_MAP[k].category;
          nextDocsReady[k] = files.some((f: any) => f.category === cat);
        });
        setDocsReady(nextDocsReady);
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

  // ── Fetch questionnaire
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

  // ── Questionnaire missing (silent) ───────────────
  const getQuestionnaireMissing = useCallback((): MissingItem[] => {
    if (!questionnaireEnabled || questionnaireQuestions.length === 0) return [];

    const missing: MissingItem[] = [];
    for (const q of questionnaireQuestions) {
      if (!q.isRequired) continue;
      const a = formData.questionnaireAnswers?.[q.id];

      if (q.type === "YES_NO") {
        if (!a || a.answerBool === null || a.answerBool === undefined) {
          missing.push({
            key: `Q_${q.id}`,
            label: "Screening Questions",
            detail: `Please answer: "${q.questionText}"`,
          });
        }
      } else {
        const txt = (a?.answerText || "").trim();
        if (!txt) {
          missing.push({
            key: `Q_${q.id}`,
            label: "Screening Questions",
            detail: `Please answer: "${q.questionText}"`,
          });
        }
      }
    }
    return missing;
  }, [
    questionnaireEnabled,
    questionnaireQuestions,
    formData.questionnaireAnswers,
  ]);

  // ── Full pipeline validation ─────────────────────
  const computeMissing = useCallback((): MissingItem[] => {
    const missing: MissingItem[] = [];

    // Resume always required
    if (!formData.resumeUrl) {
      missing.push({
        key: "RESUME",
        label: "Resume / CV",
        detail: "Upload your resume (PDF/DOC/DOCX)",
      });
    }

    // Basic info requirements (validate only what job requires)
    if (effectiveMissingKeys.includes("BASIC_TITLE")) {
      if (!String(formData.basic.title || "").trim()) {
        missing.push({
          key: "BASIC_TITLE",
          label: "Basic Information",
          detail: "Professional Title is required",
        });
      }
    }
    if (effectiveMissingKeys.includes("BASIC_LOCATION")) {
      if (!String(formData.basic.location || "").trim()) {
        missing.push({
          key: "BASIC_LOCATION",
          label: "Basic Information",
          detail: "Location is required",
        });
      }
    }
    if (effectiveMissingKeys.includes("BASIC_PHONE")) {
      if (!String(formData.basic.phone || "").trim()) {
        missing.push({
          key: "BASIC_PHONE",
          label: "Basic Information",
          detail: "Phone number is required",
        });
      }
    }
    if (effectiveMissingKeys.includes("BASIC_BIO")) {
      const bio = String(formData.basic.bio || "").trim();
      if (!bio) {
        missing.push({
          key: "BASIC_BIO",
          label: "Basic Information",
          detail: "Professional bio is required",
        });
      } else if (bio.length < 50) {
        missing.push({
          key: "BASIC_BIO_MIN",
          label: "Basic Information",
          detail: "Professional bio must be at least 50 characters",
        });
      }
    }

    // Skills
    if (effectiveMissingKeys.includes("SKILLS") && (counts.skills || 0) < 1) {
      missing.push({
        key: "SKILLS",
        label: "Skills",
        detail: "Add at least 1 skill",
      });
    }

    // Experience
    if (
      effectiveMissingKeys.includes("EXPERIENCE") &&
      (counts.experience || 0) < 1
    ) {
      missing.push({
        key: "EXPERIENCE",
        label: "Work Experience",
        detail: "Add at least 1 work experience entry",
      });
    }

    // Education
    if (
      effectiveMissingKeys.includes("EDUCATION") &&
      (counts.education || 0) < 1
    ) {
      missing.push({
        key: "EDUCATION",
        label: "Education",
        detail: "Add at least 1 education entry",
      });
    }

    // Personal info
    if (effectiveMissingKeys.includes("PERSONAL_INFO")) {
      const pi = formData.personalInfo || {};
      const piMissing: string[] = [];
      if (!String(pi.fullName || "").trim()) piMissing.push("Full legal name");
      if (!String(pi.dob || "").trim()) piMissing.push("Date of birth");
      if (!String(pi.idNumber || "").trim())
        piMissing.push("National ID number");
      if (!String(pi.nationality || "").trim()) piMissing.push("Nationality");
      if (!String(pi.countyOfOrigin || "").trim())
        piMissing.push("County of origin");

      if (piMissing.length) {
        missing.push({
          key: "PERSONAL_INFO",
          label: "Personal Information",
          detail: `${piMissing.join(", ")} required`,
        });
      }
    }

    // Publications / memberships / clearances / courses
    if (
      effectiveMissingKeys.includes("PUBLICATIONS") &&
      (counts.publications || 0) < 1
    ) {
      missing.push({
        key: "PUBLICATIONS",
        label: "Publications",
        detail: "Add at least 1 publication",
      });
    }
    if (
      effectiveMissingKeys.includes("MEMBERSHIPS") &&
      (counts.memberships || 0) < 1
    ) {
      missing.push({
        key: "MEMBERSHIPS",
        label: "Professional Memberships",
        detail: "Add at least 1 membership",
      });
    }
    if (
      effectiveMissingKeys.includes("CLEARANCES") &&
      (counts.clearances || 0) < 1
    ) {
      missing.push({
        key: "CLEARANCES",
        label: "Statutory Clearances",
        detail: "Add at least 1 clearance certificate",
      });
    }
    if (effectiveMissingKeys.includes("COURSES") && (counts.courses || 0) < 1) {
      missing.push({
        key: "COURSES",
        label: "Training Courses",
        detail: "Add at least 1 training course",
      });
    }

    // Referees
    if (effectiveMissingKeys.includes("REFEREES")) {
      const configured = Number(applicationConfig?.refereesRequired ?? 0);
      const minCount = configured > 0 ? configured : 3;
      if ((counts.referees || 0) < minCount) {
        missing.push({
          key: "REFEREES",
          label: "Professional Referees",
          detail: `Provide at least ${minCount} referee${
            minCount !== 1 ? "s" : ""
          } (${counts.referees}/${minCount})`,
        });
      }
    }

    // Documents (DOCUMENT_*)
    const requiredDocKeys = effectiveMissingKeys.filter(
      (k) => k.startsWith("DOCUMENT_") && REQUIRED_DOC_CATEGORY_MAP[k],
    );
    for (const dk of requiredDocKeys) {
      if (docsReady[dk] !== true) {
        missing.push({
          key: dk,
          label: "Documents",
          detail: `Upload: ${REQUIRED_DOC_CATEGORY_MAP[dk].label}`,
        });
      }
    }

    // Questionnaire
    missing.push(...getQuestionnaireMissing());

    // Application Details
    const cover = String(formData.coverLetter || "");
    if (!cover.trim() || cover.trim().length < MIN_COVER_LETTER) {
      missing.push({
        key: "COVER_LETTER",
        label: "Application Details",
        detail: `Cover letter must be at least ${MIN_COVER_LETTER} characters`,
      });
    }

    if (!String(formData.expectedSalary || "").trim()) {
      missing.push({
        key: "EXPECTED_SALARY",
        label: "Application Details",
        detail: "Expected salary is required",
      });
    }

    if (!String(formData.availableStartDate || "").trim()) {
      missing.push({
        key: "START_DATE",
        label: "Application Details",
        detail: "Available start date is required",
      });
    } else {
      const todayStr = new Date().toISOString().split("T")[0];
      if (formData.availableStartDate < todayStr) {
        missing.push({
          key: "START_DATE_PAST",
          label: "Application Details",
          detail: "Available start date cannot be in the past",
        });
      }
    }

    if (!formData.privacyConsent) {
      missing.push({
        key: "PRIVACY",
        label: "Application Details",
        detail: "You must accept the privacy policy",
      });
    }

    return missing;
  }, [
    formData.resumeUrl,
    formData.basic,
    formData.personalInfo,
    formData.coverLetter,
    formData.expectedSalary,
    formData.availableStartDate,
    formData.privacyConsent,
    effectiveMissingKeys,
    counts,
    docsReady,
    getQuestionnaireMissing,
    applicationConfig?.refereesRequired,
  ]);

  const validation = useMemo(() => {
    const missing = computeMissing();
    return { isValid: missing.length === 0, missing };
  }, [computeMissing]);

  const handlePreSubmit = () => {
    if (!validation.isValid) return;
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);

    // Guard if something changed while modal open
    const fresh = computeMissing();
    if (fresh.length > 0) {
      showToast({
        type: "error",
        title: "Still incomplete",
        message:
          fresh
            .slice(0, 7)
            .map((m) => `• ${m.detail ?? m.label}`)
            .join("\n") + (fresh.length > 7 ? "\n… and more" : ""),
      });
      return;
    }

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
              plwd: formData.personalInfo.plwd === true,
            }
          : undefined,

        questionnaireAnswers: questionnaireAnswersPayload,

        coverLetter: formData.coverLetter,
        coverLetterFileUrl: formData.coverLetterFileUrl,
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

  const isBusy = authLoading || loading || questionnaireLoading;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {isBusy ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {authLoading
                  ? "Checking authentication…"
                  : "Loading application form…"}
              </p>
            </div>
          ) : (
            <>
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
                <ResumeUploadSection
                  resumeUrl={formData.resumeUrl}
                  onResumeUploaded={(url) =>
                    setFormData((prev) => ({ ...prev, resumeUrl: url }))
                  }
                />

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
                        <pre className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
                          {pipelineData?.job?.description}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {showBasic && (
                  <BasicInfoSection
                    data={formData.basic}
                    onChange={(basic) =>
                      setFormData((prev) => ({ ...prev, basic }))
                    }
                    missingKeys={effectiveMissingKeys}
                  />
                )}

                {orderedSections.map((sk) => {
                  switch (sk) {
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

                    case "skills":
                      return effectiveMissingKeys.includes("SKILLS") ? (
                        <SkillsSection
                          key={sk}
                          initialSkills={snap?.skills || []}
                          onCountChange={(n) =>
                            setCounts((prev) => ({ ...prev, skills: n }))
                          }
                        />
                      ) : null;

                    case "experience_general":
                      return applicationConfig?.showGeneralExperience ||
                        effectiveMissingKeys.includes("EXPERIENCE") ? (
                        <GeneralExperienceSection
                          key={sk}
                          initialExperience={snap?.experience || []}
                          description={
                            applicationConfig?.generalExperienceText || ""
                          }
                          onCountChange={(n) =>
                            setCounts((prev) => ({ ...prev, experience: n }))
                          }
                        />
                      ) : null;

                    case "experience_specific":
                      return applicationConfig?.showSpecificExperience ? (
                        <SpecificExperienceSection
                          key={sk}
                          initialExperience={snap?.experience || []}
                          description={
                            applicationConfig?.specificExperienceText || ""
                          }
                          onCountChange={(n) =>
                            setCounts((prev) => ({ ...prev, experience: n }))
                          }
                        />
                      ) : null;

                    case "education":
                      return effectiveMissingKeys.includes("EDUCATION") ? (
                        <EducationSection
                          key={sk}
                          initialEducation={snap?.education || []}
                          requiredEducationLevels={
                            applicationConfig?.requiredEducationLevels || []
                          }
                          onCountChange={(n) =>
                            setCounts((prev) => ({ ...prev, education: n }))
                          }
                        />
                      ) : null;

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

                    case "publications":
                      return effectiveMissingKeys.includes("PUBLICATIONS") ? (
                        <PublicationsSection
                          key={sk}
                          initialPublications={snap?.publications || []}
                          onCountChange={(n) =>
                            setCounts((prev) => ({ ...prev, publications: n }))
                          }
                        />
                      ) : null;

                    case "memberships":
                      return effectiveMissingKeys.includes("MEMBERSHIPS") ? (
                        <MembershipsSection
                          key={sk}
                          initialMemberships={snap?.memberships || []}
                          onCountChange={(n) =>
                            setCounts((prev) => ({ ...prev, memberships: n }))
                          }
                        />
                      ) : null;

                    case "clearances":
                      return effectiveMissingKeys.includes("CLEARANCES") ? (
                        <ClearancesSection
                          key={sk}
                          initialClearances={snap?.clearances || []}
                          onCountChange={(n) =>
                            setCounts((prev) => ({ ...prev, clearances: n }))
                          }
                        />
                      ) : null;

                    case "courses":
                      return effectiveMissingKeys.includes("COURSES") ? (
                        <CoursesSection
                          key={sk}
                          initialCourses={snap?.courses || []}
                          onCountChange={(n) =>
                            setCounts((prev) => ({ ...prev, courses: n }))
                          }
                        />
                      ) : null;

                    case "referees":
                      return effectiveMissingKeys.includes("REFEREES") ? (
                        <RefereesSection
                          key={sk}
                          initialReferees={snap?.referees || []}
                          refereesRequired={
                            applicationConfig?.refereesRequired ?? 0
                          }
                          required={true}
                          onCountChange={(n) =>
                            setCounts((prev) => ({ ...prev, referees: n }))
                          }
                        />
                      ) : null;

                    case "documents":
                      return (
                        <DocumentsSection
                          key={sk}
                          missingKeys={effectiveMissingKeys}
                          existingFiles={existingFiles}
                          onRequiredDocsReadyChange={
                            handleRequiredDocsReadyChange
                          }
                        />
                      );

                    default:
                      return null;
                  }
                })}

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

                {!validation.isValid && (
                  <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-200 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Complete required sections before submitting
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-orange-900 dark:text-orange-200">
                      <ul className="list-disc pl-5 space-y-1">
                        {validation.missing.slice(0, 10).map((m) => (
                          <li key={m.key}>{m.detail ? m.detail : m.label}</li>
                        ))}
                      </ul>
                      {validation.missing.length > 10 && (
                        <p className="mt-2 text-xs text-orange-800/80 dark:text-orange-200/80">
                          …and {validation.missing.length - 10} more.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Inactive button when invalid (your requirement) */}
                <Button
                  onClick={handlePreSubmit}
                  disabled={submitting || !validation.isValid}
                  className={`w-full h-14 text-base font-semibold text-white shadow-lg shadow-primary-500/20 ${
                    validation.isValid
                      ? "bg-linear-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600"
                      : "bg-neutral-400 cursor-not-allowed hover:bg-neutral-400"
                  }`}
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
            </>
          )}
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
