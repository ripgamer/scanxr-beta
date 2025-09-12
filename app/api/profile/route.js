import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First check if user exists, if not create them
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found. Please sign up first.' }, { status: 404 });
    }

    // If user exists but no profile, return user data with null profile
    if (!user.profile) {
      return NextResponse.json({ 
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt
        },
        profile: null 
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      },
      profile: user.profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    
    if (error.code === 'P2024') {
      return NextResponse.json({ 
        error: 'Database connection timeout. Please try again.' 
      }, { status: 503 });
    }
    
    if (error.message.includes('FATAL: Tenant or user not found')) {
      return NextResponse.json({ 
        error: 'Database connection failed. Check your environment variables.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, username, avatarUrl } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (existingUser) {
      if (existingUser.profile) {
        return NextResponse.json({ error: 'Profile already exists' }, { status: 400 });
      }
      
      // User exists but no profile, create profile
      const profile = await prisma.profile.create({
        data: {
          userId: userId,
          slug: username || `user-${userId.slice(-8)}`,
          avatarUrl,
        },
      });

      return NextResponse.json({
        user: {
          id: existingUser.id,
          email: existingUser.email,
          username: existingUser.username,
          createdAt: existingUser.createdAt
        },
        profile
      });
    }

    // Create both user and profile
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: userId,
          email: email || '',
          username: username || `user-${userId.slice(-8)}`,
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: userId,
          slug: username || `user-${userId.slice(-8)}`,
          avatarUrl,
        },
      });

      return { user, profile };
    });

    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        createdAt: result.user.createdAt
      },
      profile: result.profile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { avatarUrl } = body;

    // Check if profile exists first
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: userId },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = await prisma.profile.update({
      where: {
        userId: userId,
      },
      data: {
        avatarUrl,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
  
} 