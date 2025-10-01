import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Globe } from "lucide-react"

interface PublishButtonProps {
  isPublished: boolean
  isUpdatingPublishStatus: boolean
  onPublishToggle: () => void
}

export const PublishButton = ({
  isPublished,
  isUpdatingPublishStatus,
  onPublishToggle,
}: PublishButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onPublishToggle}
            disabled={isUpdatingPublishStatus}
            variant={!isPublished ? "default" : "outline"}
            style={!isPublished ? { backgroundColor: "#449889" } : undefined}
            className={!isPublished ? "hover:opacity-90 text-white" : ""}
          >
            <Globe className="mr-2 h-4 w-4" />
            {isUpdatingPublishStatus
              ? "Updating..."
              : !isPublished
              ? "Publish"
              : "Unpublish"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {!isPublished
            ? "Publishing makes your profile live and accessible through a public link."
            : "Make your profile private and remove it from public access."}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
