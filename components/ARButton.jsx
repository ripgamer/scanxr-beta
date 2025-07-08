'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button'; // shadcn/ui button
import AFrameScene from './AFrameScene';

const ARButton = ({ gltfUrl, buttonText = "Launch AR" }) => {
  const [showAR, setShowAR] = useState(false);

  if (showAR) {
    // Render the AR scene full screen, replacing the button
    return <AFrameScene gltfUrl={gltfUrl} />;
  }

  return (
    <Button
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded shadow hover:from-blue-600 hover:to-purple-700 transition-all"
      onClick={() => setShowAR(true)}
    >
      {buttonText}
    </Button>
  );
};

export default ARButton;
