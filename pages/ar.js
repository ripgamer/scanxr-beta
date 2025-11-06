import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Dynamically import ARScene to avoid SSR issues
const AFrameScene = dynamic(() => import('../templates/AFrameScene'), { 
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: 'white',
      fontSize: '18px',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '20px' }}>🚀 Preparing AR Experience...</div>
      <div style={{ fontSize: '14px', opacity: 0.8 }}>
        Make sure to allow camera access
      </div>
    </div>
  )
});

export default function ARPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#000',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading AR...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>ScanXR - AR Experience</title>
        <meta name="description" content="View 3D models in augmented reality" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>
      <AFrameScene />
    </>
  );
}