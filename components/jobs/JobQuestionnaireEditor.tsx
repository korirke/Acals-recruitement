"use client";

import { useEffect, useMemo, useState } from "react";

import { jobQuestionnaireService } from "@/services/recruitment-services";
import type {
  JobQuestion,
  JobQuestionType,
  JobQuestionnaireUpsertPayload,
} from "@/types/recruitment/jobQuestionnaire.types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Textarea } from "@/components/careers/ui/textarea";
import { Label } from "@/components/careers/ui/label";
import { Switch } from "@/components/careers/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { Loader2, Plus, Trash2, MoveUp, MoveDown, Save } from "lucide-react";
import { useError } from "@/context/ErrorContext";

type EditableQuestion = {
  id?: string;
  questionText: string;
  type: JobQuestionType;
  isRequired: boolean;
  placeholder?: string | null;
  sortOrder: number;
};

function newQuestion(sortOrder: number): EditableQuestion {
  return {
    questionText: "",
    type: "OPEN_ENDED",
    isRequired: true,
    placeholder: "",
    sortOrder,
  };
}

export function JobQuestionnaireEditor({ jobId }: { jobId: string }) {
  const { showToast, logError } = useError();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [enabled, setEnabled] = useState(false);
  const [title, setTitle] = useState("Additional Questions");
  const [description, setDescription] = useState<string>("");
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);

  const canSave = useMemo(() => {
    if (!enabled) return true; // allowed to save disabled state
    if (!title.trim()) return false;
    // if enabled, require at least 1 question
    if (questions.length === 0) return false;
    // each question must have text
    return questions.every((q) => q.questionText.trim().length > 0);
  }, [enabled, title, questions]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await jobQuestionnaireService.get(jobId);

        if (!mounted) return;

        if (res.success && res.data) {
          setEnabled(!!res.data.enabled);
          setTitle(res.data.questionnaire?.title || "Additional Questions");
          setDescription(res.data.questionnaire?.description || "");

          const mapped = (res.data.questions || [])
            .slice()
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((q: JobQuestion, idx: number) => ({
              id: q.id,
              questionText: q.questionText || "",
              type: q.type,
              isRequired: !!q.isRequired,
              placeholder: q.placeholder ?? "",
              sortOrder: typeof q.sortOrder === "number" ? q.sortOrder : idx,
            }));

          setQuestions(mapped);
        } else {
          // default empty
          setEnabled(false);
          setTitle("Additional Questions");
          setDescription("");
          setQuestions([]);
        }
      } catch (e: any) {
        logError(e);
        showToast(e?.message || "Failed to load job questionnaire", "error");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [jobId]);

  const move = (index: number, direction: -1 | 1) => {
    setQuestions((prev) => {
      const next = prev.slice();
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;

      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;

      // normalize sortOrder
      return next.map((q, i) => ({ ...q, sortOrder: i }));
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => {
      const next = prev.slice();
      next.push(newQuestion(next.length));
      return next;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, sortOrder: i })),
    );
  };

  const updateQuestion = (index: number, patch: Partial<EditableQuestion>) => {
    setQuestions((prev) => {
      const next = prev.slice();
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const onSave = async () => {
    if (!canSave) {
      showToast(
        "Please complete the questionnaire configuration before saving.",
        "error",
      );
      return;
    }

    const payload: JobQuestionnaireUpsertPayload = {
      isActive: enabled,
      title: title.trim() || "Additional Questions",
      description: description?.trim() ? description.trim() : null,
      questions: questions.map((q, idx) => ({
        id: q.id,
        questionText: q.questionText.trim(),
        type: q.type,
        isRequired: !!q.isRequired,
        placeholder: q.placeholder?.trim() ? q.placeholder.trim() : null,
        sortOrder: typeof q.sortOrder === "number" ? q.sortOrder : idx,
      })),
    };

    try {
      setSaving(true);
      const res = await jobQuestionnaireService.upsert(jobId, payload);

      if (res.success) {
        showToast("Questionnaire saved successfully", "success");
        // refresh from server to normalize ordering/ids
        const fresh = await jobQuestionnaireService.get(jobId);
        if (fresh.success && fresh.data) {
          setEnabled(!!fresh.data.enabled);
          setTitle(fresh.data.questionnaire?.title || "Additional Questions");
          setDescription(fresh.data.questionnaire?.description || "");
          setQuestions(
            (fresh.data.questions || [])
              .slice()
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
              .map((q, i) => ({
                id: q.id,
                questionText: q.questionText || "",
                type: q.type,
                isRequired: !!q.isRequired,
                placeholder: q.placeholder ?? "",
                sortOrder: typeof q.sortOrder === "number" ? q.sortOrder : i,
              })),
          );
        }
      } else {
        showToast(res.message || "Failed to save questionnaire", "error");
      }
    } catch (e: any) {
      logError(e);
      showToast(e?.message || "Failed to save questionnaire", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardContent className="p-6 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading questionnaire…
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
          Job Additional Questions
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Optional questions shown during candidate application. If disabled,
          candidates won't see them.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Enable toggle */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <div>
            <div className="font-medium text-neutral-900 dark:text-white">
              Enable questionnaire
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Candidates will be required to answer required questions before
              submitting.
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {/* Title/Description */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Additional Questions"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context for candidates (optional)…"
              className="min-h-[90px]"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold text-neutral-900 dark:text-white">
            Questions
          </div>
          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <div className="text-sm text-neutral-500 dark:text-neutral-400 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 text-center">
            No questions yet. Click{" "}
            <span className="font-medium">Add Question</span>.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50/50 dark:bg-neutral-950/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium text-neutral-900 dark:text-white">
                    Question #{idx + 1}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => move(idx, 1)}
                      disabled={idx === questions.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(idx)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Question Text</Label>
                    <Textarea
                      value={q.questionText}
                      onChange={(e) =>
                        updateQuestion(idx, { questionText: e.target.value })
                      }
                      placeholder="e.g. Do you have at least 3 years of React experience?"
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={q.type}
                      onValueChange={(v) =>
                        updateQuestion(idx, { type: v as JobQuestionType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES_NO">Yes / No</SelectItem>
                        <SelectItem value="OPEN_ENDED">Open ended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Required</Label>
                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-white dark:bg-neutral-900">
                      <span className="text-sm text-neutral-700 dark:text-neutral-200">
                        Must answer before submit
                      </span>
                      <Switch
                        checked={q.isRequired}
                        onCheckedChange={(checked) =>
                          updateQuestion(idx, { isRequired: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Placeholder (optional)</Label>
                    <Input
                      value={q.placeholder || ""}
                      onChange={(e) =>
                        updateQuestion(idx, { placeholder: e.target.value })
                      }
                      placeholder="Shown in the input box (optional)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            onClick={onSave}
            disabled={saving || !canSave}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Questionnaire
              </>
            )}
          </Button>
        </div>

        {!canSave && (
          <div className="text-xs text-orange-600">
            If enabled: provide a title, at least 1 question, and ensure all
            question texts are filled.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default JobQuestionnaireEditor;
