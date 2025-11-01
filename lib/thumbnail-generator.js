// lib/thumbnail-generator.js
// Optional utility to generate thumbnails from 3D models
// This is a client-side implementation using Three.js

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const generateThumbnailFromGLB = async (file, width = 400, height = 300) => {
  return new Promise((resolve, reject) => {
    try {
      // Create scene, camera, renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true 
      });
      
      renderer.setSize(width, height);
      renderer.setClearColor(0xf0f0f0, 1); // Light gray background
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Load GLB file
      const loader = new GLTFLoader();
      const arrayBuffer = file.arrayBuffer();
      
      arrayBuffer.then(buffer => {
        loader.parse(buffer, '', (gltf) => {
          const model = gltf.scene;
          
          // Calculate bounding box and center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Position camera based on model size
          const maxDim = Math.max(size.x, size.y, size.z);
          camera.position.set(maxDim, maxDim, maxDim);
          camera.lookAt(center);
          
          // Center the model
          model.position.sub(center);
          scene.add(model);
          
          // Render the scene
          renderer.render(scene, camera);
          
          // Convert canvas to blob
          renderer.domElement.toBlob((blob) => {
            // Clean up
            renderer.dispose();
            resolve(blob);
          }, 'image/png', 0.9);
          
        }, (error) => {
          console.error('Error loading GLB:', error);
          reject(error);
        });
      }).catch(reject);
      
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      reject(error);
    }
  });
};

// Convert blob to File object
export const blobToFile = (blob, filename) => {
  return new File([blob], filename, { type: blob.type });
};