import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-t-transparent border-teal-600 fill-white",
        "border-l-transparent border-r-teal-600 border-b-teal-600 border-t-teal-600",
        sizeClasses[size],
        className
      )}
    />
  )
}
