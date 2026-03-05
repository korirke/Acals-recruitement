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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import {
  User,
  CreditCard,
  Flag,
  MapPin,
  Baby,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { candidateService } from "@/services/recruitment-services";
import { useToast } from "@/components/admin/ui/Toast";

// ─── Types

interface PersonalInfoData {
  fullName?: string;
  dob?: string;
  gender?: "M" | "F" | "Other";
  idNumber?: string;
  nationality?: string;
  countyOfOrigin?: string;
  plwd?: boolean;
}

interface Props {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
  /** Passed from pipeline so we can suggest the legal name */
  userFirstName?: string;
  userLastName?: string;
}

function normalisePlwd(value: unknown): boolean {
  if (value === true || value === 1 || value === "1") return true;
  return false;
}

// ─── Component

export default function PersonalInfoSection({
  data,
  onChange,
  userFirstName = "",
  userLastName = "",
}: Props) {
  const { showToast } = useToast();

  // Suggested full name from auth user (editable, just pre-fills)
  const derivedFullName =
    userFirstName || userLastName
      ? `${userFirstName} ${userLastName}`.trim()
      : "";

  // ── Internal form state (initialise ONCE from data prop) ──────────────────
  const [form, setForm] = useState({
    fullName: data.fullName || derivedFullName || "",
    dob: (data.dob || "").slice(0, 10),
    // Explicit: always a concrete gender string so Select is controlled
    gender: (data.gender as "M" | "F" | "Other") || "M",
    idNumber: data.idNumber || "",
    nationality: data.nationality || "",
    countyOfOrigin: data.countyOfOrigin || "",
    plwd: normalisePlwd(data.plwd),
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Save handler
  const handleSave = async () => {
    if (!form.fullName.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Full legal name is required",
      });
      return;
    }
    if (!form.dob) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Date of birth is required",
      });
      return;
    }
    if (!form.idNumber.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "National ID number is required",
      });
      return;
    }
    if (!form.nationality.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Nationality is required",
      });
      return;
    }
    if (!form.countyOfOrigin.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "County of origin is required",
      });
      return;
    }

    try {
      setSaving(true);

      const payload: PersonalInfoData & { fullName: string } = {
        fullName: form.fullName.trim(),
        dob: form.dob,
        gender: form.gender,
        idNumber: form.idNumber.trim(),
        nationality: form.nationality.trim(),
        countyOfOrigin: form.countyOfOrigin.trim(),
        plwd: form.plwd,
      };

      const res = await candidateService.upsertPersonalInfo(payload);

      if (res.success !== false) {
        setSaved(true);
        // Keep parent formData in sync (also feeds submit payload as fallback)
        onChange(payload);
        showToast({
          type: "success",
          title: "Saved",
          message: "Personal details saved to your profile",
        });
        setTimeout(() => setSaved(false), 3000);
      } else {
        showToast({
          type: "error",
          title: "Save Failed",
          message: (res as any).message || "Could not save personal details",
        });
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to save personal details",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Field change helper that also resets the "saved" indicator ───────────
  const field = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-primary-500" />
              Personal Information <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Required for compliance &amp; verification — saved instantly to
              your profile
            </p>
          </div>

          {saved && (
            <div className="flex items-center gap-1.5 text-green-600 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Saved</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ── Full Legal Name ── */}
        <div className="space-y-2">
          <Label
            htmlFor="pi-fullName"
            className="text-sm font-medium text-neutral-900 dark:text-white"
          >
            Full Legal Name <span className="text-red-500">*</span>
          </Label>

          {derivedFullName && !form.fullName && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Suggestion from your account:{" "}
              <button
                type="button"
                className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                onClick={() => field("fullName", derivedFullName)}
              >
                {derivedFullName}
              </button>
            </p>
          )}

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <Input
              id="pi-fullName"
              value={form.fullName}
              onChange={(e) => field("fullName", e.target.value)}
              placeholder="As it appears on your National ID"
              className="pl-10 h-11"
            />
          </div>
        </div>

        {/* ── DOB + Gender ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="pi-dob"
              className="text-sm font-medium text-neutral-900 dark:text-white"
            >
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Baby className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <Input
                id="pi-dob"
                type="date"
                value={form.dob}
                onChange={(e) => field("dob", e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="pi-gender"
              className="text-sm font-medium text-neutral-900 dark:text-white"
            >
              Gender <span className="text-red-500">*</span>
            </Label>
            {/* value is always a concrete string — no more "M" default that never writes to state */}
            <Select
              value={form.gender}
              onValueChange={(v) => field("gender", v as "M" | "F" | "Other")}
            >
              <SelectTrigger id="pi-gender" className="h-11">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
                <SelectItem value="Other">Other / Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── National ID ── */}
        <div className="space-y-2">
          <Label
            htmlFor="pi-idNumber"
            className="text-sm font-medium text-neutral-900 dark:text-white"
          >
            National ID Number <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <Input
              id="pi-idNumber"
              value={form.idNumber}
              onChange={(e) => field("idNumber", e.target.value)}
              placeholder="Enter your ID number"
              className="pl-10 h-11"
            />
          </div>
        </div>

        {/* ── Nationality + County ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="pi-nationality"
              className="text-sm font-medium text-neutral-900 dark:text-white"
            >
              Nationality <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <Input
                id="pi-nationality"
                value={form.nationality}
                onChange={(e) => field("nationality", e.target.value)}
                placeholder="e.g. Kenyan"
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="pi-countyOfOrigin"
              className="text-sm font-medium text-neutral-900 dark:text-white"
            >
              County of Origin <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <Input
                id="pi-countyOfOrigin"
                value={form.countyOfOrigin}
                onChange={(e) => field("countyOfOrigin", e.target.value)}
                placeholder="e.g. Nairobi"
                className="pl-10 h-11"
              />
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Checkbox
            id="pi-plwd"
            checked={form.plwd === true}
            onCheckedChange={(checked) => {
              field("plwd", checked === true);
            }}
            className="mt-0.5"
          />
          <div>
            <Label
              htmlFor="pi-plwd"
              className="text-sm font-medium text-blue-900 dark:text-blue-200 cursor-pointer"
            >
              Person Living with Disability (PLWD)
            </Label>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              Only check this if you identify as a person living with a
              disability
            </p>
          </div>
        </div>

        {/* ── Save Button ── */}
        <Button
          onClick={handleSave}
          disabled={saving}
          type="button"
          className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white font-semibold"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Saved to Profile
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Personal Details
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
