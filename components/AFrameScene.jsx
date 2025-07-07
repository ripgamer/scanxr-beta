// components/ARScene.js
'use client';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

const AFrameScene = () => {
  const sceneRef = useRef(null);
  const [isARReady, setIsARReady] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('Initializing...');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Wait for scripts to load
      const checkScripts = () => {
        if (window.AFRAME && window.AFRAME.registerComponent) {
          console.log('A-Frame and AR.js loaded');
          
          // Request camera access
          navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 960 }
            } 
          })
          .then(stream => {
            console.log('Camera access granted');
            setCameraStatus('Camera ready - Point at Hiro marker');
            setIsARReady(true);
            
            // Stop the stream as AR.js will handle it
            stream.getTracks().forEach(track => track.stop());
            
            // Add event listeners after scene is ready
            setTimeout(() => {
              const marker = document.getElementById('hiro-marker');
              if (marker) {
                marker.addEventListener('markerFound', () => {
                  setCameraStatus('🎯 Marker detected!');
                  console.log('Marker found');
                });
                
                marker.addEventListener('markerLost', () => {
                  setCameraStatus('🔍 Looking for marker...');
                  console.log('Marker lost');
                });
              }
            }, 2000);
          })
          .catch(err => {
            console.error('Camera error:', err);
            setCameraStatus('Camera access denied');
          });
        } else {
          setTimeout(checkScripts, 100);
        }
      };
      
      checkScripts();
    }
  }, []);

  return (
    <>
      <Head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/aframe/1.4.0/aframe.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/ar.js/2.2.2/aframe-ar.min.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>
      
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#000',
        overflow: 'hidden'
      }}>
        {/* A-Frame Scene */}
        <a-scene
          ref={sceneRef}
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; trackingMethod: best; sourceWidth: 1280; sourceHeight: 960; displayWidth: 1280; displayHeight: 960; cameraParametersUrl: https://ar-js-org.github.io/AR.js/data/data/camera_para.dat;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true; colorManagement: true; sortObjects: true;"
          background="transparent"
          style={{ 
            width: '100%', 
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {/* Hiro Marker */}
          <a-marker preset="hiro" id="hiro-marker">
            {/* Main Animated Cube */}
            <a-box
              position="0 0.5 0"
              rotation="0 45 0"
              scale="1 1 1"
              color="#4CC3D9"
              shadow="cast: true; receive: true"
              animation="property: rotation; to: 360 405 360; loop: true; dur: 4000; easing: linear"
              animation__scale="property: scale; to: 1.2 1.2 1.2; direction: alternate; loop: true; dur: 2000; easing: easeInOutQuad"
            >
              {/* Inner cube */}
              <a-box
                position="0 0 0"
                scale="0.8 0.8 0.8"
                color="#EF2D5E"
                opacity="0.7"
                animation="property: rotation; to: -360 -405 -360; loop: true; dur: 3000; easing: linear"
              />
            </a-box>

            {/* Success Text */}
            <a-text
              value="AR WORKS!"
              position="0 2 0"
              align="center"
              color="#FFFFFF"
              scale="3 3 3"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear"
            />

            {/* Ground plane */}
            <a-plane
              position="0 0 0"
              rotation="-90 0 0"
              width="4"
              height="4"
              color="#7BC8A4"
              opacity="0.3"
              shadow="receive: true"
            />

            {/* Moving sphere */}
            <a-sphere
              position="2 0.5 0"
              radius="0.3"
              color="#FFC65D"
              animation="property: position; to: -2 0.5 0; direction: alternate; loop: true; dur: 3000; easing: easeInOutSine"
            />

            {/* Pulsing cylinder */}
            <a-cylinder
              position="0 1 -2"
              radius="0.2"
              height="1"
              color="#FF6B6B"
              animation="property: scale; to: 1 2 1; direction: alternate; loop: true; dur: 1500; easing: easeInOutBounce"
            />
          </a-marker>

          {/* Camera */}
          <a-camera
            gps-camera
            rotation-reader
            look-controls="enabled: false"
            wasd-controls="enabled: false"
          />
        </a-scene>

        {/* Status Overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '10px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          zIndex: 999,
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            📱 AR Camera Status
          </div>
          <div style={{ fontSize: '14px' }}>
            {cameraStatus}
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '10px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          zIndex: 999
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            📋 Instructions:
          </div>
          <div style={{ marginBottom: '5px' }}>
            1. Allow camera access when prompted
          </div>
          <div style={{ marginBottom: '5px' }}>
            2. Point camera at Hiro marker
          </div>
          <div style={{ marginBottom: '5px' }}>
            3. Keep marker centered in view
          </div>
          <div style={{ marginBottom: '10px' }}>
            4. Look for the 3D cube!
          </div>
          <div style={{ fontSize: '12px' }}>
            Need marker? 
            <a 
              href="https://ar-js-org.github.io/AR.js/data/images/hiro.png" 
              target="_blank" 
              style={{ color: '#4CC3D9', marginLeft: '5px' }}
            >
              Download Hiro marker
            </a>
          </div>
        </div>

        {/* Loading indicator */}
        {!isARReady && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.9)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            zIndex: 1000,
            fontSize: '18px'
          }}>
            <div style={{ marginBottom: '15px' }}>🔄 Loading AR...</div>
            <div style={{ fontSize: '14px' }}>
              Requesting camera access...
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #000;
        }
        
        html, body {
          height: 100%;
        }
        
        #__next {
          height: 100%;
        }
      `}</style>
    </>
  );
};

export default AFrameScene;