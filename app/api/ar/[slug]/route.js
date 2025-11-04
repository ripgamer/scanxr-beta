import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Redirect helper for QR codes / universal AR links.
// Usage: generate a QR that points to https://your-site.com/api/ar/{postSlug}
// This endpoint will detect the platform and redirect to:
//  - iOS: direct USDZ (.usdz) URL if available (Quick Look)
//  - Android: Scene Viewer link (https://arvr.google.com/scene-viewer/1.0?...)
//  - Fallback: public post page with ?ar=1 which will attempt programmatic AR or show the model

export async function GET(request, { params }) {
  const { slug } = params || {}

  // Find post and relevant URLs
  let post
  try {
    post = await prisma.post.findUnique({
      where: { slug },
      select: {
        modelUrl: true,
        thumbnailUrl: true,
        iosSrc: true // optional USDZ link stored on the post
      }
    })
  } catch (err) {
    console.error('AR redirect: db error', err)
  }

  const origin = process.env.DIRECT_URL || (request.nextUrl && request.nextUrl.origin) || ''

  // If post missing, fall back to post page (no-op)
  if (!post) {
    const fallback = origin ? `${origin}/p/${slug}` : `/p/${slug}`
    return NextResponse.redirect(fallback)
  }

  const ua = request.headers.get('user-agent') || ''
  const isIOS = /iPhone|iPad|iPod/.test(ua) && !/Android/.test(ua)
  const isAndroid = /Android/.test(ua)

  // iOS Quick Look: prefer direct USDZ if available. Opening a .usdz URL in Safari will invoke Quick Look.
  if (isIOS && post.iosSrc) {
    return NextResponse.redirect(post.iosSrc)
  }

  // Android: Scene Viewer deep link. Most modern Chrome on Android will handle this URL and launch Scene Viewer.
  if (isAndroid && post.modelUrl) {
    const scene = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(post.modelUrl)}&mode=ar_preferred`
    return NextResponse.redirect(scene)
  }

  // Generic fallback: redirect to public post page which can attempt to auto-open AR (e.g. ?ar=1)
  const fallbackUrl = origin ? `${origin}/p/${slug}?ar=1` : `/p/${slug}?ar=1`
  return NextResponse.redirect(fallbackUrl)
}
