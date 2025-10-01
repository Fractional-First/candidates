import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Share2, ExternalLink, Globe } from "lucide-react"
import { toast } from "sonner"

interface PublicProfileLinkProps {
  publicProfileUrl: string
}

export const PublicProfileLink = ({
  publicProfileUrl,
}: PublicProfileLinkProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl)
      toast.success("Link copied to clipboard", {
        description: "You can now share your public profile link.",
      })
    } catch (error) {
      toast.error("Failed to copy link", {
        description: "Please copy the link manually.",
      })
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="text-center space-y-3 pb-4">
        <div className="flex items-center justify-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Your profile is now live!
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Share your public profile link or open it in a new window
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="bg-background/50 rounded-lg p-3 border">
          <code className="text-sm break-all text-foreground">
            {publicProfileUrl}
          </code>
        </div>
        
        <div className="flex gap-3 justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex-1 max-w-32 px-4 py-2 flex items-center justify-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Profile</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy link to clipboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(publicProfileUrl, "_blank")}
                  className="flex-1 max-w-32 px-4 py-2 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Profile</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open profile in new tab</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
