'use client';

import { Button } from "@/components/ui/button"
import { ArrowRight, Grid3X3 } from "lucide-react"
import { useEffect, useState } from 'react'
import PostModal from './PostModal'

// Sample posts data with hardcoded content
const samplePosts = [
  {
    id: 1,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    title: "Space Explorer",
    username: "space_artist",
    caption: "Just finished this amazing astronaut model! The details are incredible. #space #3D #astronaut #AR",
    likes: 1247,
    location: "Mars Colony",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    modelUrl: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
    title: "First Man on Moon",
    username: "history_3d",
    caption: "Recreating history with 3D! Neil Armstrong's iconic moment. #history #moon #space #3D",
    likes: 892,
    location: "Houston, TX",
    timestamp: "4 hours ago"
  },
  {
    id: 3,
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    title: "Friendly Robot",
    username: "robot_maker",
    caption: "Meet my latest creation - an expressive robot with personality! 🤖 #robot #AI #3D #tech",
    likes: 2156,
    location: "Silicon Valley",
    timestamp: "6 hours ago"
  },
  {
    id: 4,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Shishkebab.glb",
    title: "Medieval Weapon",
    username: "medieval_art",
    caption: "Crafted this detailed shishkebab from ancient times. Perfect for AR battles! ⚔️ #medieval #weapon #3D",
    likes: 743,
    location: "Medieval Times",
    timestamp: "1 day ago"
  },
  {
    id: 5,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    title: "Space Mission",
    username: "cosmic_creator",
    caption: "Another space adventure begins! This astronaut is ready for the next mission. 🚀 #space #mission #3D",
    likes: 1834,
    location: "International Space Station",
    timestamp: "1 day ago"
  },
  {
    id: 6,
    modelUrl: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
    title: "Moon Landing",
    username: "space_enthusiast",
    caption: "One small step for man, one giant leap for 3D modeling! 🌙 #moon #landing #space #3D",
    likes: 967,
    location: "Cape Canaveral",
    timestamp: "2 days ago"
  },
  {
    id: 7,
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    title: "AI Companion",
    username: "future_tech",
    caption: "Building the future, one robot at a time! This AI companion is ready to help. 🤖 #AI #future #3D",
    likes: 1456,
    location: "Future Labs",
    timestamp: "2 days ago"
  },
  {
    id: 8,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Shishkebab.glb",
    title: "Warrior's Blade",
    username: "fantasy_artist",
    caption: "Forged in the fires of imagination! This blade tells a thousand stories. ⚔️ #fantasy #warrior #3D",
    likes: 1123,
    location: "Fantasy Realm",
    timestamp: "3 days ago"
  },
  {
    id: 9,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    title: "Cosmic Journey",
    username: "stellar_dreams",
    caption: "Every astronaut has a story. This one is about reaching for the stars! ⭐ #cosmic #journey #3D",
    likes: 2034,
    location: "Stellar Observatory",
    timestamp: "3 days ago"
  }
]

const ModelViewerThumbnail = ({ gltfUrl, alt = '3D model', index, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const id = 'model-viewer-cdn';
    
    // Load script only once
    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      script.id = id;
      script.onload = () => {
        // Delay showing models to improve performance
        setTimeout(() => setShowModel(true), index * 50);
      };
      script.onerror = () => {
        setHasError(true);
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      // Script already loaded, show model after delay
      setTimeout(() => setShowModel(true), index * 50);
    }
  }, [index]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer group"
      onClick={onClick}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xs">3D</span>
            </div>
            <p className="text-xs text-muted-foreground">Model Preview</p>
          </div>
        </div>
      )}
      
      {showModel && !hasError && (
        <model-viewer
          src={gltfUrl}
          alt={alt}
          camera-controls
          auto-rotate
          environment-image="neutral"
          ar="false"
          ar-modes=""
          disable-ar
          style={{ 
            width: '100%', 
            height: '100%',
            '--poster-color': 'transparent'
          }}
          onLoad={handleLoad}
          onError={handleError}
        >
          <style>
            {`
              model-viewer::part(default-progress-mask) {
                display: none;
              }
              model-viewer::part(default-progress-bar) {
                display: none;
              }
              model-viewer::part(ar-button) {
                display: none !important;
              }
              model-viewer::part(ar-button):after {
                display: none !important;
              }
            `}
          </style>
        </model-viewer>
      )}
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="bg-white/90 dark:bg-black/90 rounded-full p-2">
          <span className="text-xs font-medium">View Post</span>
        </div>
      </div>
    </div>
  );
};

export function GalleryPreview({ posts = [], userId }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Show message if no posts
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Posts</h3>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Grid3X3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-sm text-muted-foreground">
            This user hasn't shared any 3D models yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Posts</h3>
            <span className="text-sm text-muted-foreground">({posts.length})</span>
          </div>
          {posts.length > 9 && (
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {posts.slice(0, 9).map((post, index) => (
            <div key={post.id} className="aspect-square rounded-lg overflow-hidden bg-muted group">
              <ModelViewerThumbnail
                gltfUrl={post.modelUrl}
                alt={`${post.title} 3D Model`}
                index={index}
                onClick={() => handlePostClick(post)}
              />
            </div>
          ))}
        </div>
      </div>

      <PostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={selectedPost}
      />
    </>
  )
}
