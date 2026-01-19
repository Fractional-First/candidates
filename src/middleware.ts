import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

function getCanonicalOrigin(): string | null {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (!explicit) return null

  const url = explicit.startsWith("http") ? explicit : `https://${explicit}`
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const canonicalOrigin = getCanonicalOrigin()
  if (!canonicalOrigin) return NextResponse.next()

  const requestOrigin = request.nextUrl.origin
  if (requestOrigin === canonicalOrigin) return NextResponse.next()

  const redirectUrl = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    canonicalOrigin
  )
  return NextResponse.redirect(redirectUrl, 308)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

