"use client";

interface Props {
  variant?: "table" | "card" | "list";
  count?: number;
}

export default function LoadingSkeleton({
  variant = "table",
  count = 3,
}: Props) {
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 animate-pulse"
          >
            <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded mb-3" />
            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
            <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 animate-pulse"
          >
            <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded mb-2" />
              <div className="h-3 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // table
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 overflow-hidden">
      <div className="p-4 space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-700 rounded" />
            <div className="h-4 w-1/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
            <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
