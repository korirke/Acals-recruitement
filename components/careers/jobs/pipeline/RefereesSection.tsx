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
import {
  Users,
  Plus,
  Trash2,
  Phone,
  Mail,
  Briefcase,
  Building2,
  Loader2,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";

interface RefereeItem {
  id: string;
  name: string;
  position?: string | null;
  organization?: string | null;
  phone?: string | null;
  email?: string | null;
  relationship?: string | null;
}

interface Props {
  initialReferees?: RefereeItem[];
  /**
   * Admin-configured minimum referee count.
   * - If required=true and this is 0 (or unset), defaults to 3.
   * - If required=false, no minimum is enforced (0).
   */
  refereesRequired?: number;
  /** Whether the admin has marked referees as required */
  required?: boolean;
  onCountChange?: (count: number) => void;
}

const RELATIONSHIP_OPTIONS = [
  "Direct Supervisor",
  "Line Manager",
  "Senior Colleague",
  "Professional Associate",
  "Academic Supervisor",
  "Client / Partner",
  "Other",
];

export default function RefereesSection({
  initialReferees = [],
  refereesRequired = 0,
  required = false,
  onCountChange,
}: Props) {
  const { showToast } = useToast();

  // If required but admin left count at 0, fall back to 3.
  // If not required, no minimum (0).
  const minCount = required ? (refereesRequired > 0 ? refereesRequired : 3) : 0;

  const [items, setItems] = useState<RefereeItem[]>(initialReferees);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    position: "",
    organization: "",
    phone: "",
    email: "",
    relationship: "",
  });

  const reportCount = (list: RefereeItem[]) => onCountChange?.(list.length);
  const resetForm = () =>
    setForm({
      name: "",
      position: "",
      organization: "",
      phone: "",
      email: "",
      relationship: "",
    });

  // ── Add ──
  const handleAdd = async () => {
    // All fields required
    const missing: string[] = [];
    if (!form.name.trim()) missing.push("Full name");
    if (!form.position.trim()) missing.push("Position");
    if (!form.organization.trim()) missing.push("Organization");
    if (!form.phone.trim()) missing.push("Phone");
    if (!form.email.trim()) missing.push("Email");
    if (!form.relationship.trim()) missing.push("Relationship");

    if (missing.length > 0) {
      showToast({
        type: "error",
        title: "Required fields",
        message: missing.join(", ") + " are required",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await candidateService.addReferee({
        name: form.name.trim(),
        position: form.position.trim(),
        organization: form.organization.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        relationship: form.relationship.trim(),
      });
      if (res.success && res.data) {
        const next = [...items, res.data as RefereeItem];
        setItems(next);
        resetForm();
        setShowForm(false);
        reportCount(next);
        showToast({
          type: "success",
          title: "Saved",
          message: "Referee saved to your profile",
        });
      } else {
        showToast({
          type: "error",
          title: "Save failed",
          message: res.message || "Could not save referee",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to save referee",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Remove 
  const handleRemove = async (id: string) => {
    setDeleting(id);
    try {
      const res = await candidateService.deleteReferee(id);
      if (res.success !== false) {
        const next = items.filter((r) => r.id !== id);
        setItems(next);
        reportCount(next);
      } else {
        showToast({
          type: "error",
          title: "Error",
          message: res.message || "Could not remove referee",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to remove referee",
      });
    } finally {
      setDeleting(null);
    }
  };

  const totalCount = items.length;
  const meetsMin = totalCount >= minCount;

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" />
              Professional Referees{" "}
              {required && <span className="text-red-500">*</span>}
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {minCount > 0
                ? `Minimum ${minCount} professional referee${minCount !== 1 ? "s" : ""} required (${totalCount}/${minCount} provided)`
                : `${totalCount} professional referee${totalCount !== 1 ? "s" : ""} added`}
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
        {/* Progress bar — only shown when a minimum is enforced */}
        {minCount > 0 && (
          <div className="flex items-center gap-3">
            {Array.from({ length: minCount }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  totalCount > i
                    ? "bg-green-500"
                    : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            ))}
            {meetsMin && (
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            )}
          </div>
        )}

        {/* Items list */}
        {items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {items.length} referee{items.length !== 1 ? "s" : ""} in your
                profile
              </Label>
            </div>
            <div className="space-y-2">
              {items.map((ref) => (
                <div
                  key={ref.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                      {ref.name}
                    </p>
                    {ref.position && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {ref.position}
                        {ref.organization ? ` · ${ref.organization}` : ""}
                      </p>
                    )}
                    {ref.relationship && (
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5 font-medium">
                        {ref.relationship}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-1.5">
                      {ref.email && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {ref.email}
                        </p>
                      )}
                      {ref.phone && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {ref.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemove(ref.id)}
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={deleting === ref.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    {deleting === ref.id ? (
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

        {/* Add Form */}
        {showForm && (
          <div className="space-y-4 p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Referee's full name"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Position / Title <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  placeholder="e.g. Senior Manager, Director"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Organization */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Organization <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={form.organization}
                  onChange={(e) =>
                    setForm({ ...form, organization: e.target.value })
                  }
                  placeholder="e.g. ABC Company Ltd"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+254712345678"
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="referee@example.com"
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            {/* Relationship */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Relationship to You <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  list="relationship-options"
                  value={form.relationship}
                  onChange={(e) =>
                    setForm({ ...form, relationship: e.target.value })
                  }
                  placeholder="e.g. Direct Supervisor, Senior Colleague"
                  className="pl-10 h-11"
                />
                <datalist id="relationship-options">
                  {RELATIONSHIP_OPTIONS.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                How you know this referee professionally (e.g. Direct
                Supervisor, Senior Colleague)
              </p>
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
                  "Add Referee"
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

        {/* Validation */}
        {!meetsMin && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Users className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              {minCount - totalCount} more referee
              {minCount - totalCount !== 1 ? "s" : ""} required ({totalCount}/
              {minCount})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
