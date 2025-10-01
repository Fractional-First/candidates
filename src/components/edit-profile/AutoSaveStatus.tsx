
import React from "react"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutoSaveStatusProps {
  status: "idle" | "saving" | "saved" | "error"
  lastSavedTime?: Date
  onRetry?: () => void
  className?: string
}

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({
  status,
  lastSavedTime,
  onRetry,
  className = "",
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Don't render anything for idle status
  if (status === "idle") {
    return null
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm text-gray-500", className)}>
      {status === "saving" && (
        <>
          <Clock className="h-3 w-3 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {status === "saved" && lastSavedTime && (
        <>
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Last saved at {formatTime(lastSavedTime)}</span>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="h-3 w-3 text-red-500" />
          <span>Save failed.</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-red-500 hover:text-red-700 underline"
            >
              Retry?
            </button>
          )}
        </>
      )}
    </div>
  )
}
