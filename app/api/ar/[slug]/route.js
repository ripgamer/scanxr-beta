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

  // Simple mode: two choices
  // - Web (no params): redirect to the public post page `/p/{slug}`
  // - AR (pass ?ar=1): detect platform and redirect to a native AR viewer (USDZ for iOS, Scene Viewer for Android)
  const urlObj = new URL(request.url)
  const sp = urlObj.searchParams
  const wantAR = sp.get('ar') === '1' || sp.get('ar') === 'true' || sp.has('ar')

  // If not requesting AR, just send the user to the web post page
  if (!wantAR) {
    const webUrl = origin ? `${origin}/p/${slug}` : `/p/${slug}`
    return NextResponse.redirect(webUrl)
  }

  // Build Scene Viewer URL helper
  const buildSceneUrl = (gltf) => `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(gltf)}&mode=ar_preferred`

  // Platform detection
  const isIOS = /iPhone|iPad|iPod/.test(ua) && !/Android/.test(ua)
  const isAndroid = /Android/.test(ua)

  // iOS: Quick Look via USDZ
  if (isIOS && post.iosSrc) {
    return NextResponse.redirect(post.iosSrc)
  }

  // Android: Scene Viewer via glTF/GLB
  if (isAndroid && post.modelUrl) {
    const scene = buildSceneUrl(post.modelUrl)
    return NextResponse.redirect(scene)
  }

  // If platform detection failed or required asset missing, fallback to public page (web)
  const fallback = origin ? `${origin}/p/${slug}` : `/p/${slug}`
  return NextResponse.redirect(fallback)
}
