"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Users, Plus, Trash2, CheckCircle2, Phone, Mail, Briefcase, Building2 } from "lucide-react";

interface Props {
  data: any[];
  onChange: (data: any[]) => void;
  existingReferees: any[];
}

export default function RefereesSection({ data, onChange, existingReferees }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [currentRef, setCurrentRef] = useState({
    name: "",
    position: "",
    organization: "",
    phone: "",
    email: "",
  });

  const handleAdd = () => {
    if (!currentRef.name.trim()) return;
    onChange([...data, { ...currentRef }]);
    setCurrentRef({ name: "", position: "", organization: "", phone: "", email: "" });
    setShowForm(false);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const totalReferees = data.length + existingReferees.length;

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" />
              Professional Referees <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Minimum 3 professional referees required ({totalReferees}/3 provided)
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
        {/* Progress Indicator */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`flex-1 h-2 rounded-full transition-colors ${
                totalReferees >= n
                  ? "bg-green-500"
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            />
          ))}
          {totalReferees >= 3 && (
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          )}
        </div>

        {/* Existing */}
        {existingReferees.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Already in your profile
              </Label>
            </div>
            <div className="space-y-2">
              {existingReferees.map((ref) => (
                <div
                  key={ref.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <p className="font-semibold text-neutral-900 dark:text-white text-sm">{ref.name}</p>
                  {ref.position && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {ref.position}{ref.organization && ` · ${ref.organization}`}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {ref.email && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {ref.email}
                      </p>
                    )}
                    {ref.phone && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {ref.phone}
                      </p>
                    )}
                  </div>
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
              {data.map((ref, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-900 dark:text-green-200 text-sm">{ref.name}</p>
                    {ref.position && (
                      <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                        {ref.position}{ref.organization && ` · ${ref.organization}`}
                      </p>
                    )}
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
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={currentRef.name}
                  onChange={(e) => setCurrentRef({ ...currentRef, name: e.target.value })}
                  placeholder="Referee's full name"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Position / Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={currentRef.position}
                  onChange={(e) => setCurrentRef({ ...currentRef, position: e.target.value })}
                  placeholder="e.g. Senior Manager, Director"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Organization</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  value={currentRef.organization}
                  onChange={(e) => setCurrentRef({ ...currentRef, organization: e.target.value })}
                  placeholder="e.g. ABC Company Ltd"
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="tel"
                    value={currentRef.phone}
                    onChange={(e) => setCurrentRef({ ...currentRef, phone: e.target.value })}
                    placeholder="+254712345678"
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <Input
                    type="email"
                    value={currentRef.email}
                    onChange={(e) => setCurrentRef({ ...currentRef, email: e.target.value })}
                    placeholder="referee@example.com"
                    className="pl-10 h-11"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={handleAdd} type="button" className="flex-1">
                Add Referee
              </Button>
              <Button onClick={() => setShowForm(false)} type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Validation */}
        {totalReferees < 3 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Users className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              {3 - totalReferees} more referee{3 - totalReferees !== 1 ? "s" : ""} required (currently {totalReferees}/3)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
