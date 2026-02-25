"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Settings as SettingsIcon, Globe, FileText, Mail, Users2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  const settingsCategories = [
    {
      title: "Site Configuration",
      description: "Manage site name, logo, and global settings",
      icon: Globe,
      href: "/recruitment-portal/settings/site",
      color: "text-blue-600 dark:text-blue-400",
      show: true,
    },
    {
      title: "Content Management",
      description: "Edit static pages and manage blog content",
      icon: FileText,
      href: "/recruitment-portal/settings/content",
      color: "text-purple-600 dark:text-purple-400",
      show: true,
    },
    {
      title: "Email Configuration",
      description: "Configure email templates and settings",
      icon: Mail,
      href: "/recruitment-portal/settings/email",
      color: "text-green-600 dark:text-green-400",
      show: true,
    },
    {
      title: "Job Configuration",
      description: "Manage categories, locations, and job settings",
      icon: SettingsIcon,
      href: "/recruitment-portal/settings/config",
      color: "text-orange-600 dark:text-orange-400",
      show: true,
    },
    {
      title: "Candidate Profile Config",
      description: "Control which candidate profile fields/sections are visible or required",
      icon: Users2,
      href: "/recruitment-portal/settings/candidate-profile",
      color: "text-rose-600 dark:text-rose-400",
      show: user?.role === "SUPER_ADMIN",
    },
  ].filter((x) => x.show);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Configure your job portal settings
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {settingsCategories.map((category, index) => (
          <Card
            key={category.href}
            className="shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className={`p-1.5 sm:p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 ${category.color} shrink-0`}>
                      <category.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <CardTitle className="text-base sm:text-lg truncate">
                      {category.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    {category.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-0">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={category.href}>Configure</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
