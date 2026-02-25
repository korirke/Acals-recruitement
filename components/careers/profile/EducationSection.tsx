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
  GraduationCap,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";
import type { CandidateProfile, Education, DegreeLevel } from "@/types";

interface EducationSectionProps {
  profile: CandidateProfile | null;
  onUpdate: () => void;
  showGrade?: boolean;
}

const DEGREE_LEVELS: { value: DegreeLevel; label: string }[] = [
  { value: "CERTIFICATE", label: "Certificate" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "BACHELORS", label: "Bachelors" },
  { value: "MASTERS", label: "Masters" },
  { value: "PHD", label: "PhD" },
  { value: "OTHER", label: "Other" },
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

export default function EducationSection({
  profile,
  onUpdate,
  showGrade = true,
}: EducationSectionProps) {
  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    degreeLevel: "" as "" | DegreeLevel,
    degree: "",
    fieldOfStudy: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    grade: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      degreeLevel: "",
      degree: "",
      fieldOfStudy: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      grade: "",
      description: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    setFormData({
      degreeLevel: (education.degreeLevel as DegreeLevel) || "",
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      institution: education.institution,
      location: education.location || "",
      startDate: formatDateForInput(education.startDate),
      endDate: formatDateForInput(education.endDate),
      isCurrent: education.isCurrent,
      grade: education.grade || "",
      description: education.description || "",
    });
    setIsAdding(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.degreeLevel) {
      toast({
        title: "Validation Error",
        description: "Level is required",
        variant: "destructive",
      });
      return;
    }
    if (!formData.degree?.trim()) {
      toast({
        title: "Validation Error",
        description: "name is required",
        variant: "destructive",
      });
      return;
    }
    if (!formData.fieldOfStudy?.trim()) {
      toast({
        title: "Validation Error",
        description: "Field of Study is required",
        variant: "destructive",
      });
      return;
    }
    if (!formData.institution?.trim()) {
      toast({
        title: "Validation Error",
        description: "Institution is required",
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
    if (!formData.isCurrent && !formData.endDate) {
      toast({
        title: "Validation Error",
        description:
          "Please provide an end date or check 'I am currently studying here'",
        variant: "destructive",
      });
      return;
    }
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

      const submitData: any = {
        degreeLevel: formData.degreeLevel,
        degree: formData.degree.trim(),
        fieldOfStudy: formData.fieldOfStudy.trim(),
        institution: formData.institution.trim(),
        location: formData.location?.trim() || undefined,
        startDate: formData.startDate,
        endDate: formData.isCurrent ? undefined : formData.endDate,
        isCurrent: formData.isCurrent,
        description: formData.description?.trim() || undefined,
      };

      // only send grade if it is enabled by settings
      if (showGrade) {
        submitData.grade = formData.grade?.trim() || undefined;
      }

      if (editingId) {
        await candidateService.updateEducation(editingId, submitData);
        toast({
          title: "Success",
          description: "Education updated successfully",
        });
      } else {
        await candidateService.addEducation(submitData);
        toast({
          title: "Success",
          description: "Education added successfully",
        });
      }

      resetForm();
      onUpdate();
    } catch (error: any) {
      console.error("Education submit error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to save education",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (educationId: string) => {
    if (!confirm("Are you sure you want to delete this education?")) return;

    try {
      setIsLoading(true);
      await candidateService.deleteEducation(educationId);
      toast({
        title: "Success",
        description: "Education deleted successfully",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete education",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const degreeLevelLabel = (level?: string | null) => {
    if (!level) return null;
    const found = DEGREE_LEVELS.find((x) => x.value === level);
    return found?.label || level;
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary-500" />
              Education
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400 mt-1">
              Your academic background and qualifications
            </CardDescription>
          </div>

          <Button
            onClick={() => {
              if (isAdding) resetForm();
              else setIsAdding(true);
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
                Add Education
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
                {/* level dropdown */}
                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Level <span className="text-red-500">*</span>
                  </Label>
                  <select
                    value={formData.degreeLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        degreeLevel: e.target.value as DegreeLevel,
                      })
                    }
                    className="w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white px-3"
                  >
                    <option value="" disabled>
                      Select level...
                    </option>
                    {DEGREE_LEVELS.map((lvl) => (
                      <option key={lvl.value} value={lvl.value}>
                        {lvl.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.degree}
                    onChange={(e) =>
                      setFormData({ ...formData, degree: e.target.value })
                    }
                    placeholder="e.g., Bachelor of Science"
                    maxLength={100}
                    className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Field of Study <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.fieldOfStudy}
                    onChange={(e) =>
                      setFormData({ ...formData, fieldOfStudy: e.target.value })
                    }
                    placeholder="e.g., Computer Science"
                    maxLength={100}
                    className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Institution <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData({ ...formData, institution: e.target.value })
                    }
                    placeholder="e.g., University of Nairobi"
                    maxLength={200}
                    className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div className={`grid md:grid-cols-2 gap-4`}>
                <div className="space-y-2">
                  <Label className="text-neutral-900 dark:text-white font-medium">
                    Location
                  </Label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Nairobi"
                    maxLength={100}
                    className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                  />
                </div>

                {/* ✅ Grade only when enabled */}
                {showGrade && (
                  <div className="space-y-2">
                    <Label className="text-neutral-900 dark:text-white font-medium">
                      Grade/GPA
                    </Label>
                    <Input
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      placeholder="e.g., First Class / 3.8"
                      maxLength={50}
                      className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                    />
                  </div>
                )}
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
                  id="isCurrent"
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
                  htmlFor="isCurrent"
                  className="text-sm font-medium text-green-900 dark:text-green-200 cursor-pointer"
                >
                  I am currently studying here
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
                  placeholder="Relevant coursework, achievements, activities..."
                  maxLength={2000}
                  className="min-h-20 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-right">
                  {formData.description.length} / 2000 characters
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
                    Update Education
                  </>
                ) : (
                  "Add Education"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Education List */}
        {profile?.educations && profile.educations.length > 0 ? (
          <div className="space-y-4">
            {profile.educations.map((education) => (
              <Card
                key={education.id}
                className="hover:shadow-md transition-all duration-200 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 group"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg shrink-0">
                        <GraduationCap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-lg text-neutral-900 dark:text-white">
                            {education.degree}
                          </h4>

                          {education.degreeLevel && (
                            <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                              {degreeLevelLabel(education.degreeLevel)}
                            </span>
                          )}
                        </div>

                        <p className="text-primary-600 dark:text-primary-400 font-medium mt-1">
                          {education.fieldOfStudy}
                        </p>

                        <p className="text-neutral-700 dark:text-neutral-300 mt-1 font-medium">
                          {education.institution}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                          {education.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{education.location}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {formatDate(education.startDate)} -{" "}
                              {education.isCurrent ? (
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  Present
                                </span>
                              ) : (
                                formatDate(education.endDate!)
                              )}
                            </span>
                          </div>

                          {/* ✅ Grade display only when enabled */}
                          {showGrade && education.grade && (
                            <div className="flex items-center gap-1">
                              <Award className="h-3.5 w-3.5" />
                              <span className="font-medium">
                                Grade: {education.grade}
                              </span>
                            </div>
                          )}
                        </div>

                        {education.description && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
                            {education.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => handleEdit(education)}
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        className="hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => handleDelete(education.id)}
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
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No education added yet</p>
            <p className="text-sm mt-1">
              Click "Add Education" to showcase your academic background
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
