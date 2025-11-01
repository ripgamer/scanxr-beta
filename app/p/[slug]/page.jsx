export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostView from "@/components/PostView";

export default async function PostPage({ params }) {
  const { slug } = await params;

  // Fetch post by slug with all relations
  const post = await prisma.post.findUnique({
    where: { slug: slug },
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
      },
      likes: true
    }
  });

  if (!post) {
    notFound();
  }

  // Check if post is public or belongs to current user
  if (post.visibility !== 'public') {
    // In production, you'd check if the current user owns this post
    notFound();
  }

  return <PostView post={post} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  });

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: `${post.title} - ScanXR`,
    description: post.caption || `View ${post.title} in 3D and AR`,
    openGraph: {
      title: post.title,
      description: post.caption,
      images: [post.thumbnailUrl],
    },
  };
}
