'use client';

import React from 'react';
import { useEffect } from 'react';

const ModelViewer = ({ gltfUrl, usdzUrl, alt = '3D model' }) => {

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
    <div className="w-full max-w-xl mx-auto">
      <model-viewer
        src={gltfUrl}
        {...(usdzUrl ? { 'ios-src': usdzUrl } : {})}
        alt={alt}
        ar
        ar-modes="scene-viewer quick-look webxr"
        camera-controls
        auto-rotate
        environment-image="neutral"
        style={{ width: '100%', height: '500px' }}
      ></model-viewer>
    </div>
  );
};

export default ModelViewer;
