// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
};

// Initialize Firebase
let app;
let storage;

try {
  validateFirebaseConfig();
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Generate unique file path
export const generateFilePath = (userId, fileType, originalName) => {
  const timestamp = Date.now();
  const fileExtension = originalName.split('.').pop();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${fileType}/${userId}/${timestamp}-${sanitizedName}`;
};

// Upload file with progress tracking
export const uploadFileWithProgress = async (file, path, onProgress = null) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload file to Firebase Storage (simple version)
export const uploadFileToFirebase = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload GLB model with specific validation
export const uploadGLBModel = async (file, userId, onProgress = null) => {
  // Validate file type
  const allowedTypes = ['.glb', '.gltf'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    throw new Error('Invalid file type. Only GLB and GLTF files are allowed.');
  }

  // Validate file size (50MB limit)
  const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSizeInBytes) {
    throw new Error('File size too large. Maximum size is 50MB.');
  }

  const filePath = generateFilePath(userId, 'models', file.name);
  return await uploadFileWithProgress(file, filePath, onProgress);
};

// Upload thumbnail image with specific validation
export const uploadThumbnail = async (file, userId, onProgress = null) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Only image files are allowed for thumbnails.');
  }

  // Validate file size (5MB limit for images)
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    throw new Error('Image size too large. Maximum size is 5MB.');
  }

  const filePath = generateFilePath(userId, 'thumbnails', file.name);
  return await uploadFileWithProgress(file, filePath, onProgress);
};

export { storage, app };