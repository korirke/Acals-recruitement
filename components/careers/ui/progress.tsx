import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={`relative w-full h-4 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800 ${className || ""}`}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="w-full h-full bg-primary-500 dark:bg-primary-400 transition-all rounded-full"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }