"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Shield,
  DollarSign,
  Settings,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import type { ShortlistCriteria } from "@/types";
import { shortlistService } from "@/services/recruitment-services";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Checkbox } from "@/components/careers/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/careers/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";

/** ---------- helpers ---------- */
function parseCommaList(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
function toCommaText(arr?: string[]): string {
  return (arr ?? []).join(", ");
}

function CommaListField(props: {
  label: string;
  placeholder?: string;
  value?: string[];
  onChange: (next: string[]) => void;
}) {
  const { label, placeholder, value, onChange } = props;
  const [text, setText] = useState(toCommaText(value));

  const normalized = useMemo(() => toCommaText(value), [value]);
  useEffect(() => setText(normalized), [normalized]);

  return (
    <div className="space-y-1">
      <Label className="text-xs sm:text-sm">{label}</Label>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(parseCommaList(text))}
        placeholder={placeholder}
      />
      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
        Separate items with commas
      </p>
    </div>
  );
}

function NumberField(props: {
  label: string;
  placeholder?: string;
  value?: number;
  onChange: (next: number | undefined) => void;
  min?: number;
  max?: number;
}) {
  const { label, placeholder, value, onChange, min, max } = props;
  return (
    <div className="space-y-1">
      <Label className="text-xs sm:text-sm">{label}</Label>
      <Input
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        min={min}
        max={max}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") return onChange(undefined);
          const n = Number(raw);
          onChange(Number.isFinite(n) ? n : undefined);
        }}
        placeholder={placeholder}
      />
    </div>
  );
}

function CheckRow(props: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
}) {
  const { id, label, checked, onChange, description, disabled } = props;

  return (
    <div
      className={[
        "flex items-start gap-3 rounded-md border p-3 transition-colors",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        checked
          ? "border-primary-500/40 bg-primary-50 dark:bg-primary-950/30"
          : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/40",
      ].join(" ")}
      onClick={() => {
        if (disabled) return;
        onChange(!checked);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") onChange(!checked);
      }}
      aria-disabled={disabled}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(Boolean(v))}
        className="mt-0.5"
        disabled={disabled}
      />
      <div className="min-w-0">
        <Label
          htmlFor={id}
          className="text-xs sm:text-sm cursor-pointer leading-5"
        >
          {label}
        </Label>
        {description ? (
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
            {description}
          </p>
        ) : null}
      </div>

      {checked ? (
        <div className="ml-auto mt-0.5 text-primary-600 dark:text-primary-400">
          <Check className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}

export default function CriteriaEditorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobInfo, setJobInfo] = useState<any>(null);
  const [dirty, setDirty] = useState(false);

  const [criteria, setCriteria] = useState<Partial<ShortlistCriteria>>({
    // Weights
    educationWeight: 25,
    experienceWeight: 30,
    skillsWeight: 20,
    clearanceWeight: 15,
    professionalWeight: 10,

    // Personal
    acceptPLWD: true,
    requirePLWD: false,

    // Education
    requireDoctorate: false,
    requireMasters: false,
    requireBachelors: false,

    // Experience
    minGeneralExperience: 0,
    minSeniorExperience: 0,
    requireManagementExperience: false,
    requireMNCExperience: false,
    requireStartupExperience: false,
    requireNGOExperience: false,
    requireGovernmentExperience: false,
    requireCurrentlyEmployed: false,
    excludeCurrentlyEmployed: false,

    // Professional
    requireProfessionalMembership: false,
    requireGoodStanding: false,
    requireLeadershipCourse: false,
    minPublications: 0,

    // Clearances
    requireTaxClearance: false,
    requireHELBClearance: false,
    requireDCICClearance: false,
    requireCRBClearance: false,
    requireEACCClearance: false,

    // Referees
    requireReferees: false,
    minRefereeCount: 0,
    requireSeniorReferees: false,
    requireAcademicReferees: false,

    // Portfolio
    requirePortfolio: false,
    requireGitHubProfile: false,
    requireLinkedInProfile: false,

    // Other
    requireImmediateAvailability: false,
    acceptRemoteCandidates: true,
    requireOnSiteCandidates: false,

    // Leadership course duration default
    minLeadershipCourseDuration: 4,
  });

  const updateCriteria = useCallback(
    <K extends keyof ShortlistCriteria>(
      key: K,
      value: ShortlistCriteria[K],
    ) => {
      setDirty(true);
      setCriteria((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const totalWeight = useMemo(() => {
    return (
      Number(criteria.educationWeight ?? 0) +
      Number(criteria.experienceWeight ?? 0) +
      Number(criteria.skillsWeight ?? 0) +
      Number(criteria.clearanceWeight ?? 0) +
      Number(criteria.professionalWeight ?? 0)
    );
  }, [
    criteria.educationWeight,
    criteria.experienceWeight,
    criteria.skillsWeight,
    criteria.clearanceWeight,
    criteria.professionalWeight,
  ]);

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

    if (!jobId) {
      toast.error("Job ID is required");
      router.push("/recruitment-portal/shortlist");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const response = await shortlistService.getCriteria(jobId);
        if (response.success && response.data) {
          setCriteria(response.data.criteria);
          setJobInfo({
            job: response.data.job,
            company: response.data.company,
          });
          setDirty(false);
        } else {
          toast.error(response?.message || "Failed to load criteria");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load criteria");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, jobId, router]);

  const validateWeights = () => {
    if (totalWeight !== 100) {
      toast.error(`Total weight must equal 100% (currently ${totalWeight}%)`);
      return false;
    }
    return true;
  };

  const handleSave = async (opts?: { goBack?: boolean }) => {
    if (!jobId) return;
    if (!validateWeights()) return;

    try {
      setSaving(true);
      const res = await shortlistService.updateCriteria(jobId, criteria);

      if (!res?.success) {
        toast.error(res?.message || "Failed to save criteria");
        return;
      }

      setDirty(false);
      toast.success("Criteria saved successfully");

      if (opts?.goBack) {
        router.push("/recruitment-portal/shortlist");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save criteria");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!jobId) return;
    if (!validateWeights()) return;

    try {
      setSaving(true);

      // save first (no redirect)
      const saveRes = await shortlistService.updateCriteria(jobId, criteria);
      if (!saveRes?.success) {
        toast.error(saveRes?.message || "Failed to save criteria");
        return;
      }

      const result = await shortlistService.generate(jobId);
      if (result.success && result.data) {
        setDirty(false);
        toast.success(
          `Shortlist generated with ${result.data.count} candidates`,
        );
        router.push(`/recruitment-portal/shortlist/results?jobId=${jobId}`);
      } else {
        toast.error(result?.message || "Failed to generate shortlist");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate shortlist");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="min-w-0">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/recruitment-portal/shortlist">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shortlist
            </Link>
          </Button>

          <h1 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white wrap-break-word">
            Configure Shortlist Criteria
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1 wrap-break-word">
            {jobInfo?.job?.title} • {jobInfo?.company?.name}
          </p>

          <div className="mt-2">
            {dirty ? (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                You have unsaved changes
              </p>
            ) : (
              <p className="text-xs text-green-600 dark:text-green-400">
                All changes saved
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => handleSave()}
            disabled={saving || loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSave({ goBack: true })}
            disabled={saving || loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            Save & Back
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={saving || loading}
            size="sm"
            className="w-full sm:w-auto bg-linear-to-r from-primary-600 to-orange-600 hover:from-primary-700 hover:to-orange-700"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate Shortlist
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            {/* Mobile-friendly tab bar (scrollable) */}
            <TabsList className="w-full flex gap-1 overflow-x-auto whitespace-nowrap">
              <TabsTrigger
                value="personal"
                className="shrink-0 text-xs sm:text-sm"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="shrink-0 text-xs sm:text-sm"
              >
                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="shrink-0 text-xs sm:text-sm"
              >
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Experience</span>
              </TabsTrigger>
              <TabsTrigger
                value="professional"
                className="shrink-0 text-xs sm:text-sm"
              >
                <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Professional</span>
              </TabsTrigger>
              <TabsTrigger
                value="clearances"
                className="shrink-0 text-xs sm:text-sm"
              >
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Clearances</span>
              </TabsTrigger>
              <TabsTrigger
                value="compensation"
                className="shrink-0 text-xs sm:text-sm"
              >
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Other</span>
              </TabsTrigger>
            </TabsList>

            {/* ---------------- Personal ---------------- */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <Card className="shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Personal Information Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumberField
                      label="Minimum Age"
                      placeholder="e.g., 25"
                      value={criteria.minAge}
                      onChange={(n) => updateCriteria("minAge", n as any)}
                      min={0}
                    />
                    <NumberField
                      label="Maximum Age"
                      placeholder="e.g., 45"
                      value={criteria.maxAge}
                      onChange={(n) => updateCriteria("maxAge", n as any)}
                      min={0}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm">
                      Gender Requirement
                    </Label>
                    <Select
                      value={(criteria.requiredGender as any) || "ANY"}
                      onValueChange={(v) =>
                        updateCriteria("requiredGender", v as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ANY">Any Gender</SelectItem>
                        <SelectItem value="MALE">Male Only</SelectItem>
                        <SelectItem value="FEMALE">Female Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm">
                      Nationality Requirement
                    </Label>
                    <Input
                      value={criteria.requiredNationality || ""}
                      onChange={(e) =>
                        updateCriteria(
                          "requiredNationality",
                          e.target.value as any,
                        )
                      }
                      placeholder="e.g., Kenyan (leave blank for any)"
                    />
                  </div>

                  <CommaListField
                    label="Specific Counties"
                    placeholder="e.g., Nairobi, Mombasa, Kisumu"
                    value={criteria.specificCounties as any}
                    onChange={(arr) =>
                      updateCriteria("specificCounties", arr as any)
                    }
                  />

                  <div className="space-y-2 pt-2">
                    <CheckRow
                      id="acceptPLWD"
                      label="Accept Persons with Disabilities (PLWD)"
                      checked={Boolean(criteria.acceptPLWD)}
                      onChange={(checked) =>
                        updateCriteria("acceptPLWD", checked as any)
                      }
                      description="If off, PLWD candidates can be disqualified."
                    />

                    <CheckRow
                      id="requirePLWD"
                      label="Require PLWD (Diversity Hiring Priority)"
                      checked={Boolean(criteria.requirePLWD)}
                      onChange={(checked) => {
                        updateCriteria("requirePLWD", checked as any);
                        if (checked) updateCriteria("acceptPLWD", true as any);
                      }}
                      description="If on, only PLWD candidates qualify."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ---------------- Education ---------------- */}
            <TabsContent value="education" className="space-y-4 mt-4">
              <Card className="shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Education Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <CheckRow
                      id="requireDoctorate"
                      label="Require Doctorate Degree (PhD)"
                      checked={Boolean(criteria.requireDoctorate)}
                      onChange={(checked) =>
                        updateCriteria("requireDoctorate", checked as any)
                      }
                    />
                    <CheckRow
                      id="requireMasters"
                      label="Require Masters Degree"
                      checked={Boolean(criteria.requireMasters)}
                      onChange={(checked) =>
                        updateCriteria("requireMasters", checked as any)
                      }
                    />
                    <CheckRow
                      id="requireBachelors"
                      label="Require Bachelors Degree"
                      checked={Boolean(criteria.requireBachelors)}
                      onChange={(checked) =>
                        updateCriteria("requireBachelors", checked as any)
                      }
                    />
                  </div>

                  <CommaListField
                    label="Specific Degree Fields"
                    placeholder="e.g., Computer Science, Engineering, Business"
                    value={criteria.specificDegreeFields as any}
                    onChange={(arr) =>
                      updateCriteria("specificDegreeFields", arr as any)
                    }
                  />

                  <CommaListField
                    label="Preferred Institutions"
                    placeholder="e.g., University of Nairobi, Strathmore"
                    value={criteria.specificInstitutions as any}
                    onChange={(arr) =>
                      updateCriteria("specificInstitutions", arr as any)
                    }
                  />

                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm">Minimum Grade</Label>
                    <Input
                      value={criteria.minEducationGrade || ""}
                      onChange={(e) =>
                        updateCriteria(
                          "minEducationGrade",
                          e.target.value as any,
                        )
                      }
                      placeholder="e.g., First Class, Upper Second"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ---------------- Experience ---------------- */}
            <TabsContent value="experience" className="space-y-4 mt-4">
              <Card className="shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Experience Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumberField
                      label="Minimum General Experience (years)"
                      placeholder="e.g., 5"
                      value={criteria.minGeneralExperience as any}
                      onChange={(n) =>
                        updateCriteria("minGeneralExperience", (n ?? 0) as any)
                      }
                      min={0}
                    />
                    <NumberField
                      label="Maximum General Experience (years)"
                      placeholder="e.g., 15"
                      value={criteria.maxGeneralExperience as any}
                      onChange={(n) =>
                        updateCriteria("maxGeneralExperience", n as any)
                      }
                      min={0}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumberField
                      label="Minimum Senior Experience (years)"
                      placeholder="e.g., 3"
                      value={criteria.minSeniorExperience as any}
                      onChange={(n) =>
                        updateCriteria("minSeniorExperience", (n ?? 0) as any)
                      }
                      min={0}
                    />
                    <NumberField
                      label="Minimum Team Size Managed"
                      placeholder="e.g., 5"
                      value={criteria.minTeamSizeManaged as any}
                      onChange={(n) =>
                        updateCriteria("minTeamSizeManaged", n as any)
                      }
                      min={0}
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <CheckRow
                      id="requireManagementExperience"
                      label="Require Management Experience"
                      checked={Boolean(criteria.requireManagementExperience)}
                      onChange={(checked) =>
                        updateCriteria(
                          "requireManagementExperience",
                          checked as any,
                        )
                      }
                    />

                    <CheckRow
                      id="requireMNCExperience"
                      label="Require Multinational Corporation (MNC) Experience"
                      checked={Boolean(criteria.requireMNCExperience)}
                      onChange={(checked) =>
                        updateCriteria("requireMNCExperience", checked as any)
                      }
                    />

                    <CheckRow
                      id="requireStartupExperience"
                      label="Require Startup Experience"
                      checked={Boolean(criteria.requireStartupExperience)}
                      onChange={(checked) =>
                        updateCriteria(
                          "requireStartupExperience",
                          checked as any,
                        )
                      }
                    />

                    <CheckRow
                      id="requireNGOExperience"
                      label="Require NGO Experience"
                      checked={Boolean(criteria.requireNGOExperience)}
                      onChange={(checked) =>
                        updateCriteria("requireNGOExperience", checked as any)
                      }
                    />

                    <CheckRow
                      id="requireGovernmentExperience"
                      label="Require Government Experience"
                      checked={Boolean(criteria.requireGovernmentExperience)}
                      onChange={(checked) =>
                        updateCriteria(
                          "requireGovernmentExperience",
                          checked as any,
                        )
                      }
                    />

                    {/* guard: require vs exclude */}
                    <CheckRow
                      id="requireCurrentlyEmployed"
                      label="Require Currently Employed"
                      checked={Boolean(criteria.requireCurrentlyEmployed)}
                      onChange={(checked) => {
                        updateCriteria(
                          "requireCurrentlyEmployed",
                          checked as any,
                        );
                        if (checked)
                          updateCriteria(
                            "excludeCurrentlyEmployed",
                            false as any,
                          );
                      }}
                      description="If enabled, candidates must have a current job."
                    />

                    <CheckRow
                      id="excludeCurrentlyEmployed"
                      label="Exclude Currently Employed"
                      checked={Boolean(criteria.excludeCurrentlyEmployed)}
                      onChange={(checked) => {
                        updateCriteria(
                          "excludeCurrentlyEmployed",
                          checked as any,
                        );
                        if (checked)
                          updateCriteria(
                            "requireCurrentlyEmployed",
                            false as any,
                          );
                      }}
                      description="If enabled, currently employed candidates are disqualified."
                    />
                  </div>

                  <CommaListField
                    label="Specific Industries"
                    placeholder="e.g., Technology, Finance, Healthcare"
                    value={criteria.specificIndustries as any}
                    onChange={(arr) =>
                      updateCriteria("specificIndustries", arr as any)
                    }
                  />

                  <CommaListField
                    label="Specific Job Titles"
                    placeholder="e.g., CTO, Engineering Manager, Director"
                    value={criteria.specificJobTitles as any}
                    onChange={(arr) =>
                      updateCriteria("specificJobTitles", arr as any)
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ---------------- Professional ---------------- */}
            <TabsContent value="professional" className="space-y-4 mt-4">
              <Card className="shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Professional Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <CheckRow
                      id="requireProfessionalMembership"
                      label="Require Professional Membership"
                      checked={Boolean(criteria.requireProfessionalMembership)}
                      onChange={(checked) =>
                        updateCriteria(
                          "requireProfessionalMembership",
                          checked as any,
                        )
                      }
                    />

                    <CheckRow
                      id="requireGoodStanding"
                      label="Require Good Standing"
                      checked={Boolean(criteria.requireGoodStanding)}
                      onChange={(checked) =>
                        updateCriteria("requireGoodStanding", checked as any)
                      }
                    />

                    <CheckRow
                      id="requireLeadershipCourse"
                      label="Require Leadership Course"
                      checked={Boolean(criteria.requireLeadershipCourse)}
                      onChange={(checked) =>
                        updateCriteria(
                          "requireLeadershipCourse",
                          checked as any,
                        )
                      }
                      description="If enabled, you can set a minimum course duration."
                    />
                  </div>

                  {criteria.requireLeadershipCourse && (
                    <NumberField
                      label="Minimum Course Duration (weeks)"
                      placeholder="e.g., 4"
                      value={criteria.minLeadershipCourseDuration as any}
                      onChange={(n) =>
                        updateCriteria(
                          "minLeadershipCourseDuration",
                          (n ?? 4) as any,
                        )
                      }
                      min={1}
                    />
                  )}

                  <CommaListField
                    label="Specific Professional Bodies"
                    placeholder="e.g., ICPAK, IEK, IEEE"
                    value={criteria.specificProfessionalBodies as any}
                    onChange={(arr) =>
                      updateCriteria("specificProfessionalBodies", arr as any)
                    }
                  />

                  <CommaListField
                    label="Required Certifications"
                    placeholder="e.g., PMP, AWS Certified, CPA"
                    value={criteria.requiredCertifications as any}
                    onChange={(arr) =>
                      updateCriteria("requiredCertifications", arr as any)
                    }
                  />

                  <CommaListField
                    label="Preferred Certifications"
                    placeholder="e.g., CISSP, Six Sigma"
                    value={criteria.preferredCertifications as any}
                    onChange={(arr) =>
                      updateCriteria("preferredCertifications", arr as any)
                    }
                  />

                  <NumberField
                    label="Minimum Publications Required"
                    placeholder="e.g., 5"
                    value={criteria.minPublications as any}
                    onChange={(n) =>
                      updateCriteria("minPublications", (n ?? 0) as any)
                    }
                    min={0}
                  />

                  <div className="space-y-2 pt-2">
                    <CheckRow
                      id="requirePortfolio"
                      label="Require Portfolio/Website"
                      checked={Boolean(criteria.requirePortfolio)}
                      onChange={(checked) =>
                        updateCriteria("requirePortfolio", checked as any)
                      }
                    />
                    <CheckRow
                      id="requireGitHubProfile"
                      label="Require GitHub Profile"
                      checked={Boolean(criteria.requireGitHubProfile)}
                      onChange={(checked) =>
                        updateCriteria("requireGitHubProfile", checked as any)
                      }
                    />
                    <CheckRow
                      id="requireLinkedInProfile"
                      label="Require LinkedIn Profile"
                      checked={Boolean(criteria.requireLinkedInProfile)}
                      onChange={(checked) =>
                        updateCriteria("requireLinkedInProfile", checked as any)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ---------------- Clearances ---------------- */}
            <TabsContent value="clearances" className="space-y-4 mt-4">
              <Card className="shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Clearance Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CheckRow
                    id="requireTaxClearance"
                    label="Require Tax Compliance Certificate (KRA)"
                    checked={Boolean(criteria.requireTaxClearance)}
                    onChange={(checked) =>
                      updateCriteria("requireTaxClearance", checked as any)
                    }
                  />
                  <CheckRow
                    id="requireHELBClearance"
                    label="Require HELB Clearance"
                    checked={Boolean(criteria.requireHELBClearance)}
                    onChange={(checked) =>
                      updateCriteria("requireHELBClearance", checked as any)
                    }
                  />
                  <CheckRow
                    id="requireDCIClearance"
                    label="Require DCI Certificate of Good Conduct"
                    checked={Boolean(criteria.requireDCICClearance)}
                    onChange={(checked) =>
                      updateCriteria("requireDCICClearance", checked as any)
                    }
                  />
                  <CheckRow
                    id="requireCRBClearance"
                    label="Require CRB Clearance"
                    checked={Boolean(criteria.requireCRBClearance)}
                    onChange={(checked) =>
                      updateCriteria("requireCRBClearance", checked as any)
                    }
                  />
                  <CheckRow
                    id="requireEACCClearance"
                    label="Require EACC Clearance"
                    checked={Boolean(criteria.requireEACCClearance)}
                    onChange={(checked) =>
                      updateCriteria("requireEACCClearance", checked as any)
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ---------------- Other / Compensation ---------------- */}
            <TabsContent value="compensation" className="space-y-4 mt-4">
              <Card className="shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Compensation & Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumberField
                      label="Maximum Expected Salary (KSh)"
                      placeholder="e.g., 500000"
                      value={criteria.maxExpectedSalary as any}
                      onChange={(n) =>
                        updateCriteria("maxExpectedSalary", n as any)
                      }
                      min={0}
                    />
                    <NumberField
                      label="Minimum Expected Salary (KSh)"
                      placeholder="e.g., 200000"
                      value={criteria.minExpectedSalary as any}
                      onChange={(n) =>
                        updateCriteria("minExpectedSalary", n as any)
                      }
                      min={0}
                    />
                  </div>

                  <NumberField
                    label="Maximum Notice Period (months)"
                    placeholder="e.g., 3"
                    value={criteria.maxNoticePeriod as any}
                    onChange={(n) =>
                      updateCriteria("maxNoticePeriod", n as any)
                    }
                    min={0}
                  />

                  <NumberField
                    label="Minimum Referees Required"
                    placeholder="e.g., 3"
                    value={criteria.minRefereeCount as any}
                    onChange={(n) =>
                      updateCriteria("minRefereeCount", (n ?? 0) as any)
                    }
                    min={0}
                  />

                  <div className="space-y-2 pt-2">
                    <CheckRow
                      id="requireImmediateAvailability"
                      label="Require Immediate Availability"
                      checked={Boolean(criteria.requireImmediateAvailability)}
                      onChange={(checked) =>
                        updateCriteria(
                          "requireImmediateAvailability",
                          checked as any,
                        )
                      }
                    />

                    <CheckRow
                      id="acceptRemoteCandidates"
                      label="Accept Remote Candidates"
                      checked={Boolean(criteria.acceptRemoteCandidates)}
                      onChange={(checked) =>
                        updateCriteria("acceptRemoteCandidates", checked as any)
                      }
                    />

                    <CheckRow
                      id="requireOnSiteCandidates"
                      label="Require On-Site Candidates Only"
                      checked={Boolean(criteria.requireOnSiteCandidates)}
                      onChange={(checked) =>
                        updateCriteria(
                          "requireOnSiteCandidates",
                          checked as any,
                        )
                      }
                    />

                    <CheckRow
                      id="requireReferees"
                      label="Require Referees"
                      checked={Boolean(criteria.requireReferees)}
                      onChange={(checked) =>
                        updateCriteria("requireReferees", checked as any)
                      }
                      description="If enabled, candidates must provide referees."
                    />

                    <CheckRow
                      id="requireSeniorReferees"
                      label="Require Senior/C-Level Referees"
                      checked={Boolean(criteria.requireSeniorReferees)}
                      onChange={(checked) =>
                        updateCriteria("requireSeniorReferees", checked as any)
                      }
                      disabled={
                        !criteria.requireReferees && !criteria.minRefereeCount
                      }
                      description="Tip: Enable Require Referees or set Minimum Referees."
                    />

                    <CheckRow
                      id="requireAcademicReferees"
                      label="Require Academic Referees"
                      checked={Boolean(criteria.requireAcademicReferees)}
                      onChange={(checked) =>
                        updateCriteria(
                          "requireAcademicReferees",
                          checked as any,
                        )
                      }
                      disabled={
                        !criteria.requireReferees && !criteria.minRefereeCount
                      }
                      description="Tip: Enable Require Referees or set Minimum Referees."
                    />
                  </div>

                  <CommaListField
                    label="Specific Locations"
                    placeholder="e.g., Nairobi, Mombasa"
                    value={criteria.specificLocations as any}
                    onChange={(arr) =>
                      updateCriteria("specificLocations", arr as any)
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="shadow-card lg:sticky lg:top-24">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                Scoring Weights
              </CardTitle>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Adjust importance of each category (must total 100%)
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {[
                ["educationWeight", "Education", 25],
                ["experienceWeight", "Experience", 30],
                ["skillsWeight", "Skills", 20],
                ["clearanceWeight", "Clearances", 15],
                ["professionalWeight", "Professional", 10],
              ].map(([key, label, fallback]) => (
                <div key={key as string} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label className="text-xs sm:text-sm">{label}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={(criteria as any)[key] ?? fallback}
                        onChange={(e) => {
                          const val =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value, 10);
                          updateCriteria(
                            key as any,
                            (Number.isFinite(val) ? val : 0) as any,
                          );
                        }}
                        className="w-20 h-9 text-xs text-right"
                        min="0"
                        max="100"
                      />
                      <span className="text-xs text-neutral-500">%</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold">
                    Total Weight
                  </span>
                  <span
                    className={`font-bold text-base sm:text-lg ${
                      totalWeight === 100
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {totalWeight}%
                  </span>
                </div>

                {totalWeight !== 100 && (
                  <div className="flex items-start gap-2 mt-2 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>
                      Weights must total exactly 100% (currently {totalWeight}%)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
