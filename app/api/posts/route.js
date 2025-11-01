// app/api/posts/route.js
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { upload3DModel, uploadThumbnail } from '@/lib/supabase-storage';
import { ensureUserExists } from '@/lib/user-utils';

// Generate a slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Generate random short ID (like Instagram)
function generateShortId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate unique slug with random ID
async function generateUniqueSlug(baseTitle, userId) {
  // Create base slug from title (limit to 50 chars)
  const baseSlug = generateSlug(baseTitle).substring(0, 50);
  
  // Add random short ID to make it unique (like Instagram's format)
  let slug = `${baseSlug}-${generateShortId(8)}`;
  
  // Ensure uniqueness (very unlikely to collide, but just in case)
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${generateShortId(8)}`;
  }
  
  return slug;
}

export async function POST(request) {
  try {
    // Check if user is authenticated
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type');
    let title, description, tags, visibility, modelUrl, thumbnailUrl, modelFile, thumbnailFile;

    if (contentType?.includes('application/json')) {
      // New flow: Direct upload with pre-uploaded URLs
      const body = await request.json();
      title = body.title;
      description = body.description;
      tags = body.tags;
      visibility = body.visibility;
      modelUrl = body.modelUrl;
      thumbnailUrl = body.thumbnailUrl || '/api/placeholder';
    } else {
      // Legacy flow: File upload through API
      const formData = await request.formData();
      title = formData.get('title');
      description = formData.get('description');
      tags = formData.get('tags');
      visibility = formData.get('visibility');
      modelFile = formData.get('modelFile');
      thumbnailFile = formData.get('thumbnailFile');

      // Validate required fields for legacy flow
      if (!modelFile) {
        return NextResponse.json(
          { error: 'Model file is required' },
          { status: 400 }
        );
      }

      // Ensure user exists in our database
      const dbUser = await ensureUserExists(user);

      // Upload files to Supabase with validation
      try {
        // Upload 3D model
        modelUrl = await upload3DModel(modelFile, dbUser.id);

        // Upload thumbnail if provided
        if (thumbnailFile) {
          thumbnailUrl = await uploadThumbnail(thumbnailFile, dbUser.id);
        } else {
          thumbnailUrl = '/api/placeholder';
        }
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return NextResponse.json(
          { error: `Upload failed: ${uploadError.message}` },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!title || !modelUrl) {
      return NextResponse.json(
        { error: 'Title and model URL are required' },
        { status: 400 }
      );
    }

    // Ensure user exists in our database
    const dbUser = await ensureUserExists(user);

    // Generate unique slug
    const slug = await generateUniqueSlug(title, dbUser.id);

    // Process tags
    const tagsList = tags ? tags.split(',').filter(tag => tag.trim()) : [];
    const processedTags = [];

    for (const tagName of tagsList) {
      const trimmedTag = tagName.trim().toLowerCase();
      if (trimmedTag) {
        // Generate slug for tag
        const tagSlug = trimmedTag.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
        
        // Find or create tag
        let tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: trimmedTag,
              slug: tagSlug,
              postCount: 1
            }
          });
        } else {
          // Increment post count
          await prisma.tag.update({
            where: { id: tag.id },
            data: { postCount: { increment: 1 } }
          });
        }
        processedTags.push(tag);
      }
    }

    // Create post in database
    const post = await prisma.post.create({
      data: {
        userId: dbUser.id,
        title: title.trim(),
        caption: description?.trim() || null,
        modelUrl,
        thumbnailUrl,
        slug,
        visibility: visibility || 'public',
        postTags: {
          create: processedTags.map(tag => ({
            tagId: tag.id
          }))
        }
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            profile: {
              select: {
                slug: true
              }
            }
          }
        },
        postTags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        caption: post.caption,
        modelUrl: post.modelUrl,
        thumbnailUrl: post.thumbnailUrl,
        slug: post.slug,
        visibility: post.visibility,
        createdAt: post.createdAt,
        tags: post.postTags.map(pt => ({
          id: pt.tag.id,
          name: pt.tag.name,
          slug: pt.tag.slug,
          color: pt.tag.color
        })),
        user: post.user
      }
    });

  } catch (error) {
    console.error('Error creating post:', error);
    
    // Handle specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;

    // Build where clause
    const where = {};
    if (userId) {
      where.userId = userId;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            profile: {
              select: {
                avatarUrl: true,
                slug: true
              }
            }
          }
        },
        postTags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return NextResponse.json({
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        caption: post.caption,
        modelUrl: post.modelUrl,
        thumbnailUrl: post.thumbnailUrl,
        slug: post.slug,
        visibility: post.visibility,
        createdAt: post.createdAt,
        likesCount: post._count.likes,
        tags: post.postTags.map(pt => ({
          id: pt.tag.id,
          name: pt.tag.name,
          slug: pt.tag.slug,
          color: pt.tag.color
        })),
        user: post.user
      }))
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}