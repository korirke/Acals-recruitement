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
import { useToast } from "../ui/use-toast";
import { candidateService } from "@/services/recruitment-services";
import type { CandidateProfile, CandidateClearance } from "@/types";
import {
  Plus,
  X,
  Loader2,
  Save,
  Trash2,
  Edit2,
  ShieldCheck,
} from "lucide-react";

const CLEARANCE_TYPES = ["Tax", "HELB", "DCI", "CRB", "EACC", "Other"] as const;
const STATUSES = ["VALID", "EXPIRED", "PENDING"] as const;

export default function ClearancesSection({
  profile,
  onUpdate,
}: {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const clearances: CandidateClearance[] = (profile as any)?.clearances || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    type: "Tax",
    certificateNumber: "",
    issueDate: "",
    expiryDate: "",
    status: "PENDING",
  });

  const reset = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm({
      type: "Tax",
      certificateNumber: "",
      issueDate: "",
      expiryDate: "",
      status: "PENDING",
    });
  };

  const edit = (c: any) => {
    setEditingId(c.id);
    setIsAdding(true);
    setForm({
      type: c.type || "Tax",
      certificateNumber: c.certificateNumber || "",
      issueDate: (c.issueDate || "").slice(0, 10),
      expiryDate: (c.expiryDate || "").slice(0, 10),
      status: c.status || "PENDING",
    });
  };

  const submit = async () => {
    if (!form.type) {
      toast({
        title: "Validation Error",
        description: "Type is required",
        variant: "destructive",
      });
      return;
    }
    if (!form.issueDate) {
      toast({
        title: "Validation Error",
        description: "Issue date is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        type: form.type,
        certificateNumber: form.certificateNumber.trim() || undefined,
        issueDate: form.issueDate,
        expiryDate: form.expiryDate ? form.expiryDate : undefined,
        status: form.status,
      };

      if (editingId) {
        await candidateService.updateClearance(editingId, payload);
        toast({ title: "Updated", description: "Clearance updated" });
      } else {
        await candidateService.addClearance(payload);
        toast({ title: "Added", description: "Clearance added" });
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
    if (!confirm("Delete this clearance?")) return;
    try {
      setIsLoading(true);
      await candidateService.deleteClearance(id);
      toast({ title: "Deleted", description: "Clearance deleted" });
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

  const badge = (status?: string) => {
    if (status === "VALID")
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200";
    if (status === "EXPIRED")
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200";
    return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary-500" />
              Statutory Clearances
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Add Tax/HELB/DCI/CRB/EACC clearance details and statuses.
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
                <Plus className="h-4 w-4 mr-2" /> Add Clearance
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAdding && (
          <Card className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <select
                    className="w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {CLEARANCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Certificate Number (optional)</Label>
                <Input
                  value={form.certificateNumber}
                  onChange={(e) =>
                    setForm({ ...form, certificateNumber: e.target.value })
                  }
                  placeholder="e.g. KRA-123456"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issue Date *</Label>
                  <Input
                    type="date"
                    value={form.issueDate}
                    onChange={(e) =>
                      setForm({ ...form, issueDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date (optional)</Label>
                  <Input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) =>
                      setForm({ ...form, expiryDate: e.target.value })
                    }
                  />
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
                    {editingId ? "Update Clearance" : "Add Clearance"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {clearances.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            <ShieldCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No clearances added yet</p>
            <p className="text-sm mt-1">
              Add statutory clearances as required for government recruitment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {clearances.map((c: any) => (
              <Card
                key={c.id}
                className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {c.type}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${badge(c.status)}`}
                        >
                          {c.status}
                        </span>
                      </div>

                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {c.certificateNumber
                          ? `Cert#: ${c.certificateNumber} • `
                          : ""}
                        Issue: {String(c.issueDate || "").slice(0, 10)}
                        {c.expiryDate
                          ? ` • Exp: ${String(c.expiryDate).slice(0, 10)}`
                          : ""}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        onClick={() => edit(c)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        disabled={isLoading}
                        onClick={() => del(c.id)}
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
