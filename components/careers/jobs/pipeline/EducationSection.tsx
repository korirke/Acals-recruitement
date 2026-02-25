"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Checkbox } from "@/components/careers/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import {
  GraduationCap,
  Plus,
  Trash2,
  Building2,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface Props {
  data: any[];
  onChange: (data: any[]) => void;
  existingEducation: any[];
}

const QUALIFICATION_LEVELS = [
  { value: "CERTIFICATE", label: "Certificate" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "BACHELORS", label: "Bachelor's Degree" },
  { value: "MASTERS", label: "Master's Degree" },
  { value: "PHD", label: "Doctor of Philosophy (PhD)" },
  { value: "OTHER", label: "Other" },
];

const getQualLabel = (value: string) =>
  QUALIFICATION_LEVELS.find((q) => q.value === value)?.label || value;

export default function EducationSection({ data, onChange, existingEducation }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [currentEdu, setCurrentEdu] = useState({
    degree: "",          // stores the qualification level VALUE (e.g. "BACHELORS")
    fieldOfStudy: "",
    institution: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    grade: "",
  });

  const handleAdd = () => {
    if (
      !currentEdu.degree ||
      !currentEdu.institution ||
      !currentEdu.fieldOfStudy ||
      !currentEdu.startDate
    ) {
      return;
    }

    onChange([...data, { ...currentEdu }]);
    setCurrentEdu({
      degree: "",
      fieldOfStudy: "",
      institution: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      grade: "",
    });
    setShowForm(false);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary-500" />
              Education <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Add your educational qualifications
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            type="button"
            variant={showForm ? "outline" : "default"}
            size="sm"
          >
            {showForm ? (
              "Cancel"
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Existing Education */}
        {existingEducation.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Already in your profile
              </Label>
            </div>
            <div className="space-y-2">
              {existingEducation.slice(0, 2).map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                    {getQualLabel(edu.degree) || edu.degree}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                    {edu.fieldOfStudy}
                  </p>
                </div>
              ))}
              {existingEducation.length > 2 && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                  +{existingEducation.length - 2} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* New Entries */}
        {data.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-green-700 dark:text-green-300">
              Adding now
            </Label>
            <div className="space-y-2">
              {data.map((edu, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-900 dark:text-green-200 text-sm">
                      {getQualLabel(edu.degree)}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {edu.institution}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                      {edu.fieldOfStudy}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRemove(index)}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="space-y-4 p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">

            {/* Qualification Level — DROPDOWN */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                Qualification Level <span className="text-red-500">*</span>
              </Label>
              <Select
                value={currentEdu.degree}
                onValueChange={(value) =>
                  setCurrentEdu({ ...currentEdu, degree: value })
                }
              >
                <SelectTrigger className="h-11 bg-white dark:bg-neutral-900">
                  <SelectValue placeholder="Select qualification level..." />
                </SelectTrigger>
                <SelectContent>
                  {QUALIFICATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field of Study */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                Field of Study <span className="text-red-500">*</span>
              </Label>
              <Input
                value={currentEdu.fieldOfStudy}
                onChange={(e) =>
                  setCurrentEdu({ ...currentEdu, fieldOfStudy: e.target.value })
                }
                placeholder="e.g. Computer Science, Business Administration"
                className="h-11"
              />
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                Institution / School <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={currentEdu.institution}
                  onChange={(e) =>
                    setCurrentEdu({ ...currentEdu, institution: e.target.value })
                  }
                  placeholder="e.g. University of Nairobi"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Grade (optional) */}
            {/* <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                Grade / GPA{" "}
                <span className="text-xs font-normal text-neutral-500">(Optional)</span>
              </Label>
              <Input
                value={currentEdu.grade}
                onChange={(e) =>
                  setCurrentEdu({ ...currentEdu, grade: e.target.value })
                }
                placeholder="e.g. First Class Honours, 3.8 GPA, Upper Second"
                className="h-11"
              />
            </div> */}

            {/* Start + End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={currentEdu.startDate}
                    onChange={(e) =>
                      setCurrentEdu({ ...currentEdu, startDate: e.target.value })
                    }
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-900 dark:text-white">
                  End Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={currentEdu.endDate}
                    onChange={(e) =>
                      setCurrentEdu({ ...currentEdu, endDate: e.target.value })
                    }
                    disabled={currentEdu.isCurrent}
                    className="pl-10 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Currently Studying */}
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <Checkbox
                id="eduIsCurrent"
                checked={currentEdu.isCurrent}
                onCheckedChange={(checked) =>
                  setCurrentEdu({
                    ...currentEdu,
                    isCurrent: !!checked,
                    endDate: checked ? "" : currentEdu.endDate,
                  })
                }
              />
              <Label htmlFor="eduIsCurrent" className="text-sm cursor-pointer">
                I am currently studying here
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleAdd}
                type="button"
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
              >
                Add Education
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                type="button"
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Validation Message */}
        {data.length === 0 && existingEducation.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <GraduationCap className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              At least 1 education entry is required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
