"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";
import { candidateService } from "@/services/recruitment-services";
import type { CandidateProfile } from "@/types";
import { Loader2, Save, IdCard } from "lucide-react";

export default function PersonalInfoSection({
  profile,
  onUpdate,
}: {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // derive full name from Basic tab
  const derivedFullName = useMemo(() => {
    const first = profile?.user?.firstName || "";
    const last = profile?.user?.lastName || "";
    return `${first} ${last}`.trim();
  }, [profile?.user?.firstName, profile?.user?.lastName]);

  const [form, setForm] = useState({
    dob: "",
    gender: "M",
    idNumber: "",
    nationality: "",
    countyOfOrigin: "",
    plwd: false,
  });

  useEffect(() => {
    const p = (profile as any)?.personalInfo;
    if (!p) return;

    setForm((prev) => ({
      ...prev,
      dob: (p.dob || "").slice(0, 10),
      gender: p.gender || "M",
      idNumber: p.idNumber || "",
      nationality: p.nationality || "",
      countyOfOrigin: p.countyOfOrigin || "",
      plwd: typeof p.plwd === "boolean" ? p.plwd : prev.plwd,
    }));
  }, [profile]);

  const save = async () => {
    if (!derivedFullName) {
      toast({
        title: "Missing Name",
        description:
          "Please ensure First Name and Last Name are available in your profile.",
        variant: "destructive",
      });
      return;
    }

    const required = [
      "dob",
      "gender",
      "idNumber",
      "nationality",
      "countyOfOrigin",
    ] as const;

    for (const f of required) {
      if (!String((form as any)[f] ?? "").trim()) {
        toast({
          title: "Validation Error",
          description: `${f} is required`,
          variant: "destructive",
        });
        return;
      }
    }

    if (!["M", "F", "Other"].includes(form.gender)) {
      toast({
        title: "Validation Error",
        description: "Gender must be M, F, or Other",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      await candidateService.upsertPersonalInfo({
        fullName: derivedFullName,
        dob: form.dob,
        gender: form.gender,
        idNumber: form.idNumber.trim(),
        nationality: form.nationality.trim(),
        countyOfOrigin: form.countyOfOrigin.trim(),
        plwd: !!form.plwd,
      });

      toast({
        title: "Saved",
        variant: "success",
        description: "Personal details saved successfully",
      });

      // Trigger parent to refresh profile data
      await Promise.resolve(onUpdate());
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Failed to save",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-white flex items-center gap-2">
          <IdCard className="h-5 w-5 text-primary-500" />
          Personal Details (ID &amp; Demographics)
        </CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          These fields support formal shortlisting/longlisting (DOB→Age, ID,
          county, nationality, PLWD).
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Display derived full name (read-only) */}
        {/* <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Full Name (from Basic Info)
          </Label>
          <Input
            value={derivedFullName}
            disabled
            className="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
          />
        </div> */}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-neutral-700 dark:text-neutral-300">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-700 dark:text-neutral-300">
              Gender <span className="text-red-500">*</span>
            </Label>
            <select
              className="w-full h-10 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 text-neutral-900 dark:text-white"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            National ID Number <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.idNumber}
            onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
            className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-neutral-700 dark:text-neutral-300">
              Nationality <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.nationality}
              onChange={(e) =>
                setForm({ ...form, nationality: e.target.value })
              }
              className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-700 dark:text-neutral-300">
              County of Origin <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.countyOfOrigin}
              onChange={(e) =>
                setForm({ ...form, countyOfOrigin: e.target.value })
              }
              className="border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        {/* PLWD toggle */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div>
            <Label className="text-base font-semibold text-neutral-900 dark:text-white">
              PLWD
            </Label>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Person Living With Disability
            </p>
          </div>

          <Switch
            checked={!!form.plwd}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, plwd: !!checked }))
            }
          />
        </div>

        <Button
          onClick={save}
          disabled={isSaving}
          className="bg-primary-500 hover:bg-primary-600 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" /> Save Personal Details
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
