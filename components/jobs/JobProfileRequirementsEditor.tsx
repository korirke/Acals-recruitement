"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Checkbox } from "@/components/careers/ui/checkbox";
import { Label } from "@/components/careers/ui/label";
import { Input } from "@/components/careers/ui/input";
import { Textarea } from "@/components/careers/ui/textarea";
import { Badge } from "@/components/careers/ui/badge";
import {
  Loader2,
  Save,
  ChevronUp,
  ChevronDown,
  Settings2,
  GraduationCap,
  Users,
  Briefcase,
  Eye,
  EyeOff,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import { jobProfileRequirementsService } from "@/services/recruitment-services";
import { educationQualificationLevelService } from "@/services/recruitment-services";
import type {
  ProfileRequirementKey,
  SectionKey,
  JobApplicationConfigDTO,
  QualificationLevelDTO,
} from "@/types";
import {
  EDUCATION_LEVEL_LABELS,
  SECTION_LABELS,
  DEFAULT_SECTION_ORDER,
} from "@/types/recruitment/profileRequirements.types";
import { useError } from "@/context/ErrorContext";

// ── Requirement-key groups per section
const SECTION_REQ_KEYS: Record<SectionKey, ProfileRequirementKey[]> = {
  basic: ["BASIC_TITLE", "BASIC_LOCATION", "BASIC_PHONE", "BASIC_BIO"],
  questionnaire: [],
  skills: ["SKILLS"],
  experience_general: ["EXPERIENCE"],
  experience_specific: [],
  education: ["EDUCATION"],
  personal_info: ["PERSONAL_INFO"],
  publications: ["PUBLICATIONS"],
  memberships: ["MEMBERSHIPS"],
  clearances: ["CLEARANCES"],
  courses: ["COURSES"],
  referees: ["REFEREES"],
  documents: [
    "DOCUMENT_NATIONAL_ID",
    "DOCUMENT_ACADEMIC_CERT",
    "DOCUMENT_PROFESSIONAL_CERT",
    "DOCUMENT_DRIVING_LICENSE",
  ],
};

const BASIC_KEY_LABELS: Record<string, string> = {
  BASIC_TITLE: "Professional title",
  BASIC_LOCATION: "Location",
  BASIC_PHONE: "Phone number",
  BASIC_BIO: "Bio (min 50 chars)",
};

const DOC_KEY_LABELS: Record<string, string> = {
  DOCUMENT_NATIONAL_ID: "National ID",
  DOCUMENT_ACADEMIC_CERT: "Academic certificate",
  DOCUMENT_PROFESSIONAL_CERT: "Professional certificate",
  DOCUMENT_DRIVING_LICENSE: "Driving license",
};


interface Props {
  jobId: string;
}

interface SectionState {
  sectionKey: SectionKey;
  requiredKeys: Set<ProfileRequirementKey>;
  isRequired: boolean;
}

export function JobProfileRequirementsEditor({ jobId }: Props) {
  const { showToast, logError } = useError();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Education levels from DB 
  const [eduLevels, setEduLevels] = useState<QualificationLevelDTO[]>([]);
  const [eduLevelsLoading, setEduLevelsLoading] = useState(true);

  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(
    DEFAULT_SECTION_ORDER,
  );

  const [sections, setSections] = useState<Map<SectionKey, SectionState>>(
    () => {
      const map = new Map<SectionKey, SectionState>();
      DEFAULT_SECTION_ORDER.forEach((sk) => {
        map.set(sk, {
          sectionKey: sk,
          requiredKeys: new Set<ProfileRequirementKey>(),
          isRequired: false,
        });
      });
      return map;
    },
  );

  const [refereesRequired, setRefereesRequired] = useState<number>(0);
  const [requiredEducationLevels, setRequiredEducationLevels] = useState<
    string[]
  >([]);
  const [generalExperienceText, setGeneralExperienceText] = useState("");
  const [specificExperienceText, setSpecificExperienceText] = useState("");
  const [showGeneralExperience, setShowGeneralExperience] = useState(false);
  const [showSpecificExperience, setShowSpecificExperience] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(
    new Set(),
  );

  // ── Drag-and-drop ────────────────
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Load education levels from DB 
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setEduLevelsLoading(true);
        const res = await educationQualificationLevelService.getActive();
        if (
          mounted &&
          res.success &&
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          setEduLevels(res.data);
        } else if (mounted) {
          // Fallback to static keys
          setEduLevels(
            Object.entries(EDUCATION_LEVEL_LABELS).map(([key, label], i) => ({
              id: `static_${key}`,
              key,
              label,
              sortOrder: i + 1,
              isActive: true,
              isSystem: true,
            })),
          );
        }
      } catch {
        if (mounted) {
          setEduLevels(
            Object.entries(EDUCATION_LEVEL_LABELS).map(([key, label], i) => ({
              id: `static_${key}`,
              key,
              label,
              sortOrder: i + 1,
              isActive: true,
              isSystem: true,
            })),
          );
        }
      } finally {
        if (mounted) setEduLevelsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Load existing job requirements 
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const res = await jobProfileRequirementsService.get(jobId);
        if (!mounted) return;

        if (res.success && res.data) {
          const keys: ProfileRequirementKey[] = res.data.requirementKeys || [];
          const cfg: JobApplicationConfigDTO | undefined = res.data.config;

          setSections((prev) => {
            const next = new Map(prev);

            next.forEach((v, k) => {
              next.set(k, {
                ...v,
                requiredKeys: new Set<ProfileRequirementKey>(),
                isRequired: false,
              });
            });

            keys.forEach((reqKey) => {
              for (const [sk, reqKeys] of Object.entries(SECTION_REQ_KEYS)) {
                if ((reqKeys as ProfileRequirementKey[]).includes(reqKey)) {
                  const existing = next.get(sk as SectionKey)!;
                  existing.requiredKeys.add(reqKey);
                  existing.isRequired = true;
                  next.set(sk as SectionKey, { ...existing });
                  break;
                }
              }
            });

            return next;
          });

          if (cfg) {
            setSectionOrder(
              cfg.sectionOrder?.length
                ? cfg.sectionOrder
                : DEFAULT_SECTION_ORDER,
            );
            setRefereesRequired(cfg.refereesRequired ?? 0);
            setRequiredEducationLevels(cfg.requiredEducationLevels ?? []);
            setGeneralExperienceText(cfg.generalExperienceText ?? "");
            setSpecificExperienceText(cfg.specificExperienceText ?? "");
            setShowGeneralExperience(cfg.showGeneralExperience ?? false);
            setShowSpecificExperience(cfg.showSpecificExperience ?? false);
            setShowDescription(cfg.showDescription ?? true);
          }
        }
      } catch {
        // non-fatal — keep defaults
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [jobId]);

  // ── Helpers ──────────────────────

  const getLabelForKey = useCallback(
    (key: string): string => {
      const found = eduLevels.find((l) => l.key === key);
      if (found) return found.label;
      return (EDUCATION_LEVEL_LABELS as Record<string, string>)[key] ?? key;
    },
    [eduLevels],
  );

  const collectRequirementKeys = useCallback((): ProfileRequirementKey[] => {
    const keys: ProfileRequirementKey[] = [];
    sections.forEach((state, sk) => {
      const sectionReqKeys = SECTION_REQ_KEYS[sk];
      if (sectionReqKeys.length === 0) return;
      if (sectionReqKeys.length === 1) {
        if (state.isRequired) keys.push(sectionReqKeys[0]);
      } else {
        state.requiredKeys.forEach((k) => keys.push(k));
      }
    });
    return Array.from(new Set(keys));
  }, [sections]);

  // ── Save ─────────────────────────
  const save = async () => {
    setSaving(true);
    try {
      const requirementKeys = collectRequirementKeys();

      const config: Partial<JobApplicationConfigDTO> = {
        refereesRequired,
        requiredEducationLevels,
        generalExperienceText,
        specificExperienceText,
        showGeneralExperience,
        showSpecificExperience,
        sectionOrder,
        showDescription,
      };

      const res = await jobProfileRequirementsService.upsert(
        jobId,
        requirementKeys,
        config,
      );

      if (res.success) {
        showToast("Requirements & configuration saved successfully", "success");
      } else {
        showToast("Failed to save", "error");
      }
    } catch (error: any) {
      logError(error);
      showToast(error?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Section ordering ─────────────
  const moveSection = (index: number, direction: "up" | "down") => {
    setSectionOrder((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const toggleExpanded = (sk: SectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sk)) next.delete(sk);
      else next.add(sk);
      return next;
    });
  };

  // ── Drag-and-drop ────────────────
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      dragIndexRef.current = index;
      setIsDragging(true);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(index));
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
        setDragOverIndex(index);
      }
    },
    [],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node))
      setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      const fromIndex = dragIndexRef.current;
      if (fromIndex === null || fromIndex === dropIndex) {
        setDragOverIndex(null);
        setIsDragging(false);
        dragIndexRef.current = null;
        return;
      }
      setSectionOrder((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(dropIndex, 0, moved);
        return next;
      });
      dragIndexRef.current = null;
      setDragOverIndex(null);
      setIsDragging(false);
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
    setIsDragging(false);
  }, []);

  // ── Section-level helpers ────────
  const setSectionRequired = (sk: SectionKey, required: boolean) => {
    setSections((prev) => {
      const next = new Map(prev);
      const existing = next.get(sk)!;
      const sectionReqKeys = SECTION_REQ_KEYS[sk];

      let newRequiredKeys = new Set(existing.requiredKeys);
      if (sectionReqKeys.length === 1) {
        if (required) newRequiredKeys.add(sectionReqKeys[0]);
        else newRequiredKeys.delete(sectionReqKeys[0]);
      }

      next.set(sk, {
        ...existing,
        isRequired: required,
        requiredKeys: newRequiredKeys,
      });
      return next;
    });
  };

  const setKeyRequired = (
    sk: SectionKey,
    key: ProfileRequirementKey,
    required: boolean,
  ) => {
    setSections((prev) => {
      const next = new Map(prev);
      const existing = next.get(sk)!;
      const newKeys = new Set(existing.requiredKeys);
      if (required) newKeys.add(key);
      else newKeys.delete(key);
      next.set(sk, {
        ...existing,
        requiredKeys: newKeys,
        isRequired: newKeys.size > 0,
      });
      return next;
    });
  };

  const toggleEducationLevel = (level: string, checked: boolean) => {
    setRequiredEducationLevels((prev) =>
      checked ? [...prev, level] : prev.filter((l) => l !== level),
    );
  };

  // ── Rendered section row ─────────
  const renderSectionRow = (sk: SectionKey, index: number) => {
    const state = sections.get(sk)!;
    const sectionReqKeys = SECTION_REQ_KEYS[sk];

    const hasConfig = [
      "referees",
      "education",
      "experience_general",
      "experience_specific",
    ].includes(sk);
    const isExpanded = expandedSections.has(sk);
    const label = SECTION_LABELS[sk];
    const isBeingDraggedOver =
      dragOverIndex === index && dragIndexRef.current !== index;
    const isCurrentlyDragged = isDragging && dragIndexRef.current === index;

    const Icon =
      sk === "referees"
        ? Users
        : sk === "education"
          ? GraduationCap
          : sk.startsWith("experience")
            ? Briefcase
            : null;

    return (
      <div
        key={sk}
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
        onDragEnd={handleDragEnd}
        className={[
          "border rounded-xl overflow-hidden transition-all duration-150 select-none",
          isCurrentlyDragged
            ? "opacity-40 scale-[0.98] border-primary-400 dark:border-primary-600 shadow-none"
            : "border-neutral-200 dark:border-neutral-800",
          isBeingDraggedOver
            ? "ring-2 ring-primary-400 dark:ring-primary-500 border-primary-400 dark:border-primary-500 shadow-lg translate-y-0.5"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Row header */}
        <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-neutral-900">
          {/* Drag handle */}
          <div
            className="cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-400 shrink-0 touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Order buttons */}
          <div className="flex flex-col gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => moveSection(index, "up")}
              disabled={index === 0}
              className="p-0.5 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Move up"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => moveSection(index, "down")}
              disabled={index === sectionOrder.length - 1}
              className="p-0.5 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Move down"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Order badge */}
          <span className="text-xs font-bold text-neutral-400 w-6 text-center select-none shrink-0">
            {index + 1}
          </span>

          {/* Label */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {Icon && <Icon className="h-5 w-5 text-primary-500 shrink-0" />}
            <span className="font-semibold text-sm text-neutral-900 dark:text-white truncate">
              {label}
            </span>
          </div>

          {/* Required toggle (single-key sections) */}
          {sectionReqKeys.length === 1 && (
            <div className="flex items-center gap-2 shrink-0">
              <Checkbox
                id={`req-${sk}`}
                checked={state.isRequired}
                onCheckedChange={(v) => setSectionRequired(sk, !!v)}
              />
              <Label
                htmlFor={`req-${sk}`}
                className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer whitespace-nowrap"
              >
                Required
              </Label>
            </div>
          )}

          {/* Multi-key badge */}
          {sectionReqKeys.length > 1 && state.requiredKeys.size > 0 && (
            <Badge className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs shrink-0">
              {state.requiredKeys.size} required
            </Badge>
          )}

          {/* Config expand button */}
          {(hasConfig || sectionReqKeys.length > 1) && (
            <button
              type="button"
              onClick={() => toggleExpanded(sk)}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white shrink-0 transition-colors"
              aria-label="Configure section"
            >
              <Settings2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Expanded config panel ── */}
        {isExpanded && (
          <div className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 px-5 py-5 space-y-4">
            {/* BASIC section */}
            {sk === "basic" && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Select which fields are required
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(SECTION_REQ_KEYS.basic as ProfileRequirementKey[]).map(
                    (key) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                      >
                        <Checkbox
                          id={key}
                          checked={state.requiredKeys.has(key)}
                          onCheckedChange={(v) => setKeyRequired(sk, key, !!v)}
                        />
                        <Label htmlFor={key} className="text-xs cursor-pointer">
                          {BASIC_KEY_LABELS[key]}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* DOCUMENTS section */}
            {sk === "documents" && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Select which documents are required
                </p>
                <div className="space-y-2">
                  {(SECTION_REQ_KEYS.documents as ProfileRequirementKey[]).map(
                    (key) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                      >
                        <Checkbox
                          id={key}
                          checked={state.requiredKeys.has(key)}
                          onCheckedChange={(v) => setKeyRequired(sk, key, !!v)}
                        />
                        <Label htmlFor={key} className="text-xs cursor-pointer">
                          {DOC_KEY_LABELS[key]}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* REFEREES section */}
            {sk === "referees" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Number of referees required
                  </Label>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Set to 0 to just require &quot;at least one&quot;.
                  </p>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={refereesRequired}
                    onChange={(e) =>
                      setRefereesRequired(
                        Math.max(0, parseInt(e.target.value) || 0),
                      )
                    }
                    className="h-10 w-32 text-sm"
                  />
                </div>
              </div>
            )}

            {/* EDUCATION section */}
            {sk === "education" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Required education levels
                    </Label>
                    <a
                      href="/recruitment-portal/settings/education-levels"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Manage levels
                    </a>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    If none selected, any education entry satisfies the
                    requirement.
                  </p>

                  {eduLevelsLoading ? (
                    <div className="flex items-center gap-2 text-neutral-500 text-xs py-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Loading education levels…
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {eduLevels.map((level) => (
                        <div
                          key={level.key}
                          className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                        >
                          <Checkbox
                            id={`edu-${level.key}`}
                            checked={requiredEducationLevels.includes(
                              level.key,
                            )}
                            onCheckedChange={(v) =>
                              toggleEducationLevel(level.key, !!v)
                            }
                          />
                          <Label
                            htmlFor={`edu-${level.key}`}
                            className="text-xs cursor-pointer leading-tight"
                          >
                            {level.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EXPERIENCE GENERAL */}
            {sk === "experience_general" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="show-general-exp"
                    checked={showGeneralExperience}
                    onCheckedChange={(v) => setShowGeneralExperience(!!v)}
                  />
                  <Label
                    htmlFor="show-general-exp"
                    className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer"
                  >
                    Show General Experience section to candidates
                  </Label>
                </div>
                {showGeneralExperience && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      General experience requirement description
                    </Label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Informative text shown to candidates (e.g. &quot;Minimum 5
                      years of general experience&quot;)
                    </p>
                    <Textarea
                      value={generalExperienceText}
                      onChange={(e) => setGeneralExperienceText(e.target.value)}
                      placeholder="e.g. A minimum of 5 years of relevant general work experience is required"
                      className="text-sm min-h-20 resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* EXPERIENCE SPECIFIC */}
            {sk === "experience_specific" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="show-specific-exp"
                    checked={showSpecificExperience}
                    onCheckedChange={(v) => setShowSpecificExperience(!!v)}
                  />
                  <Label
                    htmlFor="show-specific-exp"
                    className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer"
                  >
                    Show Specific Experience section to candidates
                  </Label>
                </div>
                {showSpecificExperience && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Specific experience requirement description
                    </Label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Informative text shown to candidates (e.g. &quot;3 years
                      of experience in project management&quot;)
                    </p>
                    <Textarea
                      value={specificExperienceText}
                      onChange={(e) =>
                        setSpecificExperienceText(e.target.value)
                      }
                      placeholder="e.g. 3 years of specific experience in management of donor-funded projects"
                      className="text-sm min-h-20 resize-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── Render ───────────────────────
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary-500" />
          Candidate Profile Requirements &amp; Form Configuration
        </CardTitle>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Configure which sections candidates must complete, set requirements
          per section, and reorder how sections appear in the application form.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading configuration…
          </div>
        ) : (
          <>
            {/* ── Section Ordering & Requirements ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                  Application Form Sections
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Drag ⠿ to reorder • ↑↓ arrows • Toggle &quot;Required&quot;
                </p>
              </div>
              <div className="space-y-2.5">
                {sectionOrder.map((sk, index) => renderSectionRow(sk, index))}
              </div>
            </div>

            {/* ── Global Settings ── */}
            <div className="space-y-3 p-5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <p className="font-semibold text-sm text-neutral-900 dark:text-white">
                Global Settings
              </p>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="show-desc"
                  checked={showDescription}
                  onCheckedChange={(v) => setShowDescription(!!v)}
                />
                <div>
                  <Label
                    htmlFor="show-desc"
                    className="text-sm cursor-pointer font-medium text-neutral-900 dark:text-white flex items-center gap-2"
                  >
                    {showDescription ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-neutral-400" />
                    )}
                    Show job description to candidate during application
                  </Label>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    If enabled, candidates will see the full job description
                    while filling out the application form.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Save ── */}
            <Button
              onClick={save}
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 text-white w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Configuration
                </>
              )}
            </Button>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Sections marked as &quot;Required&quot; must be completed by the
              candidate before they can apply. Section order determines the
              order they appear in the application form.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
