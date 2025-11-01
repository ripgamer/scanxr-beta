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
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-lg">Post</h1>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto pt-16 lg:pt-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 bg-card lg:rounded-lg overflow-hidden lg:border border-border min-h-[calc(100vh-8rem)]">
          
          {/* Left: 3D Model Viewer */}
          <div className="flex-1 bg-black flex items-center justify-center relative lg:rounded-l-lg">
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
                  minHeight: "60vh",
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
              <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Right: Post Details */}
          <div className="w-full lg:w-96 flex flex-col bg-card">
            {/* User Info */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <Link 
                  href={`/${post.user.profile?.slug || post.user.username}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="w-10 h-10">
                    <img 
                      src={post.user.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`} 
                      alt={post.user.username}
                    />
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{post.user.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Post Caption & Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h1 className="text-xl font-bold mb-2">{post.title}</h1>
                {post.caption && (
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {post.caption}
                  </p>
                )}
              </div>

              {/* Tags */}
              {post.postTags && post.postTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.postTags.map((postTag) => (
                    <span
                      key={postTag.id}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
                    >
                      #{postTag.tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="border-t border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    className={isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="text-sm">
                <p className="font-semibold">{likes} likes</p>
              </div>

              {/* View in AR Button */}
              <Button className="w-full" variant="default">
                View in AR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
