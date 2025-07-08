//ARbutton component takes gtlr link and passes it to AFrameScene > then shows the ar view

'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AFrameScene from './AFrameScene';

const isIOS = () =>
  typeof window !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream;

const isAndroid = () =>
  typeof window !== 'undefined' &&
  /Android/.test(navigator.userAgent);

const isMobile = () => isIOS() || isAndroid();

const getARLink = (gltfUrl, usdzUrl) => {
  if (isIOS() && usdzUrl) {
    return usdzUrl;
  }
  return `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(gltfUrl)}&mode=ar_preferred`;
};

const ARButton = ({ gltfUrl, usdzUrl, buttonText = 'View in AR' }) => {
  const [showWebXR, setShowWebXR] = useState(false);

  if (!isMobile() && showWebXR) {
    // Desktop: show the WebXR scene
    return <AFrameScene gltfUrl={gltfUrl} />;
  }

  if (isMobile()) {
    // Mobile: open native AR viewer
    const arLink = getARLink(gltfUrl, usdzUrl);
    return (
      <a
        href={arLink}
        rel="ar"
        target="_blank"
        style={{ textDecoration: 'none' }}
      >
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded shadow hover:from-blue-600 hover:to-purple-700 transition-all">
          {buttonText}
        </Button>
      </a>
    );
  }

  // Desktop: show button to launch WebXR
  return (
    <Button
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded shadow hover:from-blue-600 hover:to-purple-700 transition-all"
      onClick={() => setShowWebXR(true)}
    >
      {buttonText}
    </Button>
  );
};

export default ARButton;
