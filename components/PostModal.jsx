"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react"
import { useState, useEffect } from "react"

const PostModal = ({ isOpen, onClose, post }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(post?.likes || 0)
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false)

  useEffect(() => {
    // Ensure model-viewer script is loaded
    const loadModelViewer = () => {
      if (typeof window !== "undefined" && !window.customElements?.get("model-viewer")) {
        const script = document.createElement("script")
        script.type = "module"
        script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        script.onload = () => setIsModelViewerLoaded(true)
        document.head.appendChild(script)
      } else {
        setIsModelViewerLoaded(true)
      }
    }

    if (isOpen) {
      loadModelViewer()
    }
  }, [isOpen])

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setIsLiked(!isLiked)
  }

  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs w-[95vw] h-[85vh] p-0 overflow-hidden mx-auto my-4 sm:max-w-md sm:w-full sm:h-[80vh] sm:my-8 md:max-w-2xl md:h-[75vh] lg:max-w-3xl lg:h-[70vh]">
        <div className="flex flex-col md:flex-row h-full">
          {/* 3D Model Section */}
          <div className="flex-1 bg-black flex items-center justify-center relative h-[45vh] sm:h-[50vh] md:h-full md:min-h-0">
            {isModelViewerLoaded ? (
              <model-viewer
                src={post.modelUrl}
                alt={post.title}
                camera-controls
                auto-rotate
                environment-image="neutral"
                ar
                ar-modes="webxr scene-viewer"
                ar-scale="auto"
                ar-placement="floor"
                ios-src=""
                quick-look-browsers="safari chrome"
                style={{
                  width: "100%",
                  height: "100%",
                  "--poster-color": "transparent",
                }}
                onLoad={() => {
                  console.log("Model loaded, checking AR support...")
                  const modelViewer = document.querySelector("model-viewer")
                  if (modelViewer) {
                    console.log("AR supported:", modelViewer.canActivateAR)
                    console.log("AR modes:", modelViewer.arModes)
                  }
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
                    model-viewer::part(ar-button) {
                      display: block !important;
                      opacity: 1 !important;
                    }
                  `}
                </style>
              </model-viewer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Post Details Section */}
          <div className="w-full md:w-72 lg:w-80 border-t md:border-t-0 md:border-l border-border flex flex-col h-[40vh] sm:h-[30vh] md:h-full overflow-hidden">
            {/* Header */}
            <DialogHeader className="p-3 sm:p-4 border-b border-border shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {post.username?.charAt(0) || "U"}
                  </div>
                  <div>
                    <DialogTitle className="text-sm sm:text-base font-semibold leading-tight">
                      {post.username || "username"}
                    </DialogTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground">{post.location || "Location"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Post Content - Scrollable with optimized spacing */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {/* Caption */}
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {post.caption || "Amazing 3D model! Check out this incredible creation. #3D #AR #ScanXR"}
                  </p>
                </div>

                {/* Likes - More compact for mobile */}
                <div className="text-center pt-1">
                  <p className="text-sm sm:text-base font-medium">{likes.toLocaleString()} likes</p>
                </div>

                {/* Additional metadata if available */}
                {post.date && (
                  <div className="text-center pt-1">
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions - Fixed at bottom with optimized spacing */}
            <div className="border-t border-border py-2 px-2 sm:py-3 sm:px-4 shrink-0">
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className={`h-8 w-8 sm:h-10 sm:w-10 hover:scale-110 transition-transform ${
                    isLiked ? "text-red-500" : "text-foreground"
                  }`}
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10 hover:scale-110 transition-transform"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10 hover:scale-110 transition-transform"
                >
                  <Share className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostModal
