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

interface GuestProfilePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params,
  searchParams,
}: GuestProfilePageProps): Promise<Metadata> {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const uuid = searchParamsResolved?.uuid as string | undefined

  let profileData: ProfileData | null = null
  try {
    if (slug) {
      const result = await getPublicProfileBySlug(slug)
      profileData = result?.profileData ?? null
    } else if (uuid) {
      profileData = await getPublicProfileById(uuid)
    }
  } catch {
    // Let the page-level notFound / error handling drive rendering.
  }

  if (uuid || !profileData) {
    return { title: "Profile | Fractional First" }
  }

  const baseUrl = await getBaseUrl()
  const canonical = slug ? `${baseUrl}/guest-profile/${encodeURIComponent(slug)}` : undefined

  return {
    title: buildProfileTitle(profileData),
    description: buildProfileDescription(profileData),
    alternates: canonical ? { canonical } : undefined,
  }
}

export default async function GuestProfilePage({
  params,
  searchParams,
}: GuestProfilePageProps) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const uuid = searchParamsResolved.uuid as string
  const isNewProfile = searchParamsResolved.new_profile === "true"

  const isPreviewMode = !!uuid
  const showClaimBanner = isPreviewMode && isNewProfile

  let profileData: ProfileData | null = null
  let error: Error | null = null

  try {
    if (slug) {
      const result = await getPublicProfileBySlug(slug)
      profileData = result?.profileData ?? null
    } else if (uuid) {
      profileData = await getPublicProfileById(uuid)
    } else {
      notFound()
    }
  } catch (err) {
    error = err as Error
  }

  if (error) {
    if (error.message === "PROFILE_NOT_PUBLISHED") {
      notFound()
    }
    notFound()
  }

  if (!profileData) {
    notFound()
  }

  const baseUrl = await getBaseUrl()
  const profileUrl = `${baseUrl}/guest-profile/${encodeURIComponent(slug)}`
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicProfileClient
        profileData={profileData}
        showClaimBanner={showClaimBanner}
      />
    </>
  )
}
