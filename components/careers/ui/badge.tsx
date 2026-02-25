import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-primary-500 focus-visible:ring-primary-500/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 transition-all overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-white [a&]:hover:bg-primary-600",
        secondary:
          "border-transparent bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 [a&]:hover:bg-neutral-200 dark:[a&]:hover:bg-neutral-700",
        destructive:
          "border-transparent bg-red-600 text-white [a&]:hover:bg-red-700 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-600/80",
        outline:
          "text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 [a&]:hover:bg-neutral-100 dark:[a&]:hover:bg-neutral-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
