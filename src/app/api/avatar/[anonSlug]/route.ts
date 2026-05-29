import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import sharp from "sharp"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ anonSlug: string }> }
) {
  const { anonSlug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase.rpc("get_anon_profile", {
    anon_slug_param: anonSlug,
  })

  if (error) {
    console.error("Error fetching anon profile for avatar:", error)
    return new NextResponse(null, { status: 404, headers: CORS_HEADERS })
  }

  const profilePicture = data?.[0]?.anon_profile_data?.profilePicture as
    | string
    | null

  if (!profilePicture) {
    return new NextResponse(null, { status: 404, headers: CORS_HEADERS })
  }

  let imageBuffer: Buffer
  try {
    const response = await fetch(profilePicture, {
      cache: "no-store",
    })
    if (!response.ok) {
      console.error(
        `Failed to fetch image from ${profilePicture}: ${response.status}`
      )
      return new NextResponse(null, { status: 404, headers: CORS_HEADERS })
    }
    const arrayBuffer = await response.arrayBuffer()
    imageBuffer = Buffer.from(arrayBuffer)
  } catch (err) {
    console.error("Error fetching profile picture:", err)
    return new NextResponse(null, { status: 404, headers: CORS_HEADERS })
  }

  let blurredImage: Buffer
  try {
    blurredImage = await sharp(imageBuffer)
      .resize(200, 200, { fit: "cover" })
      .blur(5)
      .webp({ quality: 80 })
      .toBuffer()
  } catch (err) {
    console.error("Error processing image with sharp:", err)
    return new NextResponse(null, { status: 500, headers: CORS_HEADERS })
  }

  return new NextResponse(new Uint8Array(blurredImage), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  })
}
