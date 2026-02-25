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
import type { CandidateProfile, CandidateReferee } from "@/types";
import { Plus, X, Loader2, Save, Trash2, Edit2, Users } from "lucide-react";

export default function RefereesSection({
  profile,
  onUpdate,
}: {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const referees: CandidateReferee[] = (profile as any)?.referees || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    position: "",
    organization: "",
    phone: "",
    email: "",
  });

  const reset = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm({ name: "", position: "", organization: "", phone: "", email: "" });
  };

  const edit = (r: any) => {
    setEditingId(r.id);
    setIsAdding(true);
    setForm({
      name: r.name || "",
      position: r.position || "",
      organization: r.organization || "",
      phone: r.phone || "",
      email: r.email || "",
    });
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: form.name.trim(),
        position: form.position.trim() || undefined,
        organization: form.organization.trim() || undefined,
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
      };

      if (editingId) {
        await candidateService.updateReferee(editingId, payload);
        toast({ title: "Updated", description: "Referee updated" });
      } else {
        await candidateService.addReferee(payload);
        toast({ title: "Added", description: "Referee added" });
      }

      reset();
      onUpdate();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to save referee",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this referee?")) return;
    try {
      setIsLoading(true);
      await candidateService.deleteReferee(id);
      toast({ title: "Deleted", description: "Referee deleted" });
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
              <Users className="h-5 w-5 text-primary-500" />
              Referees
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Add professional referees.
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
                <Plus className="h-4 w-4 mr-2" /> Add Referee
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
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dr. Jane Doe"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Position (optional)</Label>
                  <Input
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                    placeholder="e.g. Director, Research"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organization (optional)</Label>
                  <Input
                    value={form.organization}
                    onChange={(e) =>
                      setForm({ ...form, organization: e.target.value })
                    }
                    placeholder="e.g. Ministry of ..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone (optional)</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+2547..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email (optional)</Label>
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="name@email.com"
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
                    {editingId ? "Update Referee" : "Add Referee"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {referees.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No referees added yet</p>
            <p className="text-sm mt-1">Add your referees here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referees.map((r: any) => (
              <Card
                key={r.id}
                className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">
                        {r.name}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {[r.position, r.organization]
                          .filter(Boolean)
                          .join(" • ") || "—"}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {[r.phone, r.email].filter(Boolean).join(" • ") || ""}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        onClick={() => edit(r)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        disabled={isLoading}
                        onClick={() => del(r.id)}
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
