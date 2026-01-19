import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false)

  const getCurrentUserId = async (): Promise<string | null> => {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      // Supabase throws this when no session exists (public users)
      if (error.name === "AuthSessionMissingError") return null
      throw error
    }
    return data.user?.id ?? null
  }

  const uploadImage = async (
    file: File,
    folder: string = "profile"
  ): Promise<string | null> => {
    let userId: string | null = null
    try {
      userId = await getCurrentUserId()
    } catch (error: any) {
      console.error("Error checking auth session:", error)
      toast({
        title: "Upload failed",
        description: "Unable to verify your session. Please try again.",
        variant: "destructive",
      })
      return null
    }

    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload images.",
        variant: "destructive",
      })
      return null
    }

    setIsUploading(true)
    
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${folder}-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive"
        })
        return null
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(data.path)

      return publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred during upload.",
        variant: "destructive"
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const deleteImage = async (url: string): Promise<boolean> => {
    if (!url) return false

    try {
      const userId = await getCurrentUserId()
      if (!userId) return false

      // Extract the file path from the URL
      const urlParts = url.split('/profile-images/')
      if (urlParts.length !== 2) return false
      
      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('profile-images')
        .remove([filePath])

      if (error) {
        console.error('Delete error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete error:', error)
      return false
    }
  }

  return {
    uploadImage,
    deleteImage,
    isUploading
  }
}
