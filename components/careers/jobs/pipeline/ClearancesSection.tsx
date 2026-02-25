"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { Shield, Plus, Trash2, CheckCircle2, Calendar, Hash } from "lucide-react";

interface Props {
  data: any[];
  onChange: (data: any[]) => void;
  existingClearances: any[];
}

const CLEARANCE_TYPES = [
  { value: "KRA", label: "KRA Tax Compliance Certificate" },
  { value: "HELB", label: "HELB Clearance Certificate" },
  { value: "EACC", label: "EACC Ethics Clearance Certificate" },
  { value: "DCI", label: "DCI Certificate of Good Conduct" },
  { value: "CRB", label: "CRB Credit Reference Clearance" },
  { value: "Other", label: "Other Clearance" },
];

const STATUS_BADGE: Record<string, string> = {
  VALID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  EXPIRED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
};

export default function ClearancesSection({ data, onChange, existingClearances }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [currentClear, setCurrentClear] = useState({
    type: "KRA",
    certificateNumber: "",
    issueDate: "",
    expiryDate: "",
    status: "VALID",
  });

  const handleAdd = () => {
    if (!currentClear.type || !currentClear.issueDate) return;
    onChange([...data, { ...currentClear }]);
    setCurrentClear({ type: "KRA", certificateNumber: "", issueDate: "", expiryDate: "", status: "VALID" });
    setShowForm(false);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const getTypeLabel = (value: string) =>
    CLEARANCE_TYPES.find((t) => t.value === value)?.label || value;

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
              Compliance certificates required for this position
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            type="button"
            variant={showForm ? "outline" : "default"}
            size="sm"
          >
            {showForm ? "Cancel" : <><Plus className="h-4 w-4 mr-2" />Add</>}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Existing */}
        {existingClearances.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Already in your profile
              </Label>
            </div>
            <div className="space-y-2">
              {existingClearances.map((clear) => (
                <div
                  key={clear.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                      {getTypeLabel(clear.type)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        STATUS_BADGE[clear.status] || STATUS_BADGE.VALID
                      }`}
                    >
                      {clear.status}
                    </span>
                  </div>
                  {clear.certificateNumber && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                      <Hash className="h-3 w-3" /> {clear.certificateNumber}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New */}
        {data.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-green-700 dark:text-green-300">
              Adding now
            </Label>
            <div className="space-y-2">
              {data.map((clear, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-900 dark:text-green-200 text-sm">
                      {getTypeLabel(clear.type)}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                      {clear.status} · Issued: {clear.issueDate}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRemove(index)}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
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
                Clearance Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={currentClear.type}
                onValueChange={(value) => setCurrentClear({ ...currentClear, type: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLEARANCE_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Certificate Number (Optional)</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={currentClear.certificateNumber}
                  onChange={(e) =>
                    setCurrentClear({ ...currentClear, certificateNumber: e.target.value })
                  }
                  placeholder="Certificate reference number"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Issue Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={currentClear.issueDate}
                    onChange={(e) => setCurrentClear({ ...currentClear, issueDate: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Expiry Date (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="date"
                    value={currentClear.expiryDate}
                    onChange={(e) => setCurrentClear({ ...currentClear, expiryDate: e.target.value })}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={currentClear.status}
                onValueChange={(value) => setCurrentClear({ ...currentClear, status: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VALID">Valid</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                  <SelectItem value="PENDING">Pending Renewal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={handleAdd} type="button" className="flex-1">
                Add Clearance
              </Button>
              <Button onClick={() => setShowForm(false)} type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {data.length === 0 && existingClearances.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Shield className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              At least 1 clearance certificate is required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
