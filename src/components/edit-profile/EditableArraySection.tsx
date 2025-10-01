
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Plus, X } from "lucide-react"
import { EditableSection } from "@/components/EditableSection"
import clsx from "clsx"

interface EditableArraySectionProps {
  title: string
  items: string[]
  isEditing: boolean
  onEditToggle: () => void
  onChange: (newArray: string[]) => void
  placeholder?: string
  addLabel?: string
  displayType?: "bullets" | "tags"
  className?: string
  headerClassName?: string
  bgColorClass?: string
  textColorClass?: string
  content?: string
  readOnly?: boolean
}

export const EditableArraySection: React.FC<EditableArraySectionProps> = ({
  title,
  items,
  isEditing,
  onEditToggle,
  onChange,
  placeholder = "Item",
  addLabel = "Add Item",
  displayType = "tags",
  className = "",
  content = "Edit this section to customize your information",
  readOnly = false,
}) => {
  const [localItems, setLocalItems] = useState<string[]>([])

  // Sync local state with props
  useEffect(() => {
    setLocalItems(items || [])
  }, [items])

  // Debounce changes
  useEffect(() => {
    if (!isEditing) return
    const timeout = setTimeout(() => {
      onChange(localItems)
    }, 300)
    return () => clearTimeout(timeout)
  }, [localItems, isEditing, onChange])

  const handleItemChange = (index: number, value: string) => {
    setLocalItems((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const handleAddItem = () => {
    setLocalItems((prev) => [...prev, ""])
  }

  const handleRemoveItem = (index: number) => {
    setLocalItems((prev) => prev.filter((_, i) => i !== index))
  }

  const sectionContent = (
    <div className={clsx("bg-white rounded-lg border", className)}>
      <div className="rounded-t-lg flex items-center justify-between p-1 pl-4 bg-[#449889] text-white">
        <h3 className="text-lg font-semibold">{title}</h3>
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
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            {localItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={placeholder}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {addLabel}
            </Button>
          </div>
        ) : items && items.length > 0 ? (
          displayType === "bullets" ? (
            <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
              {items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-900 mr-2 mt-0.5 flex-shrink-0">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-wrap gap-2">
              {items.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          )
        ) : (
          <div className="text-sm text-gray-700">{title} not available</div>
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
