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
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";
import { candidateService } from "@/services/recruitment-services";
import type { CandidateProfile, CandidateMembership } from "@/types";
import {
  Plus,
  X,
  Loader2,
  Save,
  Trash2,
  Edit2,
  BadgeCheck,
} from "lucide-react";

export default function MembershipsSection({
  profile,
  onUpdate,
}: {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const memberships: CandidateMembership[] =
    (profile as any)?.memberships || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    bodyName: "",
    membershipNumber: "",
    isActive: true,
    goodStanding: true,
  });

  const reset = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm({
      bodyName: "",
      membershipNumber: "",
      isActive: true,
      goodStanding: true,
    });
  };

  const edit = (m: any) => {
    setEditingId(m.id);
    setIsAdding(true);
    setForm({
      bodyName: m.bodyName || "",
      membershipNumber: m.membershipNumber || "",
      isActive: !!m.isActive,
      goodStanding: !!m.goodStanding,
    });
  };

  const submit = async () => {
    if (!form.bodyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Professional body name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        bodyName: form.bodyName.trim(),
        membershipNumber: form.membershipNumber.trim() || undefined,
        isActive: form.isActive,
        goodStanding: form.goodStanding,
      };

      if (editingId) {
        await candidateService.updateMembership(editingId, payload);
        toast({ title: "Updated", description: "Membership updated" });
      } else {
        await candidateService.addMembership(payload);
        toast({ title: "Added", description: "Membership added" });
      }

      reset();
      onUpdate();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to save",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this membership?")) return;
    try {
      setIsLoading(true);
      await candidateService.deleteMembership(id);
      toast({ title: "Deleted", description: "Membership deleted" });
      onUpdate();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to delete",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-orange-500" />
              Professional Memberships
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Add professional bodies and indicate good standing.
            </CardDescription>
          </div>

          <Button
            onClick={() => (isAdding ? reset() : setIsAdding(true))}
            variant={isAdding ? "outline" : "default"}
            size="sm"
            className={
              isAdding ? "" : "bg-primary-500 hover:bg-primary-600 text-white"
            }
          >
            {isAdding ? (
              <>
                <X className="h-4 w-4 mr-2" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" /> Add Membership
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAdding && (
          <Card className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Professional Body Name *</Label>
                <Input
                  value={form.bodyName}
                  onChange={(e) =>
                    setForm({ ...form, bodyName: e.target.value })
                  }
                  placeholder="e.g. Economic Society of Kenya"
                />
              </div>

              <div className="space-y-2">
                <Label>Membership Number (optional)</Label>
                <Input
                  value={form.membershipNumber}
                  onChange={(e) =>
                    setForm({ ...form, membershipNumber: e.target.value })
                  }
                  placeholder="e.g. ESK-12345"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <Checkbox
                    id="isActiveMem"
                    checked={form.isActive}
                    onCheckedChange={(v) => setForm({ ...form, isActive: !!v })}
                  />
                  <Label htmlFor="isActiveMem">Active membership</Label>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <Checkbox
                    id="goodStanding"
                    checked={form.goodStanding}
                    onCheckedChange={(v) =>
                      setForm({ ...form, goodStanding: !!v })
                    }
                  />
                  <Label htmlFor="goodStanding">In good standing</Label>
                </div>
              </div>

              <Button
                onClick={submit}
                disabled={isLoading}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />{" "}
                    {editingId ? "Update Membership" : "Add Membership"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {memberships.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            <BadgeCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No memberships added yet</p>
            <p className="text-sm mt-1">
              Add your professional bodies and good standing.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {memberships.map((m: any) => (
              <Card
                key={m.id}
                className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">
                        {m.bodyName}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {m.membershipNumber
                          ? `No: ${m.membershipNumber} • `
                          : ""}
                        {m.isActive ? "Active" : "Inactive"} •{" "}
                        {m.goodStanding
                          ? "Good Standing"
                          : "Not in Good Standing"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        onClick={() => edit(m)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        disabled={isLoading}
                        onClick={() => del(m.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
