export const dynamic = "force-dynamic";

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export default async function ProfileRedirectPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Find or create the user and profile, then redirect to /[slug]
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    // If the application expects a user to exist before profile creation,
    // you can choose to redirect to onboarding instead. Here we create one.
    user = await prisma.user.create({
      data: {
        id: userId,
        email: '',
        username: `user-${userId.slice(-8)}`,
      },
      include: { profile: true },
    });
  }

  let profile = user.profile;

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        userId: userId,
        slug: user.username || `user-${userId.slice(-8)}`,
      },
    });
  }

  redirect(`/${profile.slug}`);
}


