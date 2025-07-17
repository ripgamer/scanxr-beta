// components/AFrameScene.jsx
'use client';
import { useEffect, useRef, useState } from 'react';

const AFrameScene = ({ gltfUrl }) => {
  const containerRef = useRef(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);

  useEffect(() => {
    let renderer, scene, camera, controller, reticle;
    let hitTestSource = null;
    let hitTestSourceRequested = false;
    let animationId;
    let gltfLoader, loadedGltf = null;
    let cleanupFns = [];

    // Dynamically import Three.js modules
    Promise.all([
      import('three'),
      import('three/examples/jsm/webxr/ARButton.js'),
      import('three/examples/jsm/loaders/GLTFLoader.js')
    ]).then(async ([THREE, { ARButton }, { GLTFLoader }]) => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera();

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      renderer.setAnimationLoop(render);

      // Mount renderer to container
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      // ARButton
      // Start AR session immediately
      if (navigator.xr && navigator.xr.isSessionSupported) {
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
          if (supported) {
            navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'] })
              .then((session) => {
                renderer.xr.setSession(session);
              })
              .catch((err) => {
                console.error('Failed to start AR session:', err);
              });
          } else {
            console.error('WebXR immersive-ar is not supported on this device/browser.');
          }
        });
      } else {
        console.error('WebXR not available in this browser.');
      }

      // Reticle
      reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.07, 0.09, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      );
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      // Lighting
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      // GLTF Loader
      gltfLoader = new GLTFLoader();

      // Controller for tap input
      controller = renderer.xr.getController(0);
      controller.addEventListener('select', async () => {
        if (reticle.visible && gltfUrl) {
          try {
            let model;
            if (!loadedGltf) {
              setModelLoading(true);
              setModelError(null);
              const gltf = await gltfLoader.loadAsync(gltfUrl);
              loadedGltf = gltf;
              setModelLoading(false);
            }
            // Clone the loaded model for each placement
            model = loadedGltf.scene.clone(true);
            model.position.setFromMatrixPosition(reticle.matrix);
            model.quaternion.setFromRotationMatrix(reticle.matrix);
            model.scale.set(0.2, 0.2, 0.2); // Adjust scale as needed
            scene.add(model);
          } catch (err) {
            setModelLoading(false);
            setModelError('Failed to load model');
          }
        }
      });
      scene.add(controller);

      window.addEventListener('resize', onWindowResize);
      cleanupFns.push(() => window.removeEventListener('resize', onWindowResize));

      function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      function render(timestamp, frame) {
        if (frame) {
          const referenceSpace = renderer.xr.getReferenceSpace();
          const session = renderer.xr.getSession();

          if (!hitTestSourceRequested) {
            session.requestReferenceSpace('viewer').then(function (referenceSpace) {
              session.requestHitTestSource({ space: referenceSpace }).then(function (source) {
                hitTestSource = source;
              });
            });

            session.addEventListener('end', function () {
              hitTestSourceRequested = false;
              hitTestSource = null;
            });

            hitTestSourceRequested = true;
          }

          if (hitTestSource && frame) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
              const hit = hitTestResults[0];
              const pose = hit.getPose(renderer.xr.getReferenceSpace());
              reticle.visible = true;
              reticle.matrix.fromArray(pose.transform.matrix);
            } else {
              reticle.visible = false;
            }
          }
        }

        renderer.render(scene, camera);
      }

      // Clean up on unmount
      animationId = renderer.setAnimationLoop(render);
      cleanupFns.push(() => renderer.setAnimationLoop(null));
      cleanupFns.push(() => {
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      });
    });

    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, [gltfUrl]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: '#000',
          overflow: 'hidden',
          zIndex: 0
        }}
      />
      {modelLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 10
        }}>
          Loading model...
        </div>
      )}
      {modelError && (
        <div style={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'red',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 10
        }}>
          {modelError}
        </div>
      )}
    </>
  );
};

export default AFrameScene;