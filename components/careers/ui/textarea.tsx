import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-neutral-300 dark:border-neutral-700 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:border-primary-500 focus-visible:ring-primary-500/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-sm transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
