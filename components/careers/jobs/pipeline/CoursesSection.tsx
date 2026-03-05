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
import {
  BookText,
  Plus,
  Trash2,
  Building2,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";

interface CourseItem {
  id: string;
  name: string;
  institution: string;
  durationWeeks: number;
  year: number;
}

interface Props {
  initialCourses?: CourseItem[];
  onCountChange?: (count: number) => void;
}

export default function CoursesSection({
  initialCourses = [],
  onCountChange,
}: Props) {
  const { showToast } = useToast();

  const [items, setItems] = useState<CourseItem[]>(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    institution: "",
    durationWeeks: "" as any,
    year: "" as any,
  });

  const reportCount = (list: CourseItem[]) => onCountChange?.(list.length);

  const resetForm = () =>
    setForm({ name: "", institution: "", durationWeeks: "", year: "" });

  const handleAdd = async () => {
    if (
      !form.name.trim() ||
      !form.institution.trim() ||
      !form.durationWeeks ||
      !form.year
    ) {
      showToast({
        type: "error",
        title: "Required",
        message: "Course name, institution, duration and year are required",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await candidateService.addCourse({
        name: form.name.trim(),
        institution: form.institution.trim(),
        durationWeeks: parseInt(form.durationWeeks),
        year: parseInt(form.year),
      });

      if (res.success && res.data) {
        const next = [...items, res.data as CourseItem];
        setItems(next);
        reportCount(next);
        resetForm();
        setShowForm(false);

        showToast({
          type: "success",
          title: "Saved",
          message: "Course saved to your profile",
        });
      } else {
        showToast({
          type: "error",
          title: "Save failed",
          message: res.message || "Could not save course",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to save course",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    setDeleting(id);
    try {
      const res = await candidateService.deleteCourse(id);
      if (res.success !== false) {
        const next = items.filter((c) => c.id !== id);
        setItems(next);
        reportCount(next);
      } else {
        showToast({
          type: "error",
          title: "Error",
          message: res.message || "Could not remove course",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to remove course",
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
              <BookText className="h-5 w-5 text-primary-500" />
              Training Courses <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Professional training, leadership, or development courses — saved
              instantly
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
        {items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {items.length} course{items.length !== 1 ? "s" : ""} in your
                profile
              </Label>
            </div>

            <div className="space-y-2">
              {items.map((course) => (
                <div
                  key={course.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                      {course.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {course.institution} · {course.durationWeeks} weeks ·{" "}
                      {course.year}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleRemove(course.id)}
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={deleting === course.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    {deleting === course.id ? (
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

        {showForm && (
          <div className="space-y-4 p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Course Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Strategic Leadership Development"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Institution / Provider <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={form.institution}
                  onChange={(e) =>
                    setForm({ ...form, institution: e.target.value })
                  }
                  placeholder="e.g. Kenya School of Government"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Duration (weeks) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="number"
                    value={form.durationWeeks}
                    onChange={(e) =>
                      setForm({ ...form, durationWeeks: e.target.value })
                    }
                    placeholder="e.g. 4"
                    min={1}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Year Completed <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder={String(new Date().getFullYear())}
                  min={1980}
                  max={new Date().getFullYear()}
                  className="h-11"
                />
              </div>
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
                    Saving...
                  </>
                ) : (
                  "Add Course"
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

        {items.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <BookText className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              At least 1 training course is required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
