import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProfileData } from "@/types/profile"

type PublicProfileParams =
  | { slug: string; id?: never }
  | { id: string; slug?: never }

export const usePublicProfile = (params: PublicProfileParams) => {
  return useQuery({
    queryKey: params.slug
      ? ["public-profile", params.slug]
      : ["public-profile-preview", params.id],
    retry: (failureCount, error) => {
      // Don't retry if it's a "profile not published" error
      if (error?.message === "PROFILE_NOT_PUBLISHED") {
        return false
      }
      // Don't retry if it's a 403/42501 error (permission denied)
      if ((error as any)?.code === "42501") {
        return false
      }
      // Default retry behavior for other errors
      return failureCount < 3
    },
    queryFn: async (): Promise<ProfileData | null> => {
      if (params.slug) {
        const { data, error } = await supabase.rpc("get_public_profile", {
          profile_slug_param: params.slug,
        })

        if (error) {
          console.error("Error fetching public profile by slug:", error)

          // Check if it's a permission error (profile not published)
          if (
            error.code === "42501" ||
            error.message?.includes("not published")
          ) {
            throw new Error("PROFILE_NOT_PUBLISHED")
          }

          throw error
        }

        if (!data || data.length === 0) {
          return null
        }

        const profileData = data[0]
        return {
          ...(profileData.profile_data as ProfileData),
          profile_version: (profileData as any).profile_version,
          linkedinurl: (profileData as any).linkedinurl,
        } as ProfileData
      } else if (params.id) {
        const { data, error } = await supabase.rpc("get_public_profile_by_id", {
          profile_id_param: params.id,
        })

        if (error) {
          console.error("Error fetching public profile by id:", error)
          throw error
        }

        if (!data || data.length === 0) {
          return null
        }

        const profileData = data[0]
        return {
          ...(profileData.profile_data as ProfileData),
          profile_version: (profileData as any).profile_version,
          linkedinurl: (profileData as any).linkedinurl,
        } as ProfileData
      } else {
        throw new Error("Either slug or id must be provided")
      }
    },
    enabled: !!(params.slug || params.id),
  })
}
