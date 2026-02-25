"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/careers/ui/dialog";
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
  Clock,
  Video,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
  User,
  Briefcase,
} from "lucide-react";
import { interviewsService } from "@/services/recruitment-services";
import { InterviewType, CreateInterviewDto } from "@/types";

// FLEXIBLE TYPE - accepts both full and minimal application data
interface ScheduleInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: {
    id: string;
    jobId: string;
    candidateId: string;
    candidate: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
    job: {
      title: string;
    };
  } | null;
  onSuccess?: () => void;
}

export default function ScheduleInterviewModal({
  open,
  onOpenChange,
  application,
  onSuccess,
}: ScheduleInterviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateInterviewDto>({
    applicationId: "",
    jobId: "",
    candidateId: "",
    scheduledAt: "",
    duration: 60,
    type: "VIDEO" as InterviewType,
    location: "",
    meetingLink: "",
    meetingId: "",
    meetingPassword: "",
    interviewerName: "",
    notes: "",
  });

  // Reset form when application changes
  useEffect(() => {
    if (application) {
      setFormData({
        applicationId: application.id,
        jobId: application.jobId,
        candidateId: application.candidateId,
        scheduledAt: "",
        duration: 60,
        type: "VIDEO" as InterviewType,
        location: "",
        meetingLink: "",
        meetingId: "",
        meetingPassword: "",
        interviewerName: "",
        notes: "",
      });
    }
  }, [application]);

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

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const response = await interviewsService.createInterview({
        ...formData,
        duration: Number(formData.duration),
      });

      if (response.success) {
        toast.success(
          "Interview scheduled successfully! Candidate will be notified via email.",
        );
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-500" />
            Schedule Interview
          </DialogTitle>
          <DialogDescription>
            Schedule an interview with {application.candidate.firstName}{" "}
            {application.candidate.lastName} for {application.job.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Candidate Info Display */}
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary-600" />
                <span className="font-medium">Candidate:</span>{" "}
                {application.candidate.firstName}{" "}
                {application.candidate.lastName}
              </div>
              <div>
                <span className="font-medium">Email:</span>{" "}
                {application.candidate.email}
              </div>
              {application.candidate.phone && (
                <div>
                  <span className="font-medium">Phone:</span>{" "}
                  {application.candidate.phone}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary-600" />
                <span className="font-medium">Position:</span>{" "}
                {application.job.title}
              </div>
            </div>
          </div>

          {/* Date & Time */}
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
              <Label htmlFor="duration">
                Duration (minutes) <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.duration?.toString()}
                onValueChange={(value) => handleSelectChange("duration", value)}
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
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interview Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Interview Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
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
                <SelectItem value="TECHNICAL">Technical Interview</SelectItem>
                <SelectItem value="HR_SCREENING">HR Screening</SelectItem>
                <SelectItem value="PANEL">Panel Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional fields based on interview type */}
          {formData.type === "VIDEO" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="meetingLink">
                  Meeting Link <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="meetingLink"
                  name="meetingLink"
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meetingId">Meeting ID (Optional)</Label>
                  <Input
                    id="meetingId"
                    name="meetingId"
                    placeholder="123-456-789"
                    value={formData.meetingId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingPassword">Password (Optional)</Label>
                  <Input
                    id="meetingPassword"
                    name="meetingPassword"
                    type="password"
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
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Office address, room number, etc."
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {/* Interviewer Name */}
          <div className="space-y-2">
            <Label htmlFor="interviewerName">Interviewer Name (Optional)</Label>
            <Input
              id="interviewerName"
              name="interviewerName"
              placeholder="John Smith"
              value={formData.interviewerName}
              onChange={handleInputChange}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional instructions or information..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">Email Notification</p>
                <p>
                  The candidate will receive an email invitation with all
                  interview details automatically.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
