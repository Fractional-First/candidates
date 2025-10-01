import React from "react"
import { EditingTooltip } from "@/components/edit-profile/EditingTooltip"

interface EditableSectionProps {
  children: React.ReactElement
  isEditing: boolean
  content: string
  className?: string
}

export const EditableSection: React.FC<EditableSectionProps> = ({
  children,
  isEditing,
  content,
  className = "",
}) => {
  return (
    <EditingTooltip content={content} show={isEditing}>
      <div className={className}>{children}</div>
    </EditingTooltip>
  )
}
