import { Toaster as Sonner, type ToasterProps } from "sonner"

import { useFlashToast } from "@/hooks/use-flash-toast"

function Toaster({ ...props }: ToasterProps) {
  useFlashToast()

  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl !font-sans",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
