"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Badge } from "@/components/careers/ui/badge";
import { Award, Plus, X, CheckCircle2 } from "lucide-react";

interface Props {
  data: any[];
  onChange: (data: any[]) => void;
  existingSkills: any[];
}

export default function SkillsSection({ data, onChange, existingSkills }: Props) {
  const [skillName, setSkillName] = useState("");

  const handleAdd = () => {
    if (!skillName.trim()) return;

    onChange([
      ...data,
      { skillName: skillName.trim(), level: "INTERMEDIATE", yearsOfExp: 0 },
    ]);

    setSkillName("");
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-primary-500" />
          Skills <span className="text-red-500">*</span>
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Add at least 1 skill relevant to this position
        </p>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Add New Skill */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-neutral-900 dark:text-white">
            Add Skills
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Type a skill and press Enter"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-11"
            />
            <Button 
              onClick={handleAdd} 
              type="button"
              size="lg"
              className="bg-primary-500 hover:bg-primary-600 text-white shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Existing Skills (Read-only) */}
        {existingSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Already in your profile
              </Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {existingSkills.map((skill) => (
                <Badge 
                  key={skill.id} 
                  variant="outline"
                  className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* New Skills Being Added */}
        {data.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-green-700 dark:text-green-300">
              Adding now
            </Label>
            <div className="flex flex-wrap gap-2">
              {data.map((skill, index) => (
                <Badge
                  key={index}
                  className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50 flex items-center gap-2"
                >
                  {skill.skillName}
                  <button
                    onClick={() => handleRemove(index)}
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Validation Message */}
        {data.length === 0 && existingSkills.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Award className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              At least 1 skill is required to submit this application
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
