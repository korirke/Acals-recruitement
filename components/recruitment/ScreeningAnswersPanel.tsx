"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Badge } from "@/components/careers/ui/badge";
import { HelpCircle } from "lucide-react";

type ScreeningAnswerItem = {
  questionId?: string;
  questionText?: string;
  type?: "YES_NO" | "OPEN_ENDED" | string;
  answerText?: string | null;
  answerBool?: boolean | null;
};

function safeParseJson(v: any) {
  if (!v) return null;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  }
  return v;
}

/**
 * Supports many shapes:
 * - Array of answers
 * - { questionnaireAnswers: [...] }
 * - { screening: [...] }
 * - { answers: [...] }
 * - { [questionId]: {answerText/answerBool/type} }
 */
function normalizeAnswers(raw: any): ScreeningAnswerItem[] {
  const parsed = safeParseJson(raw);
  if (!parsed) return [];

  if (Array.isArray(parsed)) return parsed as ScreeningAnswerItem[];

  const maybeArr =
    parsed.questionnaireAnswers ||
    parsed.screening ||
    parsed.answers ||
    parsed.data;

  if (Array.isArray(maybeArr)) return maybeArr as ScreeningAnswerItem[];

  // map/object fallback
  if (typeof parsed === "object") {
    const out: ScreeningAnswerItem[] = [];
    for (const [k, v] of Object.entries(parsed)) {
      if (!v || typeof v !== "object") continue;
      out.push({
        questionId: k,
        ...(v as any),
      });
    }
    return out;
  }

  return [];
}

function YesNoBadge({ value }: { value: boolean | null | undefined }) {
  if (value === true)
    return <Badge className="bg-green-600 text-white">Yes</Badge>;
  if (value === false)
    return <Badge className="bg-red-600 text-white">No</Badge>;
  return <Badge variant="secondary">—</Badge>;
}

export default function ScreeningAnswersPanel({
  title,
  description,
  rawAnswers,
  questionTextById,
}: {
  title?: string;
  description?: string | null;
  rawAnswers: any;
  questionTextById?: Record<string, string>;
}) {
  const answers = useMemo(() => normalizeAnswers(rawAnswers), [rawAnswers]);

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          {title || "Screening Answers"}
        </CardTitle>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          {description || "Candidate responses to job screening questions."}
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        {answers.length === 0 ? (
          <div className="py-10 text-center text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            No screening answers found.
          </div>
        ) : (
          <div className="space-y-3">
            {answers.map((a, idx) => {
              const qText =
                a.questionText ||
                (a.questionId && questionTextById?.[a.questionId]) ||
                (a.questionId
                  ? `Question (${a.questionId})`
                  : `Question #${idx + 1}`);

              const type = (a.type || "").toUpperCase();

              return (
                <div
                  key={a.questionId || idx}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50/60 dark:bg-neutral-950/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white">
                        {idx + 1}. {qText}
                      </div>
                      <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Type:{" "}
                        {type === "YES_NO"
                          ? "Yes/No"
                          : type === "OPEN_ENDED"
                            ? "Open ended"
                            : a.type || "Unknown"}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {type === "YES_NO" ? (
                        <YesNoBadge value={a.answerBool ?? null} />
                      ) : (
                        <Badge variant="secondary">Text</Badge>
                      )}
                    </div>
                  </div>

                  {type === "OPEN_ENDED" ? (
                    <div className="mt-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-line wrap-break-word">
                      {a.answerText?.trim() ? a.answerText : "—"}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
