import { headers } from "next/headers"

export const DEFAULT_PUBLIC_SITE_URL = "https://candidates.fractionalfirst.com"

/**
 * Returns the public-facing base URL for canonical links, sitemap URLs, etc.
 * Prefers explicit env vars, falls back to request headers.
 */
export async function getBaseUrl(): Promise<string> {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (explicit) {
    return explicit.startsWith("http") ? explicit : `https://${explicit}`
  }

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "https"
  if (!host) return DEFAULT_PUBLIC_SITE_URL
  return `${proto}://${host}`
}

