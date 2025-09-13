export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ProfileHero } from "@/components/profile-hero";
import { GalleryPreview } from "@/components/gallery-preview";

export default async function ProfileBySlug({ params }) {
  const { slug } = await params;

  // Fetch profile using slug
  const profile = await prisma.profile.findUnique({
    where: { slug: slug }, // ✅ Using slug from Profile model
    include: { user: true }, // To get related user data
  });

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Profile not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 sm:mt-20 md:mt-28 flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 sm:px-6 space-y-4 sm:space-y-6">
        <ProfileHero profile={profile} />
        <GalleryPreview />
      </div>
    </div>
  );
}
