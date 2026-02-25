import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-neutral-900 dark:file:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 selection:bg-primary-500 selection:text-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 bg-white text-neutral-900 dark:text-neutral-100 h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary-500 focus-visible:ring-primary-500/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
