"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Textarea } from "@/components/careers/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { toast } from "sonner";
import {
  Calendar,
  ArrowLeft,
  Loader2,
  User,
  Briefcase,
  Clock,
  MapPin,
  Video,
  Phone,
  Star,
} from "lucide-react";
import { interviewsService } from "@/services/recruitment-services";
import {
  type InterviewType,
  type InterviewStatus,
  type UpdateInterviewDto,
  type Interview,
} from "@/types";

export default function EditInterviewClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [interview, setInterview] = useState<Interview | null>(null);

  const [formData, setFormData] = useState<UpdateInterviewDto>({
    scheduledAt: "",
    duration: 60,
    type: "VIDEO" as InterviewType,
    status: "SCHEDULED" as InterviewStatus,
    location: "",
    meetingLink: "",
    meetingId: "",
    meetingPassword: "",
    interviewerName: "",
    notes: "",
    feedback: "",
    rating: undefined,
    outcome: "",
  });

  useEffect(() => {
    if (interviewId) {
      fetchInterview();
    } else {
      toast.error("Interview ID is required");
      router.push("/recruitment-portal/interviews");
    }
  }, [interviewId]);

  const fetchInterview = async () => {
    if (!interviewId) return;

    try {
      setFetchLoading(true);
      const response = await interviewsService.getInterviewById(interviewId);

      if (response.success && response.data) {
        const data = response.data;
        setInterview(data);

        // Format datetime for input
        const scheduledDate = new Date(data.scheduledAt);
        const formattedDate = scheduledDate.toISOString().slice(0, 16);

        setFormData({
          scheduledAt: formattedDate,
          duration: data.duration,
          type: data.type,
          status: data.status,
          location: data.location || "",
          meetingLink: data.meetingLink || "",
          meetingId: data.meetingId || "",
          meetingPassword: data.meetingPassword || "",
          interviewerName: data.interviewerName || "",
          notes: data.notes || "",
          feedback: data.feedback || "",
          rating: data.rating || undefined,
          outcome: data.outcome || "",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load interview");
      router.push("/recruitment-portal/interviews");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!interviewId) {
      toast.error("Interview ID is required");
      return;
    }

    if (!formData.scheduledAt) {
      toast.error("Please select interview date and time");
      return;
    }

    if (formData.type === "VIDEO" && !formData.meetingLink) {
      toast.error("Please provide a meeting link for video interviews");
      return;
    }

    if (formData.type === "IN_PERSON" && !formData.location) {
      toast.error("Please provide a location for in-person interviews");
      return;
    }

    try {
      setLoading(true);

      const updateData: UpdateInterviewDto = {
        ...formData,
        duration: Number(formData.duration),
        rating: formData.rating ? Number(formData.rating) : undefined,
      };

      const response = await interviewsService.updateInterview(
        interviewId,
        updateData,
      );

      if (response.success) {
        toast.success("Interview updated successfully");
        router.push(`/recruitment-portal/interviews/detail?id=${interviewId}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update interview");
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Interview not found</p>
        <Button
          onClick={() => router.push("/recruitment-portal/interviews")}
          className="mt-4"
        >
          Back to Interviews
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              router.push(
                `/recruitment-portal/interviews/detail?id=${interviewId}`,
              )
            }
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
              Edit Interview
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Update interview details and status
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Candidate Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary-600" />
                    <span className="font-medium">
                      {interview.candidate.firstName}{" "}
                      {interview.candidate.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Briefcase className="h-4 w-4" />
                    <span>{interview.job.title}</span>
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Email: {interview.candidate.email}
                  </div>
                  {interview.candidate.phone && (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Phone: {interview.candidate.phone}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Interview Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledAt">
                      Date & Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="scheduledAt"
                      name="scheduledAt"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={handleInputChange}
                      min={getMinDateTime()}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select
                      value={formData.duration?.toString()}
                      onValueChange={(value) =>
                        handleSelectChange("duration", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Interview Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleSelectChange("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHONE">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Interview
                          </div>
                        </SelectItem>
                        <SelectItem value="VIDEO">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Video Interview
                          </div>
                        </SelectItem>
                        <SelectItem value="IN_PERSON">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            In-Person Interview
                          </div>
                        </SelectItem>
                        <SelectItem value="TECHNICAL">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Technical Interview
                          </div>
                        </SelectItem>
                        <SelectItem value="HR_SCREENING">
                          HR Screening
                        </SelectItem>
                        <SelectItem value="PANEL">Panel Interview</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                        <SelectItem value="NO_SHOW">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.type === "VIDEO" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="meetingLink">Meeting Link</Label>
                      <Input
                        id="meetingLink"
                        name="meetingLink"
                        type="url"
                        placeholder="https://meet.google.com/..."
                        value={formData.meetingLink}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meetingId">Meeting ID</Label>
                        <Input
                          id="meetingId"
                          name="meetingId"
                          placeholder="123-456-789"
                          value={formData.meetingId}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meetingPassword">
                          Meeting Password
                        </Label>
                        <Input
                          id="meetingPassword"
                          name="meetingPassword"
                          placeholder="••••••"
                          value={formData.meetingPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                {formData.type === "IN_PERSON" && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Office address, room number, etc."
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="interviewerName">Interviewer Name</Label>
                  <Input
                    id="interviewerName"
                    name="interviewerName"
                    placeholder="John Smith"
                    value={formData.interviewerName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Additional notes or instructions..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Feedback & Rating */}
            {(formData.status === "COMPLETED" ||
              formData.status === "IN_PROGRESS") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Feedback & Evaluation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Select
                        value={formData.rating?.toString() || ""}
                        onValueChange={(value) =>
                          handleSelectChange("rating", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Poor</SelectItem>
                          <SelectItem value="2">2 - Fair</SelectItem>
                          <SelectItem value="3">3 - Good</SelectItem>
                          <SelectItem value="4">4 - Very Good</SelectItem>
                          <SelectItem value="5">5 - Excellent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="outcome">Outcome</Label>
                      <Select
                        value={formData.outcome || ""}
                        onValueChange={(value) =>
                          handleSelectChange("outcome", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select outcome" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PASS">Pass</SelectItem>
                          <SelectItem value="FAIL">Fail</SelectItem>
                          <SelectItem value="MAYBE">Maybe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback">Interview Feedback</Label>
                    <Textarea
                      id="feedback"
                      name="feedback"
                      placeholder="Detailed feedback about the candidate's performance..."
                      value={formData.feedback}
                      onChange={handleInputChange}
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Update Interview
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(
                      `/recruitment-portal/interviews/detail?id=${interviewId}`,
                    )
                  }
                  disabled={loading}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Interview History */}
            {interview.history &&
              Array.isArray(interview.history) &&
              interview.history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {interview.history.map((history: any) => (
                        <div
                          key={history.id}
                          className="text-sm border-l-2 border-primary-500 pl-3 py-2"
                        >
                          <p className="font-medium">
                            {history.fromStatus || "New"} → {history.toStatus}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(history.changedAt).toLocaleString()}
                          </p>
                          {history.reason && (
                            <p className="text-xs text-neutral-600 mt-1">
                              {history.reason}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </form>
    </div>
  );
}
