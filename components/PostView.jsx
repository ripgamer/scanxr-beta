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
  const [modelError, setModelError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

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

    // Attach listener for model-viewer errors (handle CORS / load failures)
    // Once model-viewer script is loaded we attach native load/error listeners
    const attachListeners = () => {
      try {
        const mv = typeof window !== 'undefined' ? document.querySelector('model-viewer') : null;
        if (!mv) return;

        const onLoad = () => {
          setModelError(false);
        };

        const onError = () => {
          setModelError(true);
        };

        mv.addEventListener('load', onLoad);
        mv.addEventListener('error', onError);

        // Clean up
        return () => {
          try {
            mv.removeEventListener('load', onLoad);
            mv.removeEventListener('error', onError);
          } catch (e) {}
        };
      } catch (e) {
        // ignore
      }
    };

    // Try attaching immediately and also after short delays (helps on slow hydration)
    const timers = [];
    timers.push(setTimeout(attachListeners, 200));
    timers.push(setTimeout(attachListeners, 800));
    timers.push(setTimeout(attachListeners, 1600));

    return () => timers.forEach((t) => clearTimeout(t));
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
  <div className="page-container bg-background">
      {/* Mobile Back Button - Top Left */}
      <div className="lg:hidden fixed top-[68px] left-2 z-50 sm:top-20 sm:left-4">
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
      <div className="max-w-6xl mx-auto px-0 sm:px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 bg-card sm:rounded-lg overflow-hidden border-0 sm:border border-border sm:shadow-lg">
          
          {/* Left: 3D Model Viewer */}
          <div className="flex-1 bg-black flex items-center justify-center relative lg:rounded-l-lg min-h-[40vh] sm:min-h-[45vh] md:min-h-[50vh] lg:h-[calc(100vh-12rem)]"> 
            {isModelViewerLoaded && post.modelUrl && !modelError ? (
              <div className="w-full h-full relative">
                    <model-viewer
                      key={refreshKey}
                      id="post-model-viewer"
                      className="w-full h-full"
                      src={post.modelUrl}
                      poster={post.thumbnailUrl || ''}
                      alt={post.title}
                      camera-controls
                      auto-rotate
                      environment-image="neutral"
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      ar-scale="auto"
                      ar-placement="floor"
                      loading="eager"
                      reveal="auto"
                      style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '220px',
                        maxHeight: '80vh',
                        display: 'block',
                        position: 'relative',
                        backgroundColor: 'transparent',
                      }}
                    >
                  <style>
                    {`
                      model-viewer { width: 100%; height: 100%; display:block; }
                      model-viewer::part(default-progress-mask) { display: block; }
                      model-viewer::part(default-progress-bar) { display: block; background-color: rgba(255,255,255,0.8); }
                    `}
                  </style>
                </model-viewer>
              </div>
            ) : (
              // If model-viewer not loaded yet, show thumbnail (if available) or loader
              post.thumbnailUrl ? (
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-full object-contain"
                  style={{ minHeight: '220px', maxHeight: '80vh' }}
                />
              ) : (
                <div className="flex items-center justify-center h-40 sm:h-48">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )
            )}

            {/* If there was a model error show a small overlay with a reload control */}
            {modelError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-40 p-4">
                <p className="text-sm text-white mb-3">Failed to load model. This can happen on mobile or slow networks.</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setRefreshKey(Date.now())}>
                    Reload model
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { /* fallback: open image in new tab */ window.open(post.thumbnailUrl || post.modelUrl, '_blank'); }}>
                    Open fallback
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Post Details */}
          <div className="w-full lg:w-96 flex flex-col bg-card lg:max-h-[calc(100vh-12rem)]">
            {/* User Info */}
            <div className="p-2 sm:p-3 md:p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <Link 
                  href={`/${post.user.profile?.slug || post.user.username}`}
                  className="flex items-center gap-1.5 sm:gap-2 md:gap-3 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0">
                    <img 
                      src={post.user.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`} 
                      alt={post.user.username}
                    />
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-[11px] sm:text-xs md:text-sm truncate">{post.user.username}</p>
                    <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0">
                  <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>

            {/* Post Caption & Details - Scrollable */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-1.5 sm:space-y-2 md:space-y-3 custom-scrollbar">
              <div>
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1 md:mb-2">{post.title}</h1>
                {post.caption && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-foreground/90 whitespace-pre-wrap line-clamp-2 sm:line-clamp-3 md:line-clamp-4 lg:line-clamp-none">
                    {post.caption}
                  </p>
                )}
              </div>

              {/* Tags */}
              {post.postTags && post.postTags.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                  {post.postTags.map((postTag) => (
                    <span
                      key={postTag.id}
                      className="text-[9px] sm:text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.5 md:py-1 rounded-full"
                    >
                      #{postTag.tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">
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
            <div className="border-t border-border p-1.5 sm:p-2 md:p-3 lg:p-4 space-y-1.5 sm:space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`p-1 sm:p-1.5 md:p-2 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 ${isLiked ? "text-red-500" : ""}`}
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 sm:p-1.5 md:p-2 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10">
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare} className="p-1 sm:p-1.5 md:p-2 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10">
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-[9px] sm:text-[10px] md:text-xs lg:text-sm">{likes} likes</p>
                </div>
              </div>

              {/* View in AR Button */}
              <Button className="w-full text-[11px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10" variant="default" size="sm">
                View in AR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
