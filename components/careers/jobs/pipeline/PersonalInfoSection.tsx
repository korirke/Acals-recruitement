"use client";

import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Checkbox } from "@/components/careers/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { User, CreditCard, Flag, MapPin, Baby } from "lucide-react";

interface Props {
  data: any;
  onChange: (data: any) => void;
}

export default function PersonalInfoSection({ data, onChange }: Props) {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5 text-primary-500" />
          Personal Information <span className="text-red-500">*</span>
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Required for compliance and verification purposes
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-neutral-900 dark:text-white">
            Full Legal Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <Input
              id="fullName"
              value={data.fullName || ""}
              onChange={(e) => onChange({ ...data, fullName: e.target.value })}
              placeholder="As it appears on your National ID"
              className="pl-10 h-11"
              required
            />
          </div>
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-sm font-medium text-neutral-900 dark:text-white">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Baby className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <Input
                id="dob"
                type="date"
                value={data.dob || ""}
                onChange={(e) => onChange({ ...data, dob: e.target.value })}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium text-neutral-900 dark:text-white">
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.gender || "M"}
              onValueChange={(value) => onChange({ ...data, gender: value })}
            >
              <SelectTrigger className="h-11">
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

        {/* National ID */}
        <div className="space-y-2">
          <Label htmlFor="idNumber" className="text-sm font-medium text-neutral-900 dark:text-white">
            National ID Number <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <Input
              id="idNumber"
              value={data.idNumber || ""}
              onChange={(e) => onChange({ ...data, idNumber: e.target.value })}
              placeholder="Enter your ID number"
              className="pl-10 h-11"
              required
            />
          </div>
        </div>

        {/* Nationality + County of Origin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nationality" className="text-sm font-medium text-neutral-900 dark:text-white">
              Nationality <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <Input
                id="nationality"
                value={data.nationality || ""}
                onChange={(e) => onChange({ ...data, nationality: e.target.value })}
                placeholder="e.g. Kenyan"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="countyOfOrigin" className="text-sm font-medium text-neutral-900 dark:text-white">
              County of Origin <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <Input
                id="countyOfOrigin"
                value={data.countyOfOrigin || ""}
                onChange={(e) => onChange({ ...data, countyOfOrigin: e.target.value })}
                placeholder="e.g. Nairobi"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
        </div>

        {/* PLWD */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Checkbox
            id="plwd"
            checked={data.plwd || false}
            onCheckedChange={(checked) => onChange({ ...data, plwd: !!checked })}
            className="mt-0.5"
          />
          <div>
            <Label
              htmlFor="plwd"
              className="text-sm font-medium text-blue-900 dark:text-blue-200 cursor-pointer"
            >
              Person Living with Disability (PLWD)
            </Label>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              Check this if you identify as a person living with a disability
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
