// components/ThreeXRHitTestScene.jsx
'use client';
import { useEffect, useRef } from 'react';

const ThreeXRHitTestScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera, controller, reticle;
    let hitTestSource = null;
    let hitTestSourceRequested = false;
    let animationId;

    // Dynamically import Three.js modules
    Promise.all([
      import('three'),
      import('three/examples/jsm/webxr/ARButton.js')
    ]).then(([THREE, { ARButton }]) => {
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
      document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

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

      // Controller for tap input
      controller = renderer.xr.getController(0);
      controller.addEventListener('select', () => {
        if (reticle.visible) {
          const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.setFromMatrixPosition(reticle.matrix);
          mesh.quaternion.setFromRotationMatrix(reticle.matrix);
          scene.add(mesh);
        }
      });
      scene.add(controller);

      window.addEventListener('resize', onWindowResize);

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
    });

    return () => {
      if (renderer) {
        renderer.setAnimationLoop(null);
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      window.removeEventListener('resize', () => {});
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
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
  );
};

export default ThreeXRHitTestScene;