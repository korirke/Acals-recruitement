export type JobQuestionType = "YES_NO" | "OPEN_ENDED";

export interface JobQuestionnaire {
  id: string;
  jobId: string;
  title: string;
  description?: string | null;
  isActive: boolean;
}

export interface JobQuestion {
  id: string;
  jobId: string;
  questionnaireId: string;
  questionText: string;
  type: JobQuestionType;
  isRequired: boolean;
  placeholder?: string | null;
  sortOrder: number;
}

export interface JobQuestionnaireGetResponse {
  enabled: boolean;
  questionnaire: JobQuestionnaire | null;
  questions: JobQuestion[];
}

export interface JobQuestionnaireUpsertPayload {
  isActive: boolean;
  title: string;
  description?: string | null;
  questions: Array<{
    id?: string;
    questionText: string;
    type: JobQuestionType;
    isRequired: boolean;
    placeholder?: string | null;
    sortOrder?: number;
  }>;
}

export type QuestionnaireAnswerValue =
  | { type: "YES_NO"; answerBool: boolean | null }
  | { type: "OPEN_ENDED"; answerText: string };

export interface QuestionnaireAnswerPayloadItem {
  questionId: string;
  type: JobQuestionType;
  answerText?: string | null;
  answerBool?: boolean | null;
}
