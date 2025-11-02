export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ProfileHero } from "@/components/profile-hero";
import { GalleryPreview } from "@/components/gallery-preview";

export default async function ProfileBySlug({ params }) {
  const { slug } = await params;

  // Fetch profile using slug
  const profile = await prisma.profile.findUnique({
    where: { slug: slug }, // ✅ Using slug from Profile model
    include: { 
      user: {
        include: {
          posts: {
            where: {
              visibility: 'public' // Only show public posts
            },
            orderBy: {
              createdAt: 'desc' // Newest first
            },
            include: {
              postTags: {
                include: {
                  tag: true
                }
              }
            }
          }
        }
      }
    },
  });

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Profile not found</h1>
      </div>
    );
  }

  // Extract posts from the user
  const posts = profile.user.posts || [];

  return (
    <div className="min-h-screen pt-20 pb-32 sm:pt-20 sm:pb-32 md:pt-24 md:pb-28 lg:pt-24 lg:pb-8 flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 sm:px-6 space-y-4 sm:space-y-6">
        <ProfileHero profile={profile} />
        <GalleryPreview posts={posts} userId={profile.userId} />
      </div>
    </div>
  );
}
