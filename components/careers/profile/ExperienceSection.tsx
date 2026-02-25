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
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";
import { candidateService } from "@/services/recruitment-services";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Loader2,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import type { CandidateProfile, Experience } from "@/types";

interface ExperienceSectionProps {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Apprenticeship",
  "Temporary",
  "Volunteer",
  "Self-employed",
];

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
};

const formatDateForInput = (dateString: string | undefined) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const calculateDuration = (
  startDate: string,
  endDate: string | undefined,
  isCurrent: boolean,
) => {
  try {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate!);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years} yr ${remainingMonths} mo`;
    } else if (years > 0) {
      return `${years} yr`;
    } else {
      return `${remainingMonths} mo`;
    }
  } catch {
    return "";
  }
};

export default function ExperienceSection({
  profile,
  onUpdate,
}: ExperienceSectionProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    employmentType: "Full-time",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      employmentType: "Full-time",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id);
    setFormData({
      title: experience.title,
      company: experience.company,
      location: experience.location || "",
      employmentType: experience.employmentType || "Full-time",
      startDate: formatDateForInput(experience.startDate),
      endDate: formatDateForInput(experience.endDate),
      isCurrent: experience.isCurrent,
      description: experience.description || "",
    });
    setIsAdding(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Job title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.company?.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.startDate) {
      toast({
        title: "Validation Error",
        description: "Start date is required",
        variant: "destructive",
      });
      return;
    }

    // Validate end date if not current
    if (!formData.isCurrent && !formData.endDate) {
      toast({
        title: "Validation Error",
        description:
          "Please provide an end date or check 'I currently work here'",
        variant: "destructive",
      });
      return;
    }

    // Validate date order
    if (formData.endDate && formData.startDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        toast({
          title: "Validation Error",
          description: "End date cannot be before start date",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsLoading(true);

      // Prepare data for API
      const submitData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location?.trim() || undefined,
        employmentType: formData.employmentType?.trim() || undefined,
        startDate: formData.startDate,
        endDate: formData.isCurrent ? undefined : formData.endDate,
        isCurrent: formData.isCurrent,
        description: formData.description?.trim() || undefined,
      };

      if (editingId) {
        await candidateService.updateExperience(editingId, submitData);
        toast({
          title: "Success",
          description: "Experience updated successfully",
        });
      } else {
        await candidateService.addExperience(submitData);
        toast({
          title: "Success",
          description: "Experience added successfully",
        });
      }

      resetForm();
      onUpdate();
    } catch (error: any) {
      console.error("Experience submit error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to save experience",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (experienceId: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      setIsLoading(true);
      await candidateService.deleteExperience(experienceId);
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete experience",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-orange-500" />
              Work Experience
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400 mt-1">
              Your professional work history
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              if (isAdding) {
                resetForm();
              } else {
                setIsAdding(true);
              }
            }}
            variant={isAdding ? "outline" : "default"}
            size="sm"
            className={
              isAdding
                ? "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                : "bg-primary-500 hover:bg-primary-600 text-white"
            }
          >
            {isAdding ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <Card className="bg-neutral-50 dark:bg-neutral-800/50 border-2 border-dashed border-neutral-300 dark:border-neutral-700 shadow-inner">
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Senior Frontend Developer"
                    maxLength={100}
                    className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Company <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="e.g., TechCorp Inc."
                    maxLength={100}
                    className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Location
                  </Label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., San Francisco, CA"
                    maxLength={100}
                    className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Employment Type
                  </Label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentType: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    End Date{" "}
                    {!formData.isCurrent && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    disabled={formData.isCurrent}
                    className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <Checkbox
                  id="isCurrentExp"
                  checked={formData.isCurrent}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      isCurrent: checked as boolean,
                      endDate: "",
                    })
                  }
                  className="border-green-400 dark:border-green-600"
                />
                <Label
                  htmlFor="isCurrentExp"
                  className="text-sm font-medium text-green-900 dark:text-green-200 cursor-pointer"
                >
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-900 dark:text-white font-medium">
                  Description
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  maxLength={5000}
                  className="min-h-[120px] bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-right">
                  {formData.description.length} / 5000 characters
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Experience
                  </>
                ) : (
                  "Add Experience"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Experience List */}
        {profile?.experiences && profile.experiences.length > 0 ? (
          <div className="space-y-4">
            {profile.experiences.map((experience) => (
              <Card
                key={experience.id}
                className="hover:shadow-md transition-all duration-200 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 group"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0">
                        <Briefcase className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-lg text-neutral-900 dark:text-white">
                            {experience.title}
                          </h4>
                          {experience.isCurrent && (
                            <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-orange-600 dark:text-orange-400 font-semibold">
                          {experience.company}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                          {experience.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{experience.location}</span>
                            </div>
                          )}
                          {experience.employmentType && (
                            <>
                              <span>•</span>
                              <span className="font-medium">
                                {experience.employmentType}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {formatDate(experience.startDate)} -{" "}
                              {experience.isCurrent ? (
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  Present
                                </span>
                              ) : (
                                formatDate(experience.endDate!)
                              )}
                            </span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              {calculateDuration(
                                experience.startDate,
                                experience.endDate,
                                experience.isCurrent,
                              )}
                            </span>
                          </div>
                        </div>

                        {experience.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 whitespace-pre-line leading-relaxed">
                            {experience.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => handleEdit(experience)}
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        className="hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(experience.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No experience added yet</p>
            <p className="text-sm mt-1">
              Click "Add Experience" to showcase your work history
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
