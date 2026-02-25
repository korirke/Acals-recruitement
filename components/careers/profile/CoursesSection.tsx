"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { candidateService } from "@/services/recruitment-services";
import type {
  CandidateProfile,
  CandidateCourse,
} from "@/types";
import {
  Plus,
  X,
  Loader2,
  Save,
  Trash2,
  Edit2,
  GraduationCap,
} from "lucide-react";

export default function CoursesSection({
  profile,
  onUpdate,
}: {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const courses: CandidateCourse[] = (profile as any)?.courses || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    institution: "",
    durationWeeks: "",
    year: "",
  });

  const reset = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm({ name: "", institution: "", durationWeeks: "", year: "" });
  };

  const edit = (c: any) => {
    setEditingId(c.id);
    setIsAdding(true);
    setForm({
      name: c.name || "",
      institution: c.institution || "",
      durationWeeks: String(c.durationWeeks ?? ""),
      year: String(c.year ?? ""),
    });
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Course name is required",
        variant: "destructive",
      });
      return;
    }
    if (!form.institution.trim()) {
      toast({
        title: "Validation Error",
        description: "Institution is required",
        variant: "destructive",
      });
      return;
    }
    if (!form.durationWeeks || isNaN(Number(form.durationWeeks))) {
      toast({
        title: "Validation Error",
        description: "Duration weeks is required",
        variant: "destructive",
      });
      return;
    }
    if (!form.year || isNaN(Number(form.year))) {
      toast({
        title: "Validation Error",
        description: "Year is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: form.name.trim(),
        institution: form.institution.trim(),
        durationWeeks: Number(form.durationWeeks),
        year: Number(form.year),
      };

      if (editingId) {
        await candidateService.updateCourse(editingId, payload);
        toast({ title: "Updated", description: "Course updated" });
      } else {
        await candidateService.addCourse(payload);
        toast({ title: "Added", description: "Course added" });
      }

      reset();
      onUpdate();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try {
      setIsLoading(true);
      await candidateService.deleteCourse(id);
      toast({ title: "Deleted", description: "Course deleted" });
      onUpdate();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to delete",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-orange-500" />
              Courses / Leadership Training
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Add leadership courses and professional trainings (duration in
              weeks).
            </CardDescription>
          </div>

          <Button
            onClick={() => (isAdding ? reset() : setIsAdding(true))}
            variant={isAdding ? "outline" : "default"}
            size="sm"
            className={
              isAdding ? "" : "bg-primary-500 hover:bg-primary-600 text-white"
            }
          >
            {isAdding ? (
              <>
                <X className="h-4 w-4 mr-2" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Add Course
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAdding && (
          <Card className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Course Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Strategic Leadership Program"
                />
              </div>

              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input
                  value={form.institution}
                  onChange={(e) =>
                    setForm({ ...form, institution: e.target.value })
                  }
                  placeholder="e.g. Kenya School of Government"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (Weeks) *</Label>
                  <Input
                    value={form.durationWeeks}
                    onChange={(e) =>
                      setForm({ ...form, durationWeeks: e.target.value })
                    }
                    inputMode="numeric"
                    placeholder="e.g. 4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year *</Label>
                  <Input
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    inputMode="numeric"
                    placeholder="e.g. 2023"
                  />
                </div>
              </div>

              <Button
                onClick={submit}
                disabled={isLoading}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />{" "}
                    {editingId ? "Update Course" : "Add Course"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {courses.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No courses added yet</p>
            <p className="text-sm mt-1">
              Add leadership courses/training programs.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((c: any) => (
              <Card
                key={c.id}
                className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">
                        {c.name}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {c.institution} • {c.durationWeeks} weeks • {c.year}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        onClick={() => edit(c)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        disabled={isLoading}
                        onClick={() => del(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
