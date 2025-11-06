import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, username, bio, avatarUrl } = body

    // Verify the user is updating their own profile
    if (clerkUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      })

      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: 'This username is already taken' }, { status: 400 })
      }

      // Also check if slug (same as username) is taken
      const existingProfile = await prisma.profile.findUnique({
        where: { slug: username }
      })

      if (existingProfile && existingProfile.userId !== userId) {
        return NextResponse.json({ error: 'This username is already taken' }, { status: 400 })
      }
    }

    // Update user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          username: username || undefined,
        }
      })

      // Update profile (slug is same as username)
      const updatedProfile = await tx.profile.update({
        where: { userId },
        data: {
          slug: username || undefined,
          bio: bio !== undefined ? bio : undefined,
          avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
        },
        include: {
          user: true
        }
      })

      return updatedProfile
    })

    return NextResponse.json({
      success: true,
      profile: result
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
