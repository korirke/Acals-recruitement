"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
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
} from "lucide-react";
import {
  type InterviewType,
  type CreateInterviewDto,
} from "@/types/recruitment/interview.types";
import { applicationsService, interviewsService } from "@/services/recruitment-services";

interface Application {
  id: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  job: {
    id: string;
    title: string;
  };
}

export default function NewInterviewClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

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
    interviewerId: "",
    notes: "",
  });

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const response = await applicationsService.getMyApplications({
        status: "REVIEWED",
        page: 1,
        limit: 100,
      });

      if (response.success && response.data) {
        setApplications(response.data.applications || []);
      }
    } catch (error: any) {
      toast.error("Failed to load applications");
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleApplicationSelect = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (app) {
      setSelectedApplication(app);
      setFormData((prev) => ({
        ...prev,
        applicationId: app.id,
        jobId: app.job.id,
        candidateId: app.candidate.id,
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (!formData.applicationId) {
      toast.error("Please select an application");
      return;
    }

    if (!formData.scheduledAt) {
      toast.error("Please select interview date and time");
      return;
    }

    if (!formData.type) {
      toast.error("Please select interview type");
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
        toast.success("Interview scheduled successfully");
        router.push("/recruitment-portal/interviews");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/recruitment-portal/interviews")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
              Schedule New Interview
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Schedule an interview with a candidate
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Select Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationId">
                    Application <span className="text-red-500">*</span>
                  </Label>
                  {loadingApplications ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                    </div>
                  ) : (
                    <Select value={formData.applicationId} onValueChange={handleApplicationSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an application" />
                      </SelectTrigger>
                      <SelectContent>
                        {applications.length === 0 ? (
                          <div className="p-4 text-center text-sm text-neutral-500">
                            No applications available
                          </div>
                        ) : (
                          applications.map((app) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.candidate.firstName} {app.candidate.lastName} - {app.job.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedApplication && (
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary-600" />
                      <span className="font-medium">
                        {selectedApplication.candidate.firstName} {selectedApplication.candidate.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Briefcase className="h-4 w-4" />
                      <span>{selectedApplication.job.title}</span>
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      Email: {selectedApplication.candidate.email}
                    </div>
                    {selectedApplication.candidate.phone && (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Phone: {selectedApplication.candidate.phone}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

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
                        <SelectItem value="180">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">
                    Interview Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
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
                      <SelectItem value="HR_SCREENING">HR Screening</SelectItem>
                      <SelectItem value="PANEL">Panel Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                        <Label htmlFor="meetingPassword">Meeting Password (Optional)</Label>
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
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Additional notes or instructions for the interview..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Clock className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                  <p>Schedule interviews at least 24 hours in advance</p>
                </div>
                <div className="flex gap-2">
                  <Video className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                  <p>For video interviews, test the meeting link before sharing</p>
                </div>
                <div className="flex gap-2">
                  <User className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                  <p>Candidates will receive an email notification automatically</p>
                </div>
                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                  <p>Include clear location details for in-person interviews</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600"
                  disabled={loading || !formData.applicationId}
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

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/recruitment-portal/interviews")}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}