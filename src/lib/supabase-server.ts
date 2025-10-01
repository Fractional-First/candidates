import { createClient } from "@supabase/supabase-js"
import { ProfileData } from "@/types/profile"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getPublicProfileBySlug(
  slug: string
): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase.rpc("get_anon_profile", {
      anon_slug_param: slug,
    })

    if (error) {
      console.error("Error fetching anonymous profile by slug:", error)

      // Check if it's a permission error (profile not published)
      if (error.code === "42501" || error.message?.includes("not published")) {
        throw new Error("PROFILE_NOT_PUBLISHED")
      }

      throw error
    }

    if (!data || data.length === 0) {
      return null
    }

    const profileData = data[0]
    return {
      ...(profileData.anon_profile_data as ProfileData),
      profile_version: (profileData as any).profile_version,
      linkedinurl: (profileData as any).linkedinurl,
    } as ProfileData
  } catch (error) {
    console.error("Error in getPublicProfileBySlug:", error)
    throw error
  }
}

export async function getPublicProfileById(
  id: string
): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase.rpc("get_public_profile_by_id", {
      profile_id_param: id,
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
  } catch (error) {
    console.error("Error in getPublicProfileById:", error)
    throw error
  }
}
