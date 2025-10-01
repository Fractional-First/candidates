import { notFound } from "next/navigation"
import {
  getPublicProfileBySlug,
  getPublicProfileById,
} from "@/lib/supabase-server"
import { ProfileData } from "@/types/profile"
import PublicProfileClient from "./PublicProfileClient"

interface PublicProfilePageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PublicProfilePage({
  params,
  searchParams,
}: PublicProfilePageProps) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const uuid = searchParamsResolved.uuid as string
  const isNewProfile = searchParamsResolved.new_profile === "true"

  // Determine if this is a preview mode and if we should show the claim banner
  const isPreviewMode = !!uuid
  const showClaimBanner = isPreviewMode && isNewProfile

  let profileData: ProfileData | null = null
  let error: Error | null = null

  try {
    if (slug) {
      profileData = await getPublicProfileBySlug(slug)
    } else if (uuid) {
      profileData = await getPublicProfileById(uuid)
    } else {
      notFound()
    }
  } catch (err) {
    error = err as Error
  }

  // Handle errors
  if (error) {
    if (error.message === "PROFILE_NOT_PUBLISHED") {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Profile Not Available
            </h1>
            <p className="text-gray-600 mb-6">
              This profile is currently private and not publicly accessible.
            </p>
            <a
              href="https://fractionalfirst.com"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              Visit Fractional First
            </a>
          </div>
        </div>
      )
    }
    notFound()
  }

  if (!profileData) {
    notFound()
  }

  return (
    <PublicProfileClient
      profileData={profileData}
      showClaimBanner={showClaimBanner}
    />
  )
}
