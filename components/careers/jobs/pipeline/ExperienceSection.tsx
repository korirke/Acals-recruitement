"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Checkbox } from "@/components/careers/ui/checkbox";
import { Briefcase, Plus, Trash2, Building2, Calendar, CheckCircle2 } from "lucide-react";

interface Props {
  data: any[];
  onChange: (data: any[]) => void;
  existingExperience: any[];
}

export default function ExperienceSection({ data, onChange, existingExperience }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [currentExp, setCurrentExp] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  const handleAdd = () => {
    if (!currentExp.title || !currentExp.company || !currentExp.startDate) {
      return;
    }

    onChange([...data, { ...currentExp }]);
    setCurrentExp({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
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
              <Briefcase className="h-5 w-5 text-primary-500" />
              Work Experience <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Add your relevant work history
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            type="button"
            variant={showForm ? "outline" : "default"}
            size="sm"
          >
            {showForm ? "Cancel" : <><Plus className="h-4 w-4 mr-2" />Add</>}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Existing Experience */}
        {existingExperience.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Already in your profile
              </Label>
            </div>
            <div className="space-y-2">
              {existingExperience.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <p className="font-semibold text-neutral-900 dark:text-white">{exp.title}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{exp.company}</p>
                </div>
              ))}
              {existingExperience.length > 3 && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                  +{existingExperience.length - 3} more
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
              {data.map((exp, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-900 dark:text-green-200">{exp.title}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">{exp.company}</p>
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
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  value={currentExp.title}
                  onChange={(e) => setCurrentExp({ ...currentExp, title: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Company <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  value={currentExp.company}
                  onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
                  placeholder="e.g. Tech Corp"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={currentExp.startDate}
                    onChange={(e) => setCurrentExp({ ...currentExp, startDate: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={currentExp.endDate}
                    onChange={(e) => setCurrentExp({ ...currentExp, endDate: e.target.value })}
                    disabled={currentExp.isCurrent}
                    className="pl-10 h-11 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <Checkbox
                checked={currentExp.isCurrent}
                onCheckedChange={(checked) =>
                  setCurrentExp({
                    ...currentExp,
                    isCurrent: !!checked,
                    endDate: checked ? "" : currentExp.endDate,
                  })
                }
              />
              <Label className="text-sm cursor-pointer">I currently work here</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd} type="button" className="flex-1">
                Add Experience
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

        {/* Validation */}
        {data.length === 0 && existingExperience.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Briefcase className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              At least 1 work experience is required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
