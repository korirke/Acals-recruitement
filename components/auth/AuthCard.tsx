"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Briefcase } from "lucide-react";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function AuthCard({ title, description, children, icon }: AuthCardProps) {
  return (
    <Card className="w-full border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-r from-primary-500 to-orange-500 shadow-lg">
            {icon || <Briefcase className="h-7 w-7 text-white" />}
          </div>
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}
