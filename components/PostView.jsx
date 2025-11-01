"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PostView({ post }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);

  useEffect(() => {
    // Load model-viewer script
    const loadModelViewer = () => {
      if (typeof window !== "undefined" && !window.customElements?.get("model-viewer")) {
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
        script.onload = () => setIsModelViewerLoaded(true);
        document.head.appendChild(script);
      } else {
        setIsModelViewerLoaded(true);
      }
    };
    loadModelViewer();
  }, []);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.caption || `Check out ${post.title} on ScanXR`,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 sm:pt-20 sm:pb-24 md:pt-24 md:pb-8 lg:pt-24 lg:pb-8">
      {/* Mobile Back Button - Top Left */}
      <div className="lg:hidden fixed top-16 left-2 z-50 sm:top-20 sm:left-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()} 
          className="bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background/90"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden lg:block max-w-6xl mx-auto px-4 mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 bg-card rounded-lg overflow-hidden border border-border shadow-lg">
          
          {/* Left: 3D Model Viewer */}
          <div className="flex-1 bg-black flex items-center justify-center relative lg:rounded-l-lg h-[45vh] sm:h-[50vh] lg:h-[calc(100vh-12rem)]">
            {isModelViewerLoaded ? (
              <model-viewer
                src={post.modelUrl}
                alt={post.title}
                camera-controls
                auto-rotate
                environment-image="neutral"
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                ar-placement="floor"
                style={{
                  width: "100%",
                  height: "100%",
                  "--poster-color": "transparent",
                }}
              >
                <style>
                  {`
                    model-viewer::part(default-progress-mask) {
                      display: none;
                    }
                    model-viewer::part(default-progress-bar) {
                      display: none;
                    }
                  `}
                </style>
              </model-viewer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Right: Post Details */}
          <div className="w-full lg:w-96 flex flex-col bg-card max-h-[50vh] sm:max-h-[45vh] lg:max-h-[calc(100vh-12rem)]">
            {/* User Info */}
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <Link 
                  href={`/${post.user.profile?.slug || post.user.username}`}
                  className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <img 
                      src={post.user.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`} 
                      alt={post.user.username}
                    />
                  </Avatar>
                  <div>
                    <p className="font-semibold text-xs sm:text-sm">{post.user.username}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Post Caption & Details - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 custom-scrollbar">
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2">{post.title}</h1>
                {post.caption && (
                  <p className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap line-clamp-4 sm:line-clamp-6 lg:line-clamp-none">
                    {post.caption}
                  </p>
                )}
              </div>

              {/* Tags */}
              {post.postTags && post.postTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {post.postTags.map((postTag) => (
                    <span
                      key={postTag.id}
                      className="text-[10px] sm:text-xs bg-primary/10 text-primary px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
                    >
                      #{postTag.tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>

            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: hsl(var(--muted-foreground) / 0.3);
                border-radius: 3px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: hsl(var(--muted-foreground) / 0.5);
              }
            `}</style>

            {/* Actions Bar - Compact */}
            <div className="border-t border-border p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`p-1.5 sm:p-2 h-8 w-8 sm:h-10 sm:w-10 ${isLiked ? "text-red-500" : ""}`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1.5 sm:p-2 h-8 w-8 sm:h-10 sm:w-10">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare} className="p-1.5 sm:p-2 h-8 w-8 sm:h-10 sm:w-10">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-[10px] sm:text-xs lg:text-sm">{likes} likes</p>
                </div>
              </div>

              {/* View in AR Button */}
              <Button className="w-full text-xs sm:text-sm" variant="default" size="sm">
                View in AR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
