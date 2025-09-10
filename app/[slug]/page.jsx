export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function ProfileBySlug({ params }) {
  const { slug } = params || {};

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
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-3xl font-bold">{profile.user.username}</h1>
      <p className="text-lg text-gray-600">{profile.bio || "No bio available"}</p>
    </div>
  );
}
