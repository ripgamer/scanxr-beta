'use client';

import React from 'react';
import { useState, useEffect } from 'react';

const ModelViewer = ({ gltfUrl, usdzUrl, alt = '3D model' }) => {
    const [showViewer, setShowViewer] = useState(false);

    useEffect(() => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isAndroid = /android/.test(userAgent);
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isDesktop = !isAndroid && !isIOS;
  
      if (isAndroid) {
        const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(gltfUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
          gltfUrl
        )};end;`;
        window.location.href = sceneViewerUrl;
      } else if (isIOS && usdzUrl) {
        const a = document.createElement('a');
        a.rel = 'ar';
        a.href = usdzUrl;
        a.click();
      } else {
        setShowViewer(true); // Desktop fallback — show 3D viewer
      }
    }, [gltfUrl, usdzUrl]);
  
    useEffect(() => {
      // Inject model-viewer CDN if not already present
      const id = 'model-viewer-cdn';
      if (!document.getElementById(id)) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
        script.id = id;
        document.head.appendChild(script);
      }
    }, []);
  
    if (!showViewer) return null;

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
