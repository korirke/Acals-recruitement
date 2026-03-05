"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Checkbox } from "@/components/careers/ui/checkbox";
import { Award, Plus, Trash2, Hash, Loader2, CheckCircle2 } from "lucide-react";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";

interface MemItem {
  id: string;
  bodyName: string;
  membershipNumber?: string | null;
  isActive: boolean;
  goodStanding: boolean;
}

interface Props {
  initialMemberships?: MemItem[];
  onCountChange?: (count: number) => void;
}

export default function MembershipsSection({
  initialMemberships = [],
  onCountChange,
}: Props) {
  const { showToast } = useToast();

  const [items, setItems] = useState<MemItem[]>(initialMemberships);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [form, setForm] = useState({
    bodyName: "",
    membershipNumber: "",
    isActive: true,
    goodStanding: true,
  });

  const reportCount = (list: MemItem[]) => onCountChange?.(list.length);
  const resetForm = () =>
    setForm({
      bodyName: "",
      membershipNumber: "",
      isActive: true,
      goodStanding: true,
    });

  const handleAdd = async () => {
    if (!form.bodyName.trim() || !form.membershipNumber.trim()) {
      showToast({
        type: "error",
        title: "Required",
        message: "Professional body name and membership number are required",
      });
      return;
    }
    setSaving(true);
    try {
      const res = await candidateService.addMembership({
        bodyName: form.bodyName.trim(),
        membershipNumber: form.membershipNumber.trim() || null,
        isActive: form.isActive,
        goodStanding: form.goodStanding,
      });
      if (res.success && res.data) {
        const next = [...items, res.data as MemItem];
        setItems(next);
        resetForm();
        setShowForm(false);
        reportCount(next);
        showToast({
          type: "success",
          title: "Saved",
          message: "Membership saved to your profile",
        });
      } else {
        showToast({
          type: "error",
          title: "Save failed",
          message: res.message || "Could not save membership",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to save membership",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    setDeleting(id);
    try {
      const res = await candidateService.deleteMembership(id);
      if (res.success !== false) {
        const next = items.filter((m) => m.id !== id);
        setItems(next);
        reportCount(next);
      } else {
        showToast({
          type: "error",
          title: "Error",
          message: res.message || "Could not remove membership",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to remove membership",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-primary-500" />
              Professional Memberships <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Memberships to recognized professional bodies — saved instantly
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
        {/* List */}
        {items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {items.length} membership{items.length !== 1 ? "s" : ""} in your
                profile
              </Label>
            </div>
            <div className="space-y-2">
              {items.map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                      {mem.bodyName}
                    </p>
                    {mem.membershipNumber && (
                      <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                        <Hash className="h-3 w-3" /> {mem.membershipNumber}
                      </p>
                    )}
                    <div className="flex gap-2 mt-1.5">
                      {mem.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      {mem.goodStanding && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          Good Standing
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemove(mem.id)}
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={deleting === mem.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    {deleting === mem.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="space-y-4 p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Professional Body Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.bodyName}
                onChange={(e) => setForm({ ...form, bodyName: e.target.value })}
                placeholder="e.g. Institute of Engineers of Kenya (IEK)"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Membership Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={form.membershipNumber}
                  onChange={(e) =>
                    setForm({ ...form, membershipNumber: e.target.value })
                  }
                  placeholder="e.g. IEK-12345"
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <Checkbox
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: !!v })}
                />
                <Label className="text-sm cursor-pointer">Active Member</Label>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <Checkbox
                  checked={form.goodStanding}
                  onCheckedChange={(v) =>
                    setForm({ ...form, goodStanding: !!v })
                  }
                />
                <Label className="text-sm cursor-pointer">Good Standing</Label>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleAdd}
                type="button"
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Add Membership"
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                type="button"
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Award className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              At least 1 professional membership is required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
