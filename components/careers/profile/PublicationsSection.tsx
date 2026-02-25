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
import type { CandidateProfile, CandidatePublication } from "@/types";
import {
  Plus,
  X,
  Loader2,
  Save,
  Trash2,
  Edit2,
  BookOpen,
  Link as LinkIcon,
} from "lucide-react";

const PUB_TYPES = [
  "Journal",
  "Book",
  "Book Chapter",
  "Policy Paper",
  "Other",
] as const;

export default function PublicationsSection({
  profile,
  onUpdate,
}: {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}) {
  const { toast } = useToast();

  const publications: CandidatePublication[] =
    (profile as any)?.publications || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    type: "Journal",
    journalOrPublisher: "",
    year: "",
    link: "",
  });

  const reset = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm({
      title: "",
      type: "Journal",
      journalOrPublisher: "",
      year: "",
      link: "",
    });
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setIsAdding(true);
    setForm({
      title: p.title || "",
      type: p.type || "Journal",
      journalOrPublisher: p.journalOrPublisher || "",
      year: String(p.year || ""),
      link: p.link || "",
    });
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.year || isNaN(Number(form.year))) return "Year is required";
    const y = Number(form.year);
    if (y < 1900 || y > new Date().getFullYear() + 1)
      return "Year looks invalid";
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) {
      toast({
        title: "Validation Error",
        description: err,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        title: form.title.trim(),
        type: form.type,
        journalOrPublisher: form.journalOrPublisher.trim() || undefined,
        year: Number(form.year),
        link: form.link.trim() || undefined,
      };

      if (editingId) {
        await candidateService.updatePublication(editingId, payload);
        toast({
          title: "Updated",
          description: "Publication updated successfully",
        });
      } else {
        await candidateService.addPublication(payload);
        toast({
          title: "Added",
          description: "Publication added successfully",
        });
      }

      reset();
      onUpdate();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to save publication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this publication?")) return;
    try {
      setIsLoading(true);
      await candidateService.deletePublication(id);
      toast({ title: "Deleted", description: "Publication deleted" });
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
              <BookOpen className="h-5 w-5 text-primary-500" />
              Publications
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Add research outputs (journals, books, book chapters). Some jobs
              require minimum publications.
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
                <Plus className="h-4 w-4 mr-2" /> Add Publication
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
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Economic Growth Dynamics in Kenya"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    className="w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {PUB_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Year *</Label>
                  <Input
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="e.g. 2022"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Journal / Publisher (optional)</Label>
                <Input
                  value={form.journalOrPublisher}
                  onChange={(e) =>
                    setForm({ ...form, journalOrPublisher: e.target.value })
                  }
                  placeholder="e.g. African Economic Review"
                />
              </div>

              <div className="space-y-2">
                <Label>Link (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="https://..."
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      form.link && window.open(form.link, "_blank")
                    }
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
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
                    {editingId ? "Update Publication" : "Add Publication"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {publications.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No publications added yet</p>
            <p className="text-sm mt-1">
              Add your journals/books/book chapters here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {publications.map((p: any) => (
              <Card
                key={p.id}
                className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">
                        {p.title}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {p.type} • {p.year}
                        {p.journalOrPublisher
                          ? ` • ${p.journalOrPublisher}`
                          : ""}
                      </p>
                      {p.link && (
                        <p className="text-sm text-primary-600 dark:text-primary-400 mt-2 truncate">
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {p.link}
                          </a>
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLoading}
                        onClick={() => handleEdit(p)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        disabled={isLoading}
                        onClick={() => del(p.id)}
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
