import * as React from "react"
import { cn } from "@/lib/utils"

type TextareaProps = React.ComponentProps<"textarea"> & {
  /** Wajib: setiap textarea harus memiliki placeholder (lihat docs/DESIGN-SYSTEM.md). */
  placeholder: string
}

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-xl border border-input bg-card px-4 py-3 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
