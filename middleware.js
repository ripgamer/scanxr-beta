import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/", // Home page public
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
  "/api/profile", // ✅ Make this route public
  "/p/(.*)", // ✅ Make all post pages public
  "/explore", // ✅ Make explore page public
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public access to single-segment top-level paths (potential user slugs)
  const path = req.nextUrl.pathname;
  const isSingleSegment = /^\/[^/]+$/.test(path);
  const blockedSlugs = new Set([
    "api",
    "sign-in",
    "sign-up",
    "profile",
    "create",
    "explore",
    "_next",
  ]);

  const isPublicUserSlug = isSingleSegment && !blockedSlugs.has(path.slice(1));

  if (!isPublicRoute(req) && !isPublicUserSlug) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
