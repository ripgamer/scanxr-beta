'use client';

import React from 'react';
import { useEffect } from 'react';

const ModelViewer = ({ src, poster, alt = '3D model', className = '' }) => {

    useEffect(() => {
        const id = 'model-viewer-cdn';
    
        // Prevent multiple loads
        if (!document.getElementById(id)) {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
          script.id = id;
          document.head.appendChild(script);
        }
      }, []);

  return (
    <model-viewer
      src={src}
      poster={poster}
      alt={alt}
      camera-controls
      auto-rotate
      auto-rotate-delay="0"
      rotation-per-second="30deg"
      environment-image="neutral"
      shadow-intensity="1"
      className={className}
      style={{ width: '100%', height: '100%', minHeight: '300px' }}
    ></model-viewer>
  );
};

export default ModelViewer;
