import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getPublicProfileBySlug,
  getPublicProfileById,
} from "@/lib/supabase-server"
import { ProfileData } from "@/types/profile"
import PublicProfileClient from "./PublicProfileClient"
import { getBaseUrl } from "@/lib/site"
import {
  buildProfileDescription,
  buildProfileStructuredData,
  buildProfileTitle,
} from "@/lib/profile-seo"

interface PublicProfilePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params,
  searchParams,
}: PublicProfilePageProps): Promise<Metadata> {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const uuid = searchParamsResolved?.uuid as string | undefined

  let profileData: ProfileData | null = null
  try {
    if (slug) profileData = await getPublicProfileBySlug(slug)
    else if (uuid) profileData = await getPublicProfileById(uuid)
  } catch {
    // Let the page-level notFound / error handling drive rendering.
  }

  // For preview mode (uuid) and for any non-fetchable profiles (private/missing),
  // do not emit canonical metadata that could be indexed.
  if (uuid || !profileData) {
    return { title: "Profile | Fractional First" }
  }

  const baseUrl = await getBaseUrl()
  const canonical = slug ? `${baseUrl}/profile/${encodeURIComponent(slug)}` : undefined

  return {
    title: buildProfileTitle(profileData),
    description: buildProfileDescription(profileData),
    alternates: canonical ? { canonical } : undefined,
  }
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
      // Unpublished / private profiles should not return 200 (soft-404 risk).
      notFound()
    }
    notFound()
  }

  if (!profileData) {
    notFound()
  }

  const baseUrl = await getBaseUrl()
  const profileUrl = `${baseUrl}/profile/${encodeURIComponent(slug)}`
  const structuredData = buildProfileStructuredData({
    baseUrl,
    profileUrl,
    profile: profileData,
  })

  return (
    <>
      <script
        id="profile-jsonld"
        type="application/ld+json"
        suppressHydrationWarning
        // JSON-LD must be a string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicProfileClient
        profileData={profileData}
        showClaimBanner={showClaimBanner}
      />
    </>
  )
}
