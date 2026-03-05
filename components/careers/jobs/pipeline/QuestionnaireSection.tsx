"use client";

import type { JobQuestion } from "@/types/recruitment/jobQuestionnaire.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Label } from "@/components/careers/ui/label";
import { Textarea } from "@/components/careers/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { HelpCircle } from "lucide-react";

export type QuestionnaireAnswersState = Record<
  string,
  {
    type: "YES_NO" | "OPEN_ENDED";
    answerBool?: boolean | null;
    answerText?: string;
  }
>;

export default function QuestionnaireSection({
  title,
  description,
  questions,
  answers,
  onChange,
}: {
  title?: string;
  description?: string | null;
  questions: JobQuestion[];
  answers: QuestionnaireAnswersState;
  onChange: (next: QuestionnaireAnswersState) => void;
}) {
  if (!questions || questions.length === 0) return null;

  const setAnswer = (
    questionId: string,
    patch: QuestionnaireAnswersState[string],
  ) => {
    onChange({
      ...answers,
      [questionId]: {
        ...(answers[questionId] || {}),
        ...patch,
      },
    });
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary-500" />
          {title || "Screening Questions"}
        </CardTitle>
        {description ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {description}
          </p>
        ) : (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Please answer the questions below.
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {questions
          .slice()
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((q, idx) => {
            const a = answers[q.id];
            const required = !!q.isRequired;

            return (
              <div key={q.id} className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                  {idx + 1}. {q.questionText}{" "}
                  {required ? <span className="text-red-500">*</span> : null}
                </Label>

                {q.type === "YES_NO" ? (
                  <Select
                    value={
                      a?.answerBool === true
                        ? "YES"
                        : a?.answerBool === false
                          ? "NO"
                          : ""
                    }
                    onValueChange={(v) =>
                      setAnswer(q.id, {
                        type: "YES_NO",
                        answerBool:
                          v === "YES" ? true : v === "NO" ? false : null,
                      })
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select an answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YES">Yes</SelectItem>
                      <SelectItem value="NO">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Textarea
                    value={a?.answerText || ""}
                    onChange={(e) =>
                      setAnswer(q.id, {
                        type: "OPEN_ENDED",
                        answerText: e.target.value,
                      })
                    }
                    placeholder={q.placeholder || "Type your answer..."}
                    className="min-h-[110px] resize-none"
                  />
                )}

                {q.type === "OPEN_ENDED" &&
                required &&
                (a?.answerText || "").trim().length === 0 ? (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    This question is required.
                  </p>
                ) : null}
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}
