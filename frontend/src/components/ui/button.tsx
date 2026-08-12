import * as React from "react"
import { cn } from "../../lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:     "bg-gradient-to-r from-[#036AFF] to-[#6366F1] text-white hover:opacity-95 shadow-md shadow-blue-500/20 active:scale-[0.98]",
  ghost:       "text-muted-foreground hover:bg-white/50 hover:text-[#141414]",
  outline:     "border border-white/80 bg-white/70 backdrop-blur-md text-[#141414] hover:bg-white/90 shadow-sm",
  secondary:   "bg-white/60 backdrop-blur-md text-[#141414] hover:bg-white/80 border border-white/60 shadow-sm",
  destructive: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  link:        "text-[#036AFF] underline-offset-4 hover:underline p-0 h-auto",
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-9.5 px-4 py-2 text-base rounded-xl",
  sm:      "h-8 px-3 py-1 text-sm rounded-lg",
  lg:      "h-11 px-6 py-2.5 text-lg rounded-2xl",
  icon:    "h-9 w-9 p-0 rounded-xl",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          "disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
