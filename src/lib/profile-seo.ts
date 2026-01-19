import type { ProfileData } from "@/types/profile"

export const FRACTIONAL_FIRST_SITE_URL = "https://fractionalfirst.com"

function truncate(value: string, maxLen: number): string {
  const trimmed = value.trim().replace(/\s+/g, " ")
  if (trimmed.length <= maxLen) return trimmed
  return `${trimmed.slice(0, Math.max(0, maxLen - 1)).trimEnd()}…`
}

function uniqNonEmpty(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of values) {
    const v = (raw ?? "").trim()
    if (!v) continue
    const key = v.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(v)
  }
  return out
}

export function getProfileDisplayName(profile: ProfileData): string {
  return (
    profile.name?.trim() ||
    profile.role?.trim() ||
    "Anonymous Fractional Executive"
  )
}

export function buildProfileTitle(profile: ProfileData): string {
  const name = getProfileDisplayName(profile)
  // Keep it simple + scannable; role can be long/noisy.
  return `${name} | Fractional First`
}

export function buildProfileDescription(profile: ProfileData): string {
  const name = getProfileDisplayName(profile)
  const summary = profile.summary?.trim()

  if (summary) return truncate(summary, 160)

  const base = `Anonymous profile of ${name} available for fractional executive roles.`

  return truncate(base, 160)
}

export function buildProfileStructuredData(args: {
  baseUrl: string
  profileUrl: string
  profile: ProfileData
}) {
  const { baseUrl, profileUrl, profile } = args

  const profileName = getProfileDisplayName(profile)
  const jobTitle = uniqNonEmpty([profile.role]).slice(0, 10)

  const knowsAbout = uniqNonEmpty([
    ...(profile.focus_areas ?? []),
    ...(profile.industries ?? []),
    ...(profile.stage_focus ?? []),
  ]).slice(0, 25)

  const areaServed = uniqNonEmpty(profile.geographical_coverage ?? [])
    .slice(0, 25)
    .map((name) => ({ "@type": "Place", name }))

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": profileUrl,
    url: profileUrl,
    name: profileName,
    description: buildProfileDescription(profile),
    isPartOf: {
      "@type": "WebSite",
      name: "Fractional First",
      url: FRACTIONAL_FIRST_SITE_URL,
    },
    about: {
      "@type": "Person",
      name: profileName,
      ...(jobTitle.length ? { jobTitle } : {}),
      ...(profile.summary
        ? { description: truncate(profile.summary, 280) }
        : {}),
      ...(knowsAbout.length ? { knowsAbout } : {}),
      ...(areaServed.length ? { areaServed } : {}),
    },
  }
}

