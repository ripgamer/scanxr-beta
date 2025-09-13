'use client';

import { Button } from "@/components/ui/button"
import { ArrowRight, Grid3X3 } from "lucide-react"
import { useEffect, useState } from 'react'

// Sample GLB URLs for demonstration - using proven reliable models
const sampleModels = [
  // Reliable modelviewer.dev models (tested working)
  "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
  "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
  "https://modelviewer.dev/shared-assets/models/Shishkebab.glb",
  // Repeat reliable models to fill grid
  "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
  "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
  "https://modelviewer.dev/shared-assets/models/Shishkebab.glb",
  "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
]

const ModelViewerThumbnail = ({ gltfUrl, alt = '3D model', index }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModel, setShowModel] = useState(false);

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
        setTimeout(() => setShowModel(true), index * 100);
      };
      document.head.appendChild(script);
    } else {
      // Script already loaded, show model after delay
      setTimeout(() => setShowModel(true), index * 100);
    }
  }, [index]);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {showModel && (
        <model-viewer
          src={gltfUrl}
          alt={alt}
          camera-controls
          auto-rotate
          environment-image="neutral"
          style={{ width: '100%', height: '100%' }}
          onLoad={() => setIsLoaded(true)}
        ></model-viewer>
      )}
    </div>
  );
};

export function GalleryPreview() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Posts</h3>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

       <div className="grid grid-cols-3 gap-2">
         {sampleModels.map((modelUrl, index) => {
           const modelNames = ['Astronaut', 'Neil Armstrong', 'Robot', 'Shishkebab', 'Astronaut', 'Neil Armstrong', 'Robot', 'Shishkebab', 'Astronaut'];
           return (
             <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer">
               <ModelViewerThumbnail
                 gltfUrl={modelUrl}
                 alt={`${modelNames[index]} 3D Model`}
                 index={index}
               />
             </div>
           );
         })}
       </div>
    </div>
  )
}
