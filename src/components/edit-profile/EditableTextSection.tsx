
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
import { EditableSection } from "@/components/EditableSection"
import clsx from "clsx"
import React from "react"

interface EditableTextSectionProps {
  title: string
  value: string
  onChange: (value: string) => void
  isEditing: boolean
  onEditToggle: () => void
  placeholder?: string
  className?: string
  bgColorClass?: string
  textColorClass?: string
  labelClassName?: string
  headerClassName?: string
  textAreaClass?: string
  content?: string
  readOnly?: boolean
}

export const EditableTextSection: React.FC<EditableTextSectionProps> = ({
  title,
  value,
  onChange,
  isEditing,
  onEditToggle,
  placeholder,
  className,
  bgColorClass = "bg-white",
  textColorClass = "text-gray-900",
  labelClassName = "",
  headerClassName = "",
  textAreaClass = "",
  content = "Edit this section to customize your information",
  readOnly = false,
}) => {
  const sectionContent = (
    <div className={clsx("rounded-lg border", className)}>
      <div className={clsx("flex items-center justify-between p-1 pl-4 rounded-t-lg", headerClassName)}>
        <h3 className={clsx("text-lg font-semibold", labelClassName)}>
          {title}
        </h3>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditToggle}
            className="hover:bg-white/20 text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className={clsx("p-4 rounded-b-lg", bgColorClass)}>
        {isEditing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={clsx(
              "text-sm leading-relaxed bg-white text-gray-700",
              textAreaClass
            )}
            rows={8}
            placeholder={placeholder}
          />
        ) : (
          <div className={clsx("text-sm leading-relaxed whitespace-pre-line", textColorClass, bgColorClass)}>
            {value || placeholder || "Not available"}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <EditableSection isEditing={isEditing} content={content}>
      {sectionContent}
    </EditableSection>
  )
}
