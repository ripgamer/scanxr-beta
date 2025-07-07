'use client';
import React, { useEffect, useState } from 'react';

export default function AFrameScene() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
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
    Promise.all([
      loadScript('https://aframe.io/releases/1.4.2/aframe.min.js'),
      loadScript('https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js'),
    ]).then(() => setScriptsLoaded(true));
  }, []);

  if (!scriptsLoaded) return null;

  return (
    <div style={{ margin: 0, overflow: 'hidden' }}>
      <a-scene embedded arjs>
        <a-marker preset="hiro">
          <a-box position="0 0.5 0" material="opacity: 0.5; color: #4CC3D9;"></a-box>
          <a-sphere position="1 1.25 0" radius="1.25" color="#EF2D5E"></a-sphere>
          <a-cylinder position="-1 0.75 0" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
          <a-plane position="0 0 0" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
} 