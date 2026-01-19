import type { MetadataRoute } from "next"
import { DEFAULT_PUBLIC_SITE_URL } from "@/lib/site"

function getCanonicalBaseUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (!explicit) return DEFAULT_PUBLIC_SITE_URL
  return explicit.startsWith("http") ? explicit : `https://${explicit}`
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalBaseUrl().replace(/\/+$/, "")

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap-profiles.xml`,
  }
}

