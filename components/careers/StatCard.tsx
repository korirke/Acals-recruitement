"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconColor?: string;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  iconColor = "text-primary-500",
  delay = 0,
}: StatCardProps) {
  const changeColors = {
    positive: "text-green-600 dark:text-green-400",
    negative: "text-orange-600 dark:text-orange-400",
    neutral: "text-neutral-500 dark:text-neutral-400",
  };

  return (
    <Card
      className="animate-fade-in hover:shadow-lg transition-all duration-300 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-x-2">
        <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400 truncate flex-1 min-w-0">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 transition-colors shrink-0", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-neutral-900 dark:text-white wrap-break-word">{value}</div>
        {change && (
          <p className={cn("text-xs mt-1 wrap-break-word", changeColors[changeType])}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}