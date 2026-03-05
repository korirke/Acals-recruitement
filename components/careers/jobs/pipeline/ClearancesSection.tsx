"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/careers/ui/select";
import { Shield, Plus, Trash2, Calendar, Hash, Loader2, CheckCircle2 } from "lucide-react";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";

interface ClearanceItem {
  id: string;
  type: string;
  certificateNumber?: string | null;
  issueDate: string;
  expiryDate?: string | null;
  status: string;
}

const CLEARANCE_TYPES = [
  { value: "KRA",   label: "KRA Tax Compliance Certificate" },
  { value: "HELB",  label: "HELB Clearance Certificate" },
  { value: "EACC",  label: "EACC Ethics Clearance Certificate" },
  { value: "DCI",   label: "DCI Certificate of Good Conduct" },
  { value: "CRB",   label: "CRB Credit Reference Clearance" },
  { value: "Other", label: "Other Clearance" },
];

const getTypeLabel = (v: string) => CLEARANCE_TYPES.find((t) => t.value === v)?.label ?? v;

const STATUS_BADGE: Record<string, string> = {
  VALID:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  EXPIRED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
};

interface Props {
  initialClearances?: ClearanceItem[];
  onCountChange?: (count: number) => void;
}

export default function ClearancesSection({ initialClearances = [], onCountChange }: Props) {
  const { showToast } = useToast();

  const [items, setItems]   = useState<ClearanceItem[]>(initialClearances);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: "KRA", certificateNumber: "", issueDate: "", expiryDate: "", status: "VALID",
  });

  const reportCount = (list: ClearanceItem[]) => onCountChange?.(list.length);
  const resetForm   = () => setForm({ type: "KRA", certificateNumber: "", issueDate: "", expiryDate: "", status: "VALID" });

  const handleAdd = async () => {
    if (!form.type || !form.issueDate) {
      showToast({ type: "error", title: "Required", message: "Clearance type and issue date are required" });
      return;
    }
    setSaving(true);
    try {
      const res = await candidateService.addClearance({
        type: form.type,
        certificateNumber: form.certificateNumber.trim() || null,
        issueDate: form.issueDate,
        expiryDate: form.expiryDate || null,
        status: form.status,
      });
      if (res.success && res.data) {
        const next = [...items, res.data as ClearanceItem];
        setItems(next);
        resetForm();
        setShowForm(false);
        reportCount(next);
        showToast({ type: "success", title: "Saved", message: "Clearance saved to your profile" });
      } else {
        showToast({ type: "error", title: "Save failed", message: res.message || "Could not save clearance" });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Error", message: err.message || "Failed to save clearance" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    setDeleting(id);
    try {
      const res = await candidateService.deleteClearance(id);
      if (res.success !== false) {
        const next = items.filter((c) => c.id !== id);
        setItems(next);
        reportCount(next);
      } else {
        showToast({ type: "error", title: "Error", message: res.message || "Could not remove clearance" });
      }
    } catch (err: any) {
      showToast({ type: "error", title: "Error", message: err.message || "Failed to remove clearance" });
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
              <Shield className="h-5 w-5 text-primary-500" />
              Statutory Clearances <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Compliance certificates required for this position — saved instantly
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
                {items.length} clearance{items.length !== 1 ? "s" : ""} in your profile
              </Label>
            </div>
            <div className="space-y-2">
              {items.map((clr) => (
                <div key={clr.id} className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-neutral-900 dark:text-white text-sm">{getTypeLabel(clr.type)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[clr.status] ?? STATUS_BADGE.VALID}`}>
                        {clr.status}
                      </span>
                    </div>
                    {clr.certificateNumber && (
                      <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                        <Hash className="h-3 w-3" /> {clr.certificateNumber}
                      </p>
                    )}
                    <p className="text-xs text-neutral-500 mt-0.5">Issued: {clr.issueDate}</p>
                  </div>
                  <Button onClick={() => handleRemove(clr.id)} type="button" variant="ghost" size="icon" disabled={deleting === clr.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0">
                    {deleting === clr.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
              <Label className="text-sm font-medium">Clearance Type <span className="text-red-500">*</span></Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CLEARANCE_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Certificate Number (Optional)</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input value={form.certificateNumber} onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })} placeholder="Certificate reference number" className="pl-10 h-11" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Issue Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} className="pl-10 h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Expiry Date (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="pl-10 h-11" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VALID">Valid</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                  <SelectItem value="PENDING">Pending Renewal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={handleAdd} type="button" disabled={saving} className="flex-1">
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Add Clearance"}
              </Button>
              <Button onClick={() => { setShowForm(false); resetForm(); }} type="button" variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Shield className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">At least 1 clearance certificate is required</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}