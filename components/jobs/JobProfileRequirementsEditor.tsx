"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Checkbox } from "@/components/careers/ui/checkbox";
import { Label } from "@/components/careers/ui/label";
import { Loader2, Save } from "lucide-react";
import { jobProfileRequirementsService } from "@/services/recruitment-services";
import type { ProfileRequirementKey } from "@/types";
import { useError } from "@/context/ErrorContext";

const OPTIONS: Array<{
  key: ProfileRequirementKey;
  label: string;
  group: string;
}> = [
  { group: "Basic", key: "BASIC_PHONE", label: "Phone number" },
  { group: "Basic", key: "BASIC_LOCATION", label: "Location" },
  { group: "Basic", key: "BASIC_TITLE", label: "Professional title" },
  { group: "Basic", key: "BASIC_BIO", label: "Bio (min 50 chars)" },

  { group: "Core", key: "RESUME", label: "Resume/CV uploaded" },
  { group: "Core", key: "SKILLS", label: "Skills" },
  { group: "Core", key: "EXPERIENCE", label: "Work experience" },
  { group: "Core", key: "EDUCATION", label: "Education" },

  {
    group: "Compliance",
    key: "PERSONAL_INFO",
    label: "Personal info (DOB, ID, nationality...)",
  },
  { group: "Compliance", key: "CLEARANCES", label: "Statutory clearances" },
  {
    group: "Compliance",
    key: "MEMBERSHIPS",
    label: "Professional memberships",
  },
  { group: "Compliance", key: "PUBLICATIONS", label: "Publications" },
  { group: "Compliance", key: "COURSES", label: "Courses / trainings" },
  { group: "Compliance", key: "REFEREES", label: "Referees" },

  {
    group: "Documents",
    key: "DOCUMENT_NATIONAL_ID",
    label: "National ID document uploaded",
  },
  {
    group: "Documents",
    key: "DOCUMENT_ACADEMIC_CERT",
    label: "Academic certificates uploaded",
  },
  {
    group: "Documents",
    key: "DOCUMENT_PROFESSIONAL_CERT",
    label: "Professional certificates uploaded",
  },
];

export function JobProfileRequirementsEditor({ jobId }: { jobId: string }) {
  const { showToast, logError } = useError(); // ✅ inside the component
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<ProfileRequirementKey[]>([]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof OPTIONS> = {};
    for (const o of OPTIONS) {
      map[o.group] = map[o.group] || [];
      map[o.group].push(o);
    }
    return map;
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await jobProfileRequirementsService.get(jobId);
        if (mounted && res.success && res.data) {
          setSelected(res.data.requirementKeys || []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [jobId]);

  const toggle = (key: ProfileRequirementKey, checked: boolean) => {
    setSelected((prev) => {
      const set = new Set(prev);
      checked ? set.add(key) : set.delete(key);
      return Array.from(set);
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await jobProfileRequirementsService.upsert(jobId, selected);
      if (res.success) {
        showToast("Requirements saved successfully", "success");
      } else {
        showToast("Failed to save requirements", "error");
      }
    } catch (error: any) {
      logError(error);
      showToast(error.message || "Failed to save requirements", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-lg">
          Candidate profile requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading ? (
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading requirements...
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="space-y-3">
                <p className="font-semibold text-neutral-900 dark:text-white">
                  {group}
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {items.map((o) => {
                    const checked = selected.includes(o.key);
                    return (
                      <div
                        key={o.key}
                        className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
                      >
                        <Checkbox
                          id={o.key}
                          checked={checked}
                          onCheckedChange={(v) => toggle(o.key, !!v)}
                        />
                        <Label htmlFor={o.key} className="cursor-pointer">
                          {o.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <Button
              onClick={save}
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save requirements
                </>
              )}
            </Button>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              If you select requirements here, candidates must complete those
              profile sections before applying.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
