"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Badge } from "@/components/careers/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import {
  GraduationCap,
  Plus,
  Trash2,
  Building2,
  Calendar,
  Loader2,
  CheckCircle2,
  Info,
  AlertCircle,
} from "lucide-react";
import { candidateService } from "@/services/recruitment-services";
import { educationQualificationLevelService } from "@/services/recruitment-services/educationQualificationLevel.service";
import { useToast } from "@/components/admin/ui/Toast";
import type { QualificationLevelDTO } from "@/types/recruitment/profileRequirements.types";
import { EDUCATION_LEVEL_LABELS } from "@/types/recruitment/profileRequirements.types";

// ─── Static fallback levels (shown while API loads / if API fails) ────────────
const FALLBACK_LEVELS: QualificationLevelDTO[] = [
  {
    id: "f1",
    key: "KCPE",
    label: "KCPE (Kenya Certificate of Primary Education)",
    sortOrder: 1,
    isActive: true,
    isSystem: true,
  },
  {
    id: "f2",
    key: "KCSE",
    label: "KCSE (Kenya Certificate of Secondary Education)",
    sortOrder: 2,
    isActive: true,
    isSystem: true,
  },
  {
    id: "f3",
    key: "A_LEVEL",
    label: "A-Level / Form 6",
    sortOrder: 3,
    isActive: true,
    isSystem: true,
  },
  {
    id: "f4",
    key: "CERTIFICATE",
    label: "Certificate",
    sortOrder: 4,
    isActive: true,
    isSystem: true,
  },
  {
    id: "f5",
    key: "POST_GRADUATE_DIPLOMA",
    label: "Postgraduate Diploma",
    sortOrder: 5,
    isActive: true,
    isSystem: true,
  },
  {
    id: "f6",
    key: "DIPLOMA",
    label: "Diploma",
    sortOrder: 6,
    isActive: true,
    isSystem: true,
  },
  {
    id: "f7",
    key: "BACHELORS",
    label: "Bachelor's Degree",
    sortOrder: 7,
    isActive: true,
    isSystem: true,
  },
  {
    id: "f8",
    key: "MASTERS",
    label: "Master's Degree",
    sortOrder: 8,
    isActive: true,
    isSystem: true,
  },
  {
    id: "f9",
    key: "PHD",
    label: "Doctor of Philosophy (PhD)",
    sortOrder: 9,
    isActive: true,
    isSystem: true,
  },
  {
    id: "f10",
    key: "OTHER",
    label: "Other",
    sortOrder: 10,
    isActive: true,
    isSystem: true,
  },
];

// ─── Types

interface EduItem {
  id: string;
  degree: string;
  degreeLevel?: string | null;
  fieldOfStudy: string;
  institution: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  grade?: string | null;
}

interface Props {
  initialEducation?: EduItem[];
  /** Keys from education_qualification_levels (may include custom admin-added keys) */
  requiredEducationLevels?: string[];
  onCountChange?: (count: number) => void;
}

// ─── Component

export default function EducationSection({
  initialEducation = [],
  requiredEducationLevels = [],
  onCountChange,
}: Props) {
  const { showToast } = useToast();

  // ── Qualification levels from DB
  const [qualLevels, setQualLevels] =
    useState<QualificationLevelDTO[]>(FALLBACK_LEVELS);
  const [levelsLoading, setLevelsLoading] = useState(true);

  // ── Education items
  const [items, setItems] = useState<EduItem[]>(initialEducation);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [form, setForm] = useState({
    degree: "",
    fieldOfStudy: "",
    institution: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    grade: "",
  });

  // ── Load qualification levels
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLevelsLoading(true);
        const res = await educationQualificationLevelService.getActive();
        if (
          mounted &&
          res.success &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          setQualLevels(res.data);
        }
        // If API returns empty or fails, keep fallback levels
      } catch {
        // Keep fallback levels — no toast needed for transparent fallback
      } finally {
        if (mounted) setLevelsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ── Helpers

  const getLabelForKey = useCallback(
    (key: string): string => {
      const found = qualLevels.find((l) => l.key === key);
      if (found) return found.label;
      // fallback to static map
      return (EDUCATION_LEVEL_LABELS as Record<string, string>)[key] ?? key;
    },
    [qualLevels],
  );

  const reportCount = (list: EduItem[]) => onCountChange?.(list.length);

  const resetForm = () =>
    setForm({
      degree: "",
      fieldOfStudy: "",
      institution: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      grade: "",
    });

  // ── Add
  const handleAdd = async () => {
    if (
      !form.degree ||
      !form.fieldOfStudy.trim() ||
      !form.institution.trim() ||
      !form.startDate
    ) {
      showToast({
        type: "error",
        title: "Required",
        message:
          "Qualification level, field of study, institution and start date are required",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await candidateService.addEducation({
        degree: form.degree,
        degreeLevel: form.degree,
        fieldOfStudy: form.fieldOfStudy.trim(),
        institution: form.institution.trim(),
        startDate: form.startDate,
        endDate: form.isCurrent ? undefined : form.endDate || undefined,
        isCurrent: form.isCurrent,
        grade: form.grade.trim() || undefined,
      });

      if (res.success && res.data) {
        const next = [...items, res.data as EduItem];
        setItems(next);
        resetForm();
        setShowForm(false);
        reportCount(next);
        showToast({
          type: "success",
          title: "Saved",
          message: "Education saved to your profile",
        });
      } else {
        showToast({
          type: "error",
          title: "Save failed",
          message: res.message || "Could not save education",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to save education",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Remove
  const handleRemove = async (id: string) => {
    setDeleting(id);
    try {
      const res = await candidateService.deleteEducation(id);
      if (res.success !== false) {
        const next = items.filter((e) => e.id !== id);
        setItems(next);
        reportCount(next);
      } else {
        showToast({
          type: "error",
          title: "Error",
          message: res.message || "Could not remove education",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to remove education",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary-500" />
              Education <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Add your educational qualifications — saved instantly to your
              profile
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            type="button"
            variant={showForm ? "outline" : "default"}
            size="sm"
          >
            {showForm ? (
              "Cancel"
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ── Required levels notice ── */}
        {requiredEducationLevels.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Required education level(s) for this position:
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {requiredEducationLevels.map((lvl) => (
                  <Badge
                    key={lvl}
                    className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs border border-amber-300 dark:border-amber-700"
                  >
                    {getLabelForKey(lvl)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Existing education entries ── */}
        {items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {items.length} education entr{items.length === 1 ? "y" : "ies"}{" "}
                in your profile
              </Label>
            </div>
            <div className="space-y-2">
              {items.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                      {getLabelForKey(edu.degreeLevel || edu.degree) ||
                        edu.degree}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {edu.institution}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                      {edu.fieldOfStudy}
                    </p>
                    {edu.grade && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Grade: {edu.grade}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleRemove(edu.id)}
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={deleting === edu.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    {deleting === edu.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Add Form ── */}
        {showForm && (
          <div className="space-y-4 p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            {/* Qualification Level dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                Qualification Level <span className="text-red-500">*</span>
              </Label>
              {levelsLoading ? (
                <div className="flex items-center gap-2 h-11 px-3 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                  <span className="text-sm text-neutral-400">
                    Loading levels…
                  </span>
                </div>
              ) : (
                <Select
                  value={form.degree}
                  onValueChange={(v) => setForm({ ...form, degree: v })}
                >
                  <SelectTrigger className="h-11 bg-white dark:bg-neutral-900">
                    <SelectValue placeholder="Select qualification level…" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualLevels.map((lv) => (
                      <SelectItem key={lv.key} value={lv.key}>
                        {lv.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Field of Study */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                Field of Study <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.fieldOfStudy}
                onChange={(e) =>
                  setForm({ ...form, fieldOfStudy: e.target.value })
                }
                placeholder="e.g. Computer Science, Business Administration"
                className="h-11"
              />
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                Institution / School <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={form.institution}
                  onChange={(e) =>
                    setForm({ ...form, institution: e.target.value })
                  }
                  placeholder="e.g. University of Nairobi"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                  End Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    disabled={form.isCurrent}
                    className="pl-10 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Currently Studying */}
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <Checkbox
                id="eduIsCurrent"
                checked={form.isCurrent}
                onCheckedChange={(v) =>
                  setForm({
                    ...form,
                    isCurrent: !!v,
                    endDate: v ? "" : form.endDate,
                  })
                }
              />
              <Label htmlFor="eduIsCurrent" className="text-sm cursor-pointer">
                I am currently studying here
              </Label>
            </div>

            {/* Grade (optional) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                Grade / GPA{" "}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </Label>
              <Input
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                placeholder="e.g. First Class, 3.8 GPA, B+"
                className="h-11"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleAdd}
                type="button"
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Add Education"
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                type="button"
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* ── Empty-state warning ── */}
        {items.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              At least 1 education entry is required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
