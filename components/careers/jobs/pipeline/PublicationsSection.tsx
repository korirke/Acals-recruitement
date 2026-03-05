"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/careers/ui/select";
import { BookOpen, Plus, Trash2, Link as LinkIcon, Loader2, CheckCircle2 } from "lucide-react";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";

interface PubItem {
  id: string;
  title: string;
  type: string;
  journalOrPublisher?: string | null;
  year: number;
  link?: string | null;
}

interface Props {
  initialPublications?: PubItem[];
  onCountChange?: (count: number) => void;
}

export default function PublicationsSection({ initialPublications = [], onCountChange }: Props) {
  const { showToast } = useToast();

  const [items, setItems]   = useState<PubItem[]>(initialPublications);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "", type: "Journal", journalOrPublisher: "",
    year: new Date().getFullYear(), link: "",
  });

  const reportCount = (list: PubItem[]) => onCountChange?.(list.length);
  const resetForm   = () => setForm({ title: "", type: "Journal", journalOrPublisher: "", year: new Date().getFullYear(), link: "" });

  const handleAdd = async () => {
    if (!form.title.trim() || !form.year) {
      showToast({ type: "error", title: "Required", message: "Title and year are required" });
      return;
    }
    setSaving(true);
    try {
      const res = await candidateService.addPublication({
        title: form.title.trim(),
        type: form.type,
        journalOrPublisher: form.journalOrPublisher.trim() || null,
        year: Number(form.year),
        link: form.link.trim() || null,
      });
      if (res.success && res.data) {
        const next = [...items, res.data as PubItem];
        setItems(next);
        resetForm();
        setShowForm(false);
        reportCount(next);
        showToast({ type: "success", title: "Saved", message: "Publication saved to your profile" });
      } else {
        showToast({ type: "error", title: "Save failed", message: res.message || "Could not save publication" });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Error", message: err.message || "Failed to save publication" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    setDeleting(id);
    try {
      const res = await candidateService.deletePublication(id);
      if (res.success !== false) {
        const next = items.filter((p) => p.id !== id);
        setItems(next);
        reportCount(next);
      } else {
        showToast({ type: "error", title: "Error", message: res.message || "Could not remove publication" });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Error", message: err.message || "Failed to remove publication" });
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
              <BookOpen className="h-5 w-5 text-primary-500" />
              Publications <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Research papers, journal articles, books, or conference papers — saved instantly
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} type="button" variant={showForm ? "outline" : "default"} size="sm">
            {showForm ? "Cancel" : <><Plus className="h-4 w-4 mr-2" />Add</>}
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
                {items.length} publication{items.length !== 1 ? "s" : ""} in your profile
              </Label>
            </div>
            <div className="space-y-2">
              {items.map((pub) => (
                <div key={pub.id} className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">{pub.title}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {pub.type} · {pub.year}{pub.journalOrPublisher ? ` · ${pub.journalOrPublisher}` : ""}
                    </p>
                  </div>
                  <Button onClick={() => handleRemove(pub.id)} type="button" variant="ghost" size="icon" disabled={deleting === pub.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0">
                    {deleting === pub.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
              <Label className="text-sm font-medium">Publication Title <span className="text-red-500">*</span></Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Machine Learning Approaches in Healthcare" className="h-11" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Publication Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Journal Article","Conference Paper","Book","Book Chapter","Technical Report","Thesis / Dissertation"].map((t) => (
                      <SelectItem key={t} value={t.split(" ")[0]}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Year <span className="text-red-500">*</span></Label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} min={1950} max={new Date().getFullYear()} className="h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Journal / Publisher</Label>
              <Input value={form.journalOrPublisher} onChange={(e) => setForm({ ...form, journalOrPublisher: e.target.value })} placeholder="e.g. Nature, IEEE, Springer" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Link (Optional)</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://doi.org/..." className="pl-10 h-11" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={handleAdd} type="button" disabled={saving} className="flex-1">
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Add Publication"}
              </Button>
              <Button onClick={() => { setShowForm(false); resetForm(); }} type="button" variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <BookOpen className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">At least 1 publication is required for this position</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}