"use client";
import { useState } from "react";
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
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  Building2,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";

interface ExpItem {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
}

interface Props {
  /** Items already in profile */
  initialExperience?: ExpItem[];
  /** Optional descriptive text set by admin (shown as info banner) */
  description?: string;
  /** Section title override — defaults to "Work Experience" */
  sectionTitle?: string;
  /** Optional count callback */
  onCountChange?: (count: number) => void;
}

const fmtDate = (d?: string | null) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

export default function ExperienceSection({
  initialExperience = [],
  description,
  sectionTitle = "Work Experience",
  onCountChange,
}: Props) {
  const { showToast } = useToast();
  const [items, setItems] = useState<ExpItem[]>(initialExperience);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  const reportCount = (list: ExpItem[]) => onCountChange?.(list.length);
  const resetForm = () =>
    setForm({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });

  // ── Add ────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (
      !form.title.trim() ||
      !form.company.trim() ||
      !form.startDate ||
      !form.description.trim()
    ) {
      showToast({
        type: "error",
        title: "Required",
        message: "Job title, company, start date and description are required",
      });
      return;
    }
    setSaving(true);
    try {
      const res = await candidateService.addExperience({
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim() || null,
        startDate: form.startDate,
        endDate: form.isCurrent ? undefined : form.endDate || undefined,
        isCurrent: form.isCurrent,
        description: form.description.trim() || null,
      });
      if (res.success && res.data) {
        const next = [...items, res.data as ExpItem];
        setItems(next);
        resetForm();
        setShowForm(false);
        reportCount(next);
        showToast({
          type: "success",
          title: "Saved",
          message: "Experience saved to your profile",
        });
      } else {
        showToast({
          type: "error",
          title: "Save failed",
          message: res.message || "Could not save experience",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to save experience",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Remove ────────────────────────────────────────────────────────────
  const handleRemove = async (id: string) => {
    setDeleting(id);
    try {
      const res = await candidateService.deleteExperience(id);
      if (res.success !== false) {
        const next = items.filter((e) => e.id !== id);
        setItems(next);
        reportCount(next);
      } else {
        showToast({
          type: "error",
          title: "Error",
          message: res.message || "Could not remove experience",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to remove experience",
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
              <Briefcase className="h-5 w-5 text-primary-500" />
              {sectionTitle}
              <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Add your relevant work history — saved instantly to your profile
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
        {/* Admin description text */}
        {description && (
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {description}
            </p>
          </div>
        )}

        {/* Items list */}
        {items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {items.length} experience entr{items.length === 1 ? "y" : "ies"}{" "}
                in your profile
              </Label>
            </div>
            <div className="space-y-2">
              {items.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white truncate">
                      {exp.title}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {exp.company}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                      {fmtDate(exp.startDate)} –{" "}
                      {exp.isCurrent ? "Present" : fmtDate(exp.endDate)}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRemove(exp.id)}
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={deleting === exp.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    {deleting === exp.id ? (
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

        {/* Add Form */}
        {showForm && (
          <div className="space-y-4 p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Company <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="e.g. Tech Corp"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
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
                <Label className="text-sm font-medium">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    disabled={form.isCurrent}
                    className="pl-10 h-11 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <Checkbox
                id="isCurrent"
                checked={form.isCurrent}
                onCheckedChange={(v) =>
                  setForm({
                    ...form,
                    isCurrent: !!v,
                    endDate: v ? "" : form.endDate,
                  })
                }
              />
              <Label htmlFor="isCurrent" className="text-sm cursor-pointer">
                I currently work here
              </Label>
            </div>

            {/* Description box — compulsory */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </Label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe your responsibilities, achievements, and key contributions in this role…"
                rows={4}
                className="w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y disabled:opacity-50"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                type="button"
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Add Experience"
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

        {/* Validation */}
        {items.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Briefcase className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              At least 1 work experience entry is required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
