// components/ui/button.tsx
import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-105":
              variant === "default",
            "border-2 border-primary text-primary hover:bg-primary hover:text-white":
              variant === "outline",
            "hover:bg-gray-100": variant === "ghost",
          },
          {
            "h-10 px-6 text-sm": size === "sm",
            "h-12 px-8 text-base": size === "default",
            "h-14 px-10 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }