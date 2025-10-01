
import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EditingTooltipProps {
  content: string
  children: React.ReactElement
  show: boolean
}

export const EditingTooltip: React.FC<EditingTooltipProps> = ({
  content,
  children,
  show,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setIsVisible(true), 200)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [show])

  if (!show) {
    return children
  }

  return (
    <div ref={triggerRef} className="relative">
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-50 px-3 py-2 text-xs text-white bg-gray-800 rounded-md shadow-lg",
            "max-w-xs break-words",
            "bottom-full left-0 mb-2",
            "opacity-0 animate-fade-in",
            "before:content-[''] before:absolute before:top-full before:left-4",
            "before:border-4 before:border-transparent before:border-t-gray-800"
          )}
          style={{
            animation: "fade-in 0.2s ease-out forwards"
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
