"use client";

import { Input } from "@/components/careers/ui/input";
import { Textarea } from "@/components/careers/ui/textarea";
import { Label } from "@/components/careers/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { User, MapPin, Phone, Briefcase } from "lucide-react";

interface Props {
  data: any;
  onChange: (data: any) => void;
  missingKeys: string[];
}

export default function BasicInfoSection({ data, onChange, missingKeys }: Props) {
  const needs = (key: string) => missingKeys.includes(key);

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5 text-primary-500" />
          Basic Information
        </CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Tell us about your professional background
        </p>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {needs("BASIC_TITLE") && (
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-neutral-900 dark:text-white">
              Professional Title <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                id="title"
                value={data.title || ""}
                onChange={(e) => onChange({ ...data, title: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
        )}

        {needs("BASIC_LOCATION") && (
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-neutral-900 dark:text-white">
              Location <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                id="location"
                value={data.location || ""}
                onChange={(e) => onChange({ ...data, location: e.target.value })}
                placeholder="e.g. Nairobi, Kenya"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
        )}

        {needs("BASIC_PHONE") && (
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-neutral-900 dark:text-white">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                id="phone"
                type="tel"
                value={data.phone || ""}
                onChange={(e) => onChange({ ...data, phone: e.target.value })}
                placeholder="+254712345678"
                className="pl-10 h-11"
                required
              />
            </div>
          </div>
        )}

        {needs("BASIC_BIO") && (
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-neutral-900 dark:text-white">
              Professional Bio <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="bio"
              value={data.bio || ""}
              onChange={(e) => onChange({ ...data, bio: e.target.value })}
              placeholder="Write a brief professional bio (min 50 characters)..."
              className="min-h-[120px] resize-none"
              required
              minLength={50}
            />
            {data.bio && data.bio.length > 0 && data.bio.length < 50 && (
              <p className="text-xs text-orange-600">
                {50 - data.bio.length} more characters required
              </p>
            )}
            {data.bio && data.bio.length >= 50 && (
              <p className="text-xs text-green-600">
                ✓ Bio meets minimum length
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
