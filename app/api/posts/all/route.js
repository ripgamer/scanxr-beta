// app/api/posts/all/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all public posts with user and tag information
    const posts = await prisma.post.findMany({
      where: {
        visibility: 'public'
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        postTags: {
          include: {
            tag: true
          }
        }
      },
      take: 50 // Limit to 50 posts for performance
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
