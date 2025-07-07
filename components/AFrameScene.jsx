'use client';
import React, { useEffect, useState } from 'react';

export default function AFrameScene() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    // Helper to load a script by URL
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
    // Load A-Frame and AR.js from CDN
    Promise.all([
      loadScript('https://aframe.io/releases/1.4.2/aframe.min.js'),
      loadScript('https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js'),
    ]).then(() => setScriptsLoaded(true));
  }, []);

  if (!scriptsLoaded) return null; // Prevent SSR and render only after scripts are loaded

  return (
    <a-scene
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false;"
    >
      <a-marker preset="hiro">
        <a-box position="0 0.5 0" material="color: yellow;"></a-box>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
} 