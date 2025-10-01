
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { EditableSection } from "@/components/EditableSection"

interface BasicInfoSectionProps {
  name: string
  role: string
  location: string
  isEditing: boolean
  onEditToggle: () => void
  onChange: (field: "name" | "role" | "location", value: string) => void
  className?: string
  content?: string
  readOnly?: boolean
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  role,
  location,
  isEditing,
  onEditToggle,
  onChange,
  className = "",
  content = "Update your name, role, and location to keep your profile current",
  readOnly = false,
}) => {
  const sectionContent = (
    <div className={className}>
      <div className="relative mb-2">
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditToggle}
            className="absolute top-0 right-0 z-10"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <div className="w-full">
          {isEditing ? (
            <Input
              value={name}
              onChange={(e) => onChange("name", e.target.value)}
              className="text-2xl font-bold text-center"
              placeholder="Name"
            />
          ) : (
            <h1 className="text-2xl font-bold text-center">
              {name || "Name not available"}
            </h1>
          )}
        </div>
      </div>
      <div className="space-y-2 text-center">
        {isEditing ? (
          <>
            <Input
              value={role}
              onChange={(e) => onChange("role", e.target.value)}
              className="text-lg text-center"
              placeholder="Role"
            />
            <Input
              value={location}
              onChange={(e) => onChange("location", e.target.value)}
              className="text-sm text-center"
              placeholder="Location"
            />
          </>
        ) : (
          <>
            <p className="text-lg text-gray-700">
              {role || "Role not available"}
            </p>
            <p className="text-sm text-gray-500">
              {location || "Location not available"}
            </p>
          </>
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
