"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Badge } from "@/components/careers/ui/badge";
import { Award, Plus, X, Loader2, CheckCircle2 } from "lucide-react";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";

// Normalized internal shape
interface SkillItem {
  id: string;       // junction table id (candidate_skills.id) — used as React key
  skillId: string;  // skills table id — passed to removeSkill()
  name: string;
  level?: string | null;
  yearsOfExp?: number | null;
}

interface SkillInput {
  id?: string;
  skillId?: string;
  name?: string;
  skill?: { id: string; name: string };
  level?: string | null;
  yearsOfExp?: number | null;
}

interface Props {
  /** Items from the profile snapshot (already in DB) */
  initialSkills?: SkillInput[];
  /** Optional callback so parent can track count for validation */
  onCountChange?: (count: number) => void;
}

function normalize(raw: SkillInput): SkillItem {
  return {
    id: raw.id ?? raw.skillId ?? Math.random().toString(36).slice(2),
    skillId: raw.skillId ?? raw.skill?.id ?? "",
    name: raw.name ?? raw.skill?.name ?? "",
    level: raw.level,
    yearsOfExp: raw.yearsOfExp,
  };
}

export default function SkillsSection({ initialSkills = [], onCountChange }: Props) {
  const { showToast } = useToast();

  const [items, setItems] = useState<SkillItem[]>(() => initialSkills.map(normalize));
  const [skillName, setSkillName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null); // skillId being deleted

  const reportCount = (list: SkillItem[]) => onCountChange?.(list.length);

  // ── Add ──
  const handleAdd = async () => {
    const name = skillName.trim();
    if (!name) return;

    // Prevent duplicates (client-side guard)
    if (items.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      showToast({ type: "error", title: "Duplicate", message: "This skill is already in your profile" });
      return;
    }

    setSaving(true);
    try {
      const res = await candidateService.addSkill({ skillName: name });
      if (res.success && res.data) {
        const newItem: SkillItem = {
          id: res.data.id,
          skillId: res.data.skillId ?? res.data.skill?.id ?? "",
          name: res.data.skill?.name ?? name,
          level: res.data.level ?? null,
          yearsOfExp: res.data.yearsOfExp ?? null,
        };
        const next = [...items, newItem];
        setItems(next);
        setSkillName("");
        reportCount(next);
        showToast({ type: "success", title: "Saved", message: `"${name}" added to your profile` });
      } else {
        showToast({ type: "error", title: "Save failed", message: res.message || "Could not save skill" });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Error", message: err.message || "Failed to save skill" });
    } finally {
      setSaving(false);
    }
  };

  // ── Remove 
  const handleRemove = async (skillId: string) => {
    if (!skillId) return;
    setDeleting(skillId);
    try {
      const res = await candidateService.removeSkill(skillId);
      if (res.success !== false) {
        const next = items.filter((s) => s.skillId !== skillId);
        setItems(next);
        reportCount(next);
      } else {
        showToast({ type: "error", title: "Error", message: res.message || "Could not remove skill" });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Error", message: err.message || "Failed to remove skill" });
    } finally {
      setDeleting(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleAdd(); }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-primary-500" />
          Skills <span className="text-red-500">*</span>
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Add at least 1 skill relevant to this position — saved instantly to your profile
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Add input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-neutral-900 dark:text-white">Add Skill</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Type a skill and press Enter or Add"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-11"
              disabled={saving}
            />
            <Button
              onClick={handleAdd}
              type="button"
              size="lg"
              disabled={saving || !skillName.trim()}
              className="bg-primary-500 hover:bg-primary-600 text-white shrink-0"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" />Add</>}
            </Button>
          </div>
        </div>

        {/* Skills list */}
        {items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Your skills ({items.length})
              </Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <Badge
                  key={skill.id}
                  className="px-3 py-1.5 bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 border border-primary-200 dark:border-primary-700 flex items-center gap-2 text-sm"
                >
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => handleRemove(skill.skillId)}
                    disabled={deleting === skill.skillId}
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-40"
                    aria-label={`Remove ${skill.name}`}
                  >
                    {deleting === skill.skillId
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <X className="h-3 w-3" />}
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Validation message */}
        {items.length === 0 && (
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