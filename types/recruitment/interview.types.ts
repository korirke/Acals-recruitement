export type InterviewStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED"
  | "NO_SHOW";

export type InterviewType =
  | "PHONE"
  | "VIDEO"
  | "IN_PERSON"
  | "TECHNICAL"
  | "HR_SCREENING"
  | "PANEL";

export interface InterviewCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  candidateProfile?: {
    title?: string;
    location?: string;
    resumeUrl?: string;
  };
}

export interface InterviewJob {
  id: string;
  title: string;
  company?: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface InterviewApplication {
  id: string;
  status: string;
  coverLetter?: string;
  appliedAt: string;
}

export interface InterviewInterviewer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface InterviewHistoryEntry {
  id: string;
  interviewId: string;
  fromStatus?: InterviewStatus;
  toStatus: InterviewStatus;
  changedBy: string;
  reason?: string;
  notes?: string;
  changedAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export interface Interview {
  history: boolean;
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  scheduledAt: string;
  duration: number;
  status: InterviewStatus;
  type: InterviewType;
  location?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  interviewerName?: string;
  interviewerId?: string;
  notes?: string;
  feedback?: string;
  rating?: number;
  outcome?: string;
  reminderSent: boolean;
  reminderSentAt?: string;
  createdAt: string;
  updatedAt: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  job: {
    title: string;
    company?: {
      name: string;
    };
  };
  interviewer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateInterviewDto {
  applicationId: string;
  jobId: string;
  candidateId: string;
  scheduledAt: string;
  duration?: number;
  type: InterviewType;
  location?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  interviewerName?: string;
  interviewerId?: string;
  notes?: string;
}

export interface UpdateInterviewDto extends Partial<CreateInterviewDto> {
  status?: InterviewStatus;
  feedback?: string;
  rating?: number;
  outcome?: string;
}

export interface SearchInterviewsParams {
  query?: string;
  status?: InterviewStatus;
  type?: InterviewType;
  jobId?: string;
  candidateId?: string;
  interviewerId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface InterviewSearchResult {
  interviews: Interview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}