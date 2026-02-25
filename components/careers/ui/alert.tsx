"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Alert({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4",
        className
      )}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}