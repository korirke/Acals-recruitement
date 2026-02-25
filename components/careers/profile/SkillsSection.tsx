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
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import { candidateService } from "@/services/recruitment-services";
import { Plus, X, Loader2, Zap, Award } from "lucide-react";
import type { CandidateProfile } from "@/types";

interface SkillsSectionProps {
  profile: CandidateProfile | null;
  onUpdate: () => void;
  showLevel?: boolean;
  showYearsOfExp?: boolean;
}

export default function SkillsSection({
  profile,
  onUpdate,
  showLevel = true,
  showYearsOfExp = true,
}: SkillsSectionProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSkill, setNewSkill] = useState({
    skillName: "",
    level: "Intermediate",
    yearsOfExp: 0,
  });

  const handleAddSkill = async () => {
    if (!newSkill.skillName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a skill name",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Build payload based on configuration (so hidden fields are not sent)
      const payload: any = {
        skillName: newSkill.skillName.trim(),
      };
      if (showLevel) payload.level = newSkill.level;
      if (showYearsOfExp) payload.yearsOfExp = newSkill.yearsOfExp;

      await candidateService.addSkill(payload);

      toast({
        title: "Skill Added",
        description: "Your skill has been added successfully",
      });

      setNewSkill({ skillName: "", level: "Intermediate", yearsOfExp: 0 });
      setIsAdding(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add skill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      setIsLoading(true);
      await candidateService.removeSkill(skillId);
      toast({
        title: "Skill Removed",
        description: "Skill has been removed from your profile",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove skill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillLevelColor = (level?: string) => {
    switch (level) {
      case "Expert":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 border-green-300 dark:border-green-700";
      case "Advanced":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-300 dark:border-blue-700";
      case "Intermediate":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200 border-orange-300 dark:border-orange-700";
      case "Beginner":
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700";
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Skills
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400 mt-1">
              Your professional skills and expertise levels
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAdding(!isAdding)}
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
                Add Skill
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAdding && (
          <Card className="bg-neutral-50 dark:bg-neutral-800/50 border-2 border-dashed border-neutral-300 dark:border-neutral-700 shadow-inner">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="skillName"
                  className="text-neutral-900 dark:text-white font-medium"
                >
                  Skill Name
                </Label>
                <Input
                  id="skillName"
                  value={newSkill.skillName}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, skillName: e.target.value })
                  }
                  placeholder="e.g., React, Python, Project Management"
                  className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                />
              </div>

              {(showLevel || showYearsOfExp) && (
                <div
                  className={`grid gap-4 ${showLevel && showYearsOfExp ? "md:grid-cols-2" : "md:grid-cols-1"}`}
                >
                  {showLevel && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="level"
                        className="text-neutral-900 dark:text-white font-medium"
                      >
                        Proficiency Level
                      </Label>
                      <Select
                        value={newSkill.level}
                        onValueChange={(value) =>
                          setNewSkill({ ...newSkill, level: value })
                        }
                      >
                        <SelectTrigger className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700">
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {showYearsOfExp && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="yearsOfExp"
                        className="text-neutral-900 dark:text-white font-medium"
                      >
                        Years of Experience
                      </Label>
                      <Input
                        id="yearsOfExp"
                        type="number"
                        min="0"
                        max="50"
                        value={newSkill.yearsOfExp}
                        onChange={(e) =>
                          setNewSkill({
                            ...newSkill,
                            yearsOfExp: parseInt(e.target.value) || 0,
                          })
                        }
                        className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleAddSkill}
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Skill"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {profile?.skills && profile.skills.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {profile.skills.map((candidateSkill) => (
              <div
                key={candidateSkill.id}
                className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-900 dark:text-white truncate">
                    {candidateSkill.skill.name}
                  </h4>

                  {(showLevel || showYearsOfExp) && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {showLevel && (
                        <Badge
                          className={`${getSkillLevelColor(candidateSkill.level)} border`}
                        >
                          {candidateSkill.level || "Not specified"}
                        </Badge>
                      )}

                      {showYearsOfExp &&
                        candidateSkill.yearsOfExp !== undefined &&
                        candidateSkill.yearsOfExp > 0 && (
                          <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                            <Award className="h-3 w-3" />
                            <span>
                              {candidateSkill.yearsOfExp}{" "}
                              {candidateSkill.yearsOfExp === 1
                                ? "year"
                                : "years"}
                            </span>
                          </div>
                        )}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleRemoveSkill(candidateSkill.skill.id)}
                  variant="ghost"
                  size="icon"
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No skills added yet</p>
            <p className="text-sm mt-1">
              Click "Add Skill" to showcase your expertise
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
