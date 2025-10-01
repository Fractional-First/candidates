
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { useGetUser } from '@/queries/auth/useGetUser'

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const { data: user } = useGetUser()

  const uploadImage = async (file: File, folder: string = 'profile'): Promise<string | null> => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload images.",
        variant: "destructive"
      })
      return null
    }

    setIsUploading(true)
    
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${folder}-${Date.now()}.${fileExt}`

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
    if (!user?.id || !url) return false

    try {
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
