'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { useRouter } from 'next/navigation';
import { FaQrcode, FaVrCardboard, FaHeart } from 'react-icons/fa';
import ImageModal from '@/components/ui/ImageModal';
import dynamic from 'next/dynamic';

// Dynamically import model-viewer to avoid SSR issues
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse" />
});

export default function ExplorePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, glbUrl: '', title: '' });

  // Fetch posts from database
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/posts/all');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server did not return JSON");
        }
        
        const data = await response.json();
        
        if (data.posts) {
          setPosts(data.posts);
        } else {
          console.error('No posts found in response');
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleImageClick = (post) => {
    // Navigate to post detail page
    router.push(`/p/${post.slug}`);
  };

  const handleQrClick = (e, slug) => {
    e.stopPropagation();
    // Generate QR URL for the post
    const postUrl = `${window.location.origin}/p/${slug}`;
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(postUrl)}`, '_blank');
  };

  const handleArClick = (e, modelUrl) => {
    e.stopPropagation();
    // Navigate to AR view with model URL
    router.push(`/ar?model=${encodeURIComponent(modelUrl)}`);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="min-h-screen w-full px-4 py-20 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl text-muted-foreground mb-2">No posts found</p>
            <p className="text-sm text-muted-foreground">Be the first to create a post!</p>
          </div>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleImageClick(post)}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ease-in-out cursor-pointer mb-4 bg-card"
            >
              {/* 3D Model Viewer */}
              <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <ModelViewer 
                  src={post.modelUrl} 
                  alt={post.title}
                  poster={post.thumbnailUrl}
                  className="w-full h-full"
                />
              </div>

              {/* Overlay with post info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{post.title}</h3>
                  {post.caption && (
                    <p className="text-white/80 text-sm line-clamp-2 mb-2">{post.caption}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={post.user?.profile?.avatarUrl || '/api/placeholder'} 
                        alt={post.user?.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-white/90 text-sm">@{post.user?.username}</span>
                    </div>
                    {post.likesCount > 0 && (
                      <div className="flex items-center gap-1 text-white/90">
                        <FaHeart className="text-red-500" />
                        <span className="text-sm">{post.likesCount}</span>
                      </div>
                    )}
                  </div>
                  {post.postTags && post.postTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.postTags.slice(0, 3).map((pt) => (
                        <span 
                          key={pt.tag.id}
                          className="text-xs px-2 py-1 rounded-full bg-white/20 text-white"
                        >
                          #{pt.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Icons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {/* AR Icon */}
                <button
                  onClick={(e) => handleArClick(e, post.modelUrl)}
                  className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                  title="View in AR"
                >
                  <FaVrCardboard className="text-gray-800 text-lg" />
                </button>

                {/* QR Icon */}
                <button
                  onClick={(e) => handleQrClick(e, post.slug)}
                  className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                  title="Generate QR Code"
                >
                  <FaQrcode className="text-gray-800 text-lg" />
                </button>
              </div>
            </motion.div>
          ))}
        </Masonry>
      )}
    </div>
  );
}
