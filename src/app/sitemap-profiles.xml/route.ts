import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/integrations/supabase/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_URLS_PER_SITEMAP = 50_000
const DEFAULT_PAGE_SIZE = 5_000

function formatLastMod(dateString: string | null | undefined): string | null {
  if (!dateString) return null
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

async function getBaseUrl(): Promise<string> {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (explicit) return explicit.startsWith("http") ? explicit : `https://${explicit}`

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "https"
  if (!host) return "https://candidates.fractionalfirst.com"
  return `${proto}://${host}`
}

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://api.fractionalfirst.com"

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (required for sitemap generation)."
    )
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function buildUrlsetXml(
  baseUrl: string,
  rows: Array<{ anon_slug: string; updated_at: string }>
): string {
  const urls = rows
    .map((row) => {
      const loc = `${baseUrl}/profile/${encodeURIComponent(row.anon_slug)}`
      const lastmod = formatLastMod(row.updated_at)
      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n")
    })
    .join("\n")

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n")
}

function buildSitemapIndexXml(baseUrl: string, totalCount: number): string {
  const pageCount = Math.ceil(totalCount / MAX_URLS_PER_SITEMAP)
  const today = new Date().toISOString().slice(0, 10)

  const sitemaps = Array.from({ length: pageCount }, (_, i) => {
    const page = i + 1
    const loc = `${baseUrl}/sitemap-profiles/${page}.xml`
    return [
      "  <sitemap>",
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${escapeXml(today)}</lastmod>`,
      "  </sitemap>",
    ].join("\n")
  }).join("\n")

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemaps,
    "</sitemapindex>",
    "",
  ].join("\n")
}

export async function GET() {
  try {
    const baseUrl = await getBaseUrl()
    const supabase = getSupabaseAdmin()

    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("ispublished", true)
      .not("anon_slug", "is", null)
      .neq("anon_slug", "")

    if (error) throw error

    const totalCount = count ?? 0

    // If we exceed the sitemap URL limit, return an index that points to chunked sitemaps.
    if (totalCount > MAX_URLS_PER_SITEMAP) {
      const xml = buildSitemapIndexXml(baseUrl, totalCount)
      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      })
    }

    const pageSize = Math.min(DEFAULT_PAGE_SIZE, MAX_URLS_PER_SITEMAP)
    const rows: Array<{ anon_slug: string; updated_at: string }> = []

    for (let offset = 0; offset < totalCount; offset += pageSize) {
      const { data, error: pageError } = await supabase
        .from("profiles")
        // Cast needed because Supabase's type-level select parser
        // can get out of sync with generated types.
        .select("anon_slug, updated_at" as any)
        .eq("ispublished", true)
        .not("anon_slug", "is", null)
        .neq("anon_slug", "")
        .order("updated_at", { ascending: false })
        .range(offset, Math.min(offset + pageSize - 1, totalCount - 1))

      if (pageError) throw pageError
      if (data)
        rows.push(
          ...(data as unknown as Array<{ anon_slug: string; updated_at: string }>)
        )
    }

    const xml = buildUrlsetXml(baseUrl, rows)
    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (err) {
    console.error("Error generating profile sitemap:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}

